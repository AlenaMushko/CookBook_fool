export const groupCategories = (categories: { id: string; name: string }[]) => {
  return categories.reduce(
    (acc, category) => {
      const [mainCategory, subCategory] = category.name.split("-");
      const formattedMain = mainCategory.trim();
      const formattedSub = subCategory ? subCategory.trim() : null;

      if (!acc[formattedMain]) {
        acc[formattedMain] = { id: category.id, subCategories: [] };
      }

      if (formattedSub) {
        acc[formattedMain].subCategories.push({
          id: category.id,
          name: formattedSub,
        });
      }

      return acc;
    },
    {} as Record<
      string,
      { id: string; subCategories: { id: string; name: string }[] }
    >
  );
};
