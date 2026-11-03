export const localizedName = (
  language: string,
  item: { nameEn: string; nameUk: string },
) => {
  return language.toLowerCase().startsWith('uk') ? item.nameUk : item.nameEn
}

export const unitSymbol = (
  language: string,
  unit: { nameEn: string; nameUk: string; symbolEn?: string; symbolUk?: string },
) => {
  const symbol = language.toLowerCase().startsWith('uk')
    ? unit.symbolUk
    : unit.symbolEn
  return symbol || localizedName(language, unit)
}
