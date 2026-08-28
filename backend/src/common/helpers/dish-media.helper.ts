type DishStepJson = {
  photoKey?: string | null;
};

type DishPhotoJson = {
  key: string;
};

export function extractDishMediaKeys(
  steps: unknown,
  photos: unknown,
): string[] {
  const keys = new Set<string>();

  if (Array.isArray(steps)) {
    for (const step of steps as DishStepJson[]) {
      if (step?.photoKey) {
        keys.add(step.photoKey);
      }
    }
  }

  if (Array.isArray(photos)) {
    for (const photo of photos as DishPhotoJson[]) {
      if (photo?.key) {
        keys.add(photo.key);
      }
    }
  }

  return [...keys];
}
