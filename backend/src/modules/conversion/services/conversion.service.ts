import { Injectable } from '@nestjs/common';

import { ErrorCode } from '../../../common/constants/error-codes';
import { AppException } from '../../../common/exceptions/app.exception';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { IngredientService } from '../../ingredient/services/ingredient.service';
import { MeasurementUnitService } from '../../measurement-unit/services/measurement-unit.service';
import {
  ConvertRequestDto,
  ConvertResponseDto,
  CreateUserConversionDto,
  DeleteUserConversionResDto,
  EffectiveConversionResDto,
  GetEffectiveConversionQueryDto,
  UpdateUserConversionDto,
  UserConversionListResDto,
  UserConversionResDto,
} from '../models/conversion.dto';
import { ConversionRepository } from '../repositories/conversion.repository';

export type ConversionSource =
  'USER_INGREDIENT_RULE' | 'GLOBAL_INGREDIENT_RULE' | 'GENERIC_UNIT_RULE';

@Injectable()
export class ConversionService {
  constructor(
    private readonly conversionRepository: ConversionRepository,
    private readonly ingredientService: IngredientService,
    private readonly measurementUnitService: MeasurementUnitService,
  ) {}

  public async convert(
    dto: ConvertRequestDto,
    userData: IUserData,
  ): Promise<ConvertResponseDto> {
    await this.ingredientService.findByIdOrThrow(dto.ingredientId);
    await this.measurementUnitService.findByIdOrThrow(dto.fromUnitId);
    await this.measurementUnitService.findByIdOrThrow(dto.toUnitId);

    if (dto.fromUnitId === dto.toUnitId) {
      return {
        quantity: dto.quantity,
        unitId: dto.toUnitId,
        source: 'GENERIC_UNIT_RULE',
        isPersonal: false,
        isOwner: false,
      };
    }

    const effective = await this.resolveEffectiveRule(
      userData.userId,
      dto.ingredientId,
      dto.fromUnitId,
      dto.toUnitId,
    );

    return {
      quantity: dto.quantity * effective.factor,
      unitId: dto.toUnitId,
      source: effective.source,
      isPersonal: effective.isPersonal,
      isOwner: effective.isOwner,
      userRuleId: effective.userRuleId,
    };
  }

  public async getEffectiveConversion(
    query: GetEffectiveConversionQueryDto,
    userData: IUserData,
  ): Promise<EffectiveConversionResDto> {
    await this.ingredientService.findByIdOrThrow(query.ingredientId);
    await this.measurementUnitService.findByIdOrThrow(query.fromUnitId);
    await this.measurementUnitService.findByIdOrThrow(query.toUnitId);

    if (query.fromUnitId === query.toUnitId) {
      return {
        factor: 1,
        source: 'GENERIC_UNIT_RULE',
        isPersonal: false,
        isOwner: false,
      };
    }

    return await this.resolveEffectiveRule(
      userData.userId,
      query.ingredientId,
      query.fromUnitId,
      query.toUnitId,
    );
  }

  public async getUserConversions(
    userData: IUserData,
  ): Promise<UserConversionListResDto> {
    const rules = await this.conversionRepository.findUserRules(
      userData.userId,
    );
    return { data: rules.map((rule) => this.toUserRuleDto(rule)) };
  }

  public async saveUserConversion(
    dto: CreateUserConversionDto,
    userData: IUserData,
  ): Promise<UserConversionResDto> {
    await this.ingredientService.findByIdOrThrow(dto.ingredientId);
    await this.measurementUnitService.findByIdOrThrow(dto.fromUnitId);
    await this.measurementUnitService.findByIdOrThrow(dto.toUnitId);

    if (dto.fromUnitId === dto.toUnitId) {
      throw new AppException(
        ErrorCode.VALIDATION_ERROR,
        422,
        'fromUnitId and toUnitId must differ',
      );
    }

    const rule = await this.conversionRepository.upsertUserRule({
      userId: userData.userId,
      ingredientId: dto.ingredientId,
      fromUnitId: dto.fromUnitId,
      toUnitId: dto.toUnitId,
      factor: dto.factor,
    });

    return this.toUserRuleDto(rule);
  }

  public async updateUserConversion(
    id: string,
    dto: UpdateUserConversionDto,
    userData: IUserData,
  ): Promise<UserConversionResDto> {
    const updated = await this.conversionRepository.updateUserRule(
      id,
      userData.userId,
      dto.factor,
    );
    if (!updated) {
      throw new AppException(ErrorCode.CONVERSION_NOT_FOUND, 404);
    }
    return this.toUserRuleDto(updated);
  }

  public async deleteUserConversion(
    id: string,
    userData: IUserData,
  ): Promise<DeleteUserConversionResDto> {
    const deleted = await this.conversionRepository.deleteUserRule(
      id,
      userData.userId,
    );
    if (!deleted) {
      throw new AppException(ErrorCode.CONVERSION_NOT_FOUND, 404);
    }
    return { success: true };
  }

  private async resolveEffectiveRule(
    userId: string,
    ingredientId: string,
    fromUnitId: string,
    toUnitId: string,
  ): Promise<EffectiveConversionResDto> {
    const userRule = await this.conversionRepository.findUserIngredientRule(
      userId,
      ingredientId,
      fromUnitId,
      toUnitId,
    );
    if (userRule) {
      return {
        factor: Number(userRule.factor),
        source: 'USER_INGREDIENT_RULE',
        isPersonal: true,
        isOwner: true,
        userRuleId: userRule.id,
      };
    }

    const globalRule = await this.conversionRepository.findGlobalIngredientRule(
      ingredientId,
      fromUnitId,
      toUnitId,
    );
    if (globalRule) {
      return {
        factor: Number(globalRule.factor),
        source: 'GLOBAL_INGREDIENT_RULE',
        isPersonal: false,
        isOwner: false,
      };
    }

    const genericRule = await this.conversionRepository.findGenericUnitRule(
      fromUnitId,
      toUnitId,
    );
    if (genericRule) {
      return {
        factor: Number(genericRule.factor),
        source: 'GENERIC_UNIT_RULE',
        isPersonal: false,
        isOwner: false,
      };
    }

    throw new AppException(ErrorCode.CONVERSION_NOT_FOUND, 404);
  }

  private toUserRuleDto(rule: {
    id: string;
    ingredientId: string;
    fromUnitId: string;
    toUnitId: string;
    factor: { toString(): string } | number;
  }): UserConversionResDto {
    return {
      id: rule.id,
      ingredientId: rule.ingredientId,
      fromUnitId: rule.fromUnitId,
      toUnitId: rule.toUnitId,
      factor: Number(rule.factor),
      isOwner: true,
    };
  }
}
