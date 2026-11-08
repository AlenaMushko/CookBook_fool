import { createWriteStream, existsSync } from 'fs';
import { join } from 'path';
import PDFDocument from 'pdfkit';

import { formatShoppingQuantity } from './shopping-list.builder';
import { shoppingCopy } from './shopping-list.copy';
import {
  ShoppingLang,
  ShoppingList,
  ShoppingListItem,
} from './shopping-list.types';

const CREAM = '#fbf4ea';
const CARD = '#fffdf8';
const INK = '#2b2620';
const MUTED = '#6b6050';
const SUBTLE = '#8e836d';
const SAGE = '#4a5a44';
const BORDER = '#e6d9c4';

const MARGIN = 40;
const CARD_RADIUS = 12;
const CARD_PAD = 12;
const CHECK = 12;
const PHOTO = 22;
const AMOUNT_W = 78;

type PdfFactory = new (
  options?: PDFKit.PDFDocumentOptions,
) => PDFKit.PDFDocument;

type ShoppingFonts = {
  sans: string;
  serif: string;
  serifItalic: string;
};

const createPdf = PDFDocument as unknown as PdfFactory;

const fontFile = (name: string) => {
  const candidates = [
    join(process.cwd(), 'assets/fonts', name),
    join(process.cwd(), 'backend/assets/fonts', name),
  ];
  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error(`Shopping list font is missing: ${name}`);
  }
  return found;
};

export const shoppingFonts = (): ShoppingFonts => ({
  sans: fontFile('NotoSans-Regular.ttf'),
  serif: fontFile('SourceSerif4-Regular.ttf'),
  serifItalic: fontFile('SourceSerif4-It.ttf'),
});

const loadImages = async (list: ShoppingList) => {
  const urls = [
    ...new Set(
      list.groups.flatMap((group) =>
        group.items.map((item) => item.image).filter((image) => image != null),
      ),
    ),
  ];
  const images = new Map<string, Buffer>();
  await Promise.all(
    urls.map(async (url) => {
      if (!/^https?:\/\//i.test(url)) return;
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(4000),
        });
        if (!response.ok) return;
        const type = response.headers.get('content-type') ?? '';
        if (!type.startsWith('image/')) return;
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.length === 0 || bytes.length > 1_500_000) return;
        images.set(url, bytes);
      } catch {
        /* a missing photo still leaves the ingredient name */
      }
    }),
  );
  return images;
};

export const writeShoppingPdf = async (
  filePath: string,
  fonts: ShoppingFonts,
  list: ShoppingList,
  lang: ShoppingLang,
  shareUrl: string,
) => {
  const images = await loadImages(list);
  await new Promise<void>((resolve, reject) => {
    const doc = new createPdf({
      size: 'A4',
      margin: MARGIN,
      info: { Title: `${list.name}` },
    });
    const stream = createWriteStream(filePath);
    let settled = false;
    const fail = (error: unknown) => {
      if (settled) return;
      settled = true;
      stream.destroy();
      reject(
        error instanceof Error ? error : new Error('Could not write the PDF'),
      );
    };

    stream.on('error', fail);
    stream.on('finish', () => {
      if (settled) return;
      settled = true;
      resolve();
    });
    doc.on('error', fail);
    doc.pipe(stream);

    try {
      doc.registerFont('sans', fonts.sans);
      doc.registerFont('serif', fonts.serif);
      doc.registerFont('serifItalic', fonts.serifItalic);
      draw(doc, list, lang, shareUrl, images);
      doc.end();
    } catch (error) {
      fail(error);
    }
  });
};

const draw = (
  doc: PDFKit.PDFDocument,
  list: ShoppingList,
  lang: ShoppingLang,
  shareUrl: string,
  images: Map<string, Buffer>,
) => {
  const copy = shoppingCopy(lang);
  const collator = new Intl.Collator(lang);
  const left = MARGIN;
  const width = doc.page.width - MARGIN * 2;
  const bottom = () => doc.page.height - MARGIN;
  let y = MARGIN;

  const paintPage = () => {
    doc.save();
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(CREAM);
    doc.restore();
  };
  paintPage();
  doc.on('pageAdded', paintPage);

  const newPage = () => {
    doc.addPage();
    y = MARGIN;
  };

  const ensure = (height: number) => {
    if (y + height <= bottom()) return;
    newPage();
  };

  const textHeight = (
    value: string,
    font: string,
    size: number,
    box: number,
  ) => {
    doc.font(font).fontSize(size);
    return doc.heightOfString(value, { width: box });
  };

  const write = (
    value: string,
    x: number,
    yPos: number,
    font: string,
    size: number,
    color: string,
    box: number,
    align?: PDFKit.Mixins.TextOptions['align'],
  ) => {
    doc.font(font).fontSize(size).fillColor(color);
    doc.text(value, x, yPos, { width: box, align });
  };

  const showOccasion =
    Boolean(list.occasion) &&
    list.occasion?.trim().toLowerCase() !== list.name.trim().toLowerCase();
  const meta = [
    copy.count(copy.recipes, list.dishesCount),
    copy.count(copy.items, list.itemsCount),
    list.servings == null ? null : copy.people(list.servings),
  ]
    .filter((part): part is string => Boolean(part))
    .join('  ·  ');
  const servingsDiffer =
    list.servings == null && list.dishes.some((dish) => dish.servings != null);

  write(copy.title, left, y, 'serifItalic', 26, INK, width);
  y += textHeight(copy.title, 'serifItalic', 26, width) + 4;
  write(list.name, left, y, 'serif', 16, INK, width);
  y += textHeight(list.name, 'serif', 16, width) + 2;
  if (showOccasion && list.occasion) {
    write(list.occasion, left, y, 'sans', 10, SUBTLE, width);
    y += textHeight(list.occasion, 'sans', 10, width) + 2;
  }
  write(meta, left, y, 'sans', 10, MUTED, width);
  y += textHeight(meta, 'sans', 10, width) + 2;
  if (servingsDiffer) {
    write(copy.servingsDiffer, left, y, 'sans', 10, SUBTLE, width);
    y += textHeight(copy.servingsDiffer, 'sans', 10, width) + 2;
  }
  y += 10;

  const inner = width - CARD_PAD * 2;
  const shareH = textHeight(copy.share, 'sans', 10, inner);
  const urlH = textHeight(shareUrl, 'sans', 9, inner);
  const shareCardH = CARD_PAD + shareH + 6 + urlH + CARD_PAD;
  ensure(shareCardH);
  doc
    .roundedRect(left, y, width, shareCardH, CARD_RADIUS)
    .fillAndStroke(CARD, BORDER);
  write(copy.share, left + CARD_PAD, y + CARD_PAD, 'sans', 10, MUTED, inner);
  doc.fillColor(SAGE);
  doc.font('sans').fontSize(9);
  doc.text(shareUrl, left + CARD_PAD, y + CARD_PAD + shareH + 6, {
    width: inner,
    link: shareUrl,
  });
  y += shareCardH + 16;

  if (list.dishes.length === 0) {
    ensure(18);
    write(copy.noDishes, left, y, 'sans', 11, MUTED, width);
    y += 20;
  } else {
    ensure(18);
    write(copy.dishes, left, y, 'sans', 11, INK, width);
    y += 18;
    let chipX = left;
    let rowH = 0;
    for (const dish of list.dishes) {
      const servings =
        list.servings == null && dish.servings != null
          ? `  ·  ${copy.servings(dish.servings)}`
          : '';
      const label = `${dish.title}${servings}`;
      doc.font('sans').fontSize(10);
      const labelW = Math.min(doc.widthOfString(label), width - 18);
      const chipW = labelW + 18;
      const labelH = doc.heightOfString(label, { width: labelW });
      const chipH = Math.max(20, labelH + 8);
      if (chipX > left && chipX + chipW > left + width) {
        y += rowH + 6;
        chipX = left;
        rowH = 0;
      }
      const before = y;
      ensure(chipH);
      if (y !== before) chipX = left;
      doc
        .roundedRect(chipX, y, chipW, chipH, chipH / 2)
        .fillAndStroke(CARD, BORDER);
      write(
        label,
        chipX + 9,
        y + (chipH - labelH) / 2,
        'sans',
        10,
        INK,
        labelW,
      );
      chipX += chipW + 6;
      rowH = Math.max(rowH, chipH);
    }
    y += rowH + 16;
  }

  if (list.dishes.length > 0 && list.groups.length === 0) {
    ensure(18);
    write(copy.empty, left, y, 'sans', 11, MUTED, width);
    return;
  }

  const nameOf = (item: ShoppingListItem) =>
    lang === 'uk' ? item.nameUk : item.nameEn;
  const amountOf = (item: ShoppingListItem) => {
    const symbol = lang === 'uk' ? item.symbolUk : item.symbolEn;
    return `${formatShoppingQuantity(item.quantity)} ${symbol}`;
  };
  const photoOf = (item: ShoppingListItem) =>
    item.image ? images.get(item.image) : undefined;

  const rowHeight = (item: ShoppingListItem) => {
    const photo = photoOf(item);
    const nameW = inner - CHECK - 8 - (photo ? PHOTO + 8 : 0) - 8 - AMOUNT_W;
    const nameH = textHeight(nameOf(item), 'sans', 11, nameW);
    return Math.max(photo ? PHOTO + 8 : 26, nameH + 10);
  };

  for (const group of list.groups) {
    const items = [...group.items].sort((leftItem, rightItem) =>
      collator.compare(nameOf(leftItem), nameOf(rightItem)),
    );
    let start = 0;
    while (start < items.length) {
      const headerH = 40;
      if (bottom() - y < headerH + 28) newPage();
      let end = start;
      let rowsH = 0;
      while (end < items.length) {
        const next = rowHeight(items[end]);
        const room = bottom() - y - headerH - 8;
        if (rowsH + next > room && end > start) break;
        rowsH += next;
        end += 1;
        if (rowsH >= room) break;
      }
      if (end === start) {
        end = start + 1;
        rowsH = rowHeight(items[start]);
      }

      const cardH = headerH + rowsH + 8;
      doc
        .lineWidth(0.8)
        .roundedRect(left, y, width, cardH, CARD_RADIUS)
        .fillAndStroke(CARD, BORDER);
      write(
        copy.aisles[group.id],
        left + CARD_PAD,
        y + 10,
        'sans',
        12,
        INK,
        inner,
      );
      write(
        copy.count(copy.items, items.length),
        left + CARD_PAD,
        y + 26,
        'sans',
        9,
        SUBTLE,
        inner,
      );
      const lineY = y + headerH - 4;
      doc
        .moveTo(left, lineY)
        .lineTo(left + width, lineY)
        .strokeColor(BORDER)
        .lineWidth(0.6)
        .stroke();

      let rowY = lineY + 4;
      for (const item of items.slice(start, end)) {
        const photo = photoOf(item);
        const rowH = rowHeight(item);
        const nameW =
          inner - CHECK - 8 - (photo ? PHOTO + 8 : 0) - 8 - AMOUNT_W;
        const name = nameOf(item);
        const nameH = textHeight(name, 'sans', 11, nameW);
        const boxY = rowY + (rowH - CHECK) / 2;
        doc
          .lineWidth(1.1)
          .roundedRect(left + CARD_PAD, boxY, CHECK, CHECK, 3)
          .stroke(BORDER);
        let nameX = left + CARD_PAD + CHECK + 8;
        if (photo) {
          const photoY = rowY + (rowH - PHOTO) / 2;
          try {
            doc.save();
            doc.roundedRect(nameX, photoY, PHOTO, PHOTO, 4).clip();
            doc.image(photo, nameX, photoY, {
              cover: [PHOTO, PHOTO],
              align: 'center',
              valign: 'center',
            });
            doc.restore();
          } catch {
            doc.restore();
          }
          nameX += PHOTO + 8;
        }
        write(name, nameX, rowY + (rowH - nameH) / 2, 'sans', 11, INK, nameW);
        write(
          amountOf(item),
          left + width - CARD_PAD - AMOUNT_W,
          rowY + (rowH - 12) / 2,
          'sans',
          10,
          MUTED,
          AMOUNT_W,
          'right',
        );
        rowY += rowH;
      }

      y += cardH + 10;
      start = end;
    }
  }
};
