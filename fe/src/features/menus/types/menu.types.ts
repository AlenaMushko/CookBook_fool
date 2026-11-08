export type MenuSectionDetail = {
  id: string
  name: string
  order: number
}

export type MenuDishDetail = {
  dishId: string
  sectionId: string | null
  order: number
  title: string
  cookTime: number | null
  baseServings: number | null
  coverUrl: string | null
}

export type MenuDetail = {
  id: string
  name: string
  description: string | null
  occasion: string | null
  updated: string
  sections: MenuSectionDetail[]
  dishes: MenuDishDetail[]
}

export type MenuStageDraft = {
  id: string
  name: string
}

export type MenuDishDraft = {
  dishId: string
  sectionId: string | null
  title: string
  cookTime: number | null
  baseServings: number | null
  coverUrl: string | null
}

export type MenuBoardDraft = {
  name: string
  description: string
  occasion: string
  sections: MenuStageDraft[]
  dishes: MenuDishDraft[]
}

export type MenuListResponse = {
  data: MenuPreview[]
  meta: {
    limit: number
    offset: number
    total: number
    menusTotal: number
  }
}

export type MenuPreview = {
  id: string
  name: string
  occasion: string | null
  dishesCount: number
  dishIds: string[]
  dishCoverPhotoUrls: string[]
}

export type CreateMenuInput = {
  name: string
  description?: string
  occasion?: string
}

export type UpdateMenuInput = {
  name?: string
  description?: string
  occasion?: string
}
