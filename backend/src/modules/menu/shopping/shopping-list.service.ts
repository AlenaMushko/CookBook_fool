import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { stat, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { ErrorCode } from '../../../common/constants/error-codes';
import { AppException } from '../../../common/expections/app.exception';
import { AppConfig } from '../../../config/config.type';
import { DishRepository } from '../../dish/repositories/dish.repository';
import { MenuRepository } from '../repositories/menu.repository';
import { buildShoppingList } from './shopping-list.builder';
import { toShoppingLang } from './shopping-list.copy';
import { shoppingFonts, writeShoppingPdf } from './shopping-list.pdf';
import { ShoppingDishInput } from './shopping-list.types';

@Injectable()
export class ShoppingListService {
  constructor(
    private readonly menuRepository: MenuRepository,
    private readonly dishRepository: DishRepository,
    private readonly configService: ConfigService,
  ) {}

  public async getList(menuId: string) {
    const menu = await this.menuRepository.findShoppingSource(menuId);
    if (!menu) {
      throw new AppException(ErrorCode.MENU_NOT_FOUND, 404);
    }

    const dishes = this.toDishes(menu);
    const gramsPerCup = await this.dishRepository.findGramsPerCup(
      dishes.flatMap((dish) => dish.lines.map((line) => line.ingredientId)),
    );

    return buildShoppingList(
      { id: menu.id, name: menu.name, occasion: menu.occasion },
      dishes,
      gramsPerCup,
    );
  }

  public async sendPdf(menuId: string, lang: unknown, res: Response) {
    const list = await this.getList(menuId);
    const filePath = join(tmpdir(), `shopping-${menuId}-${randomUUID()}.pdf`);

    try {
      await writeShoppingPdf(
        filePath,
        shoppingFonts(),
        list,
        toShoppingLang(lang),
        this.shareUrl(menuId),
      );
    } catch (error) {
      await unlink(filePath).catch(() => undefined);
      throw error;
    }

    const { size } = await stat(filePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', size);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Disposition', contentDisposition(list.name));

    const stream = createReadStream(filePath);
    let removed = false;
    const remove = () => {
      if (removed) return;
      removed = true;
      void unlink(filePath).catch(() => undefined);
    };
    stream.on('error', () => {
      remove();
      if (!res.headersSent) {
        res.status(500).end();
        return;
      }
      res.destroy();
    });
    res.on('finish', remove);
    res.on('close', remove);
    stream.pipe(res);
  }

  private shareUrl(menuId: string) {
    const frontendUrl = (
      this.configService.get<AppConfig>('app')?.frontendUrl ??
      'http://localhost:5173'
    ).replace(/\/$/, '');
    return `${frontendUrl}/menus/${menuId}/shopping-list`;
  }

  private toDishes(
    menu: NonNullable<
      Awaited<ReturnType<MenuRepository['findShoppingSource']>>
    >,
  ): ShoppingDishInput[] {
    return menu.dishes.flatMap((row) => {
      const title = row.dish.title.trim();
      if (!title) return [];
      const servings =
        row.dish.baseServings == null ? null : Number(row.dish.baseServings);
      const lines = row.dish.ingredients.flatMap((ingredient) => {
        const nameEn = readIngredientName(ingredient.ingredient.en);
        const nameUk = readIngredientName(ingredient.ingredient.uk) || nameEn;
        const quantity = Number(ingredient.quantity);
        if (!nameEn || !Number.isFinite(quantity) || quantity <= 0) return [];
        return [
          {
            ingredientId: ingredient.ingredientId,
            nameEn,
            nameUk,
            quantity,
            unitCode: ingredient.unit.code,
            unitNameEn: ingredient.unit.nameEn,
            unitNameUk: ingredient.unit.nameUk,
            symbolEn: ingredient.unit.symbolEn,
            symbolUk: ingredient.unit.symbolUk,
            image: ingredient.ingredient.image?.trim() || null,
          },
        ];
      });
      return [
        {
          id: row.dish.id,
          title,
          servings: servings != null && servings > 0 ? servings : null,
          lines,
        },
      ];
    });
  }
}

const readIngredientName = (value: Prisma.JsonValue) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '';
  if (!('name' in value) || typeof value.name !== 'string') return '';
  return value.name.trim();
};

const contentDisposition = (name: string) => {
  const file = shoppingPdfFilename(name);
  const encoded = encodeURIComponent(file);
  const ascii = file.replace(/[^\x20-\x7E]/g, '_');
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
};

const shoppingPdfFilename = (name: string) => {
  const clean = name
    .replace(/[\\/:*?"<>|\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return `shopping-list-${clean || 'menu'}.pdf`;
};
