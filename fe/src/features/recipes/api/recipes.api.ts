import { ApiRoutes } from '@api/apiRoutes'
import { apiJson } from '@api/client'
import { S3Folder } from '@constants/s3-folders'

import type {
  CatalogIngredient,
  CreateDishPayload,
  CreatedDish,
  DishCategory,
  DishDetails,
  DishListOrder,
  DishListResult,
  DishListScope,
  DishListSort,
  MeasurementUnit,
} from '../types/recipe.types'

type ListResponse<T> = {
  data: T[]
}

export const recipesApi = {
  listCategories() {
    return apiJson<ListResponse<DishCategory>>(ApiRoutes.dish.categories)
  },

  list(params: {
    scope: DishListScope
    categoryId?: string
    sort: DishListSort
    order: DishListOrder
    limit: number
    offset: number
  }) {
    const search = new URLSearchParams({
      scope: params.scope,
      sort: params.sort,
      order: params.order,
      limit: String(params.limit),
      offset: String(params.offset),
    })
    if (params.categoryId) search.set('categoryId', params.categoryId)

    return apiJson<DishListResult>(
      `${ApiRoutes.dish.collection}?${search.toString()}`,
    )
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

  getById(id: string) {
    return apiJson<DishDetails>(ApiRoutes.dish.byId(id))
  },

  like(id: string) {
    return apiJson<void>(`${ApiRoutes.dish.byId(id)}/like`, { method: 'POST' })
  },

  unlike(id: string) {
    return apiJson<void>(`${ApiRoutes.dish.byId(id)}/like`, { method: 'DELETE' })
  },

  create(payload: CreateDishPayload) {
    return apiJson<CreatedDish>(ApiRoutes.dish.collection, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  update(
    id: string,
    payload: Omit<CreateDishPayload, 'description' | 'cookTime'> & {
      description?: string
      cookTime?: number | null
    },
  ) {
    return apiJson<DishDetails>(ApiRoutes.dish.byId(id), {
      method: 'PATCH',
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
