import { ApiRoutes } from '@api/apiRoutes'
import { apiJson } from '@api/client'
import { S3Folder } from '@constants/s3-folders'

import type {
  CatalogIngredient,
  CreateDishPayload,
  CreatedDish,
  DishCategory,
  MeasurementUnit,
} from '../types/recipe.types'

type ListResponse<T> = {
  data: T[]
}

export const recipesApi = {
  listCategories() {
    return apiJson<ListResponse<DishCategory>>(ApiRoutes.dish.categories)
  },

  searchIngredients(search: string) {
    const params = new URLSearchParams({
      search,
      limit: '20',
    })
    return apiJson<ListResponse<CatalogIngredient>>(
      `${ApiRoutes.ingredients.search}?${params.toString()}`,
    )
  },

  listUnits() {
    return apiJson<ListResponse<MeasurementUnit>>(ApiRoutes.measurementUnits.list)
  },

  create(payload: CreateDishPayload) {
    return apiJson<CreatedDish>(ApiRoutes.dish.collection, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  uploadPhoto(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folderName', S3Folder.RECIPES)

    return apiJson<{ key: string; url: string }>(ApiRoutes.s3.uploadFile, {
      method: 'POST',
      body: formData,
    })
  },

  deleteFile(key: string) {
    return apiJson<void>(ApiRoutes.s3.deleteFile, {
      method: 'POST',
      body: JSON.stringify({ key }),
    })
  },
}
