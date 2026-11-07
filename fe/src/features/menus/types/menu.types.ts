export type Menu = {
  id: string
  title: string
  // ...
}

export type MenuPreview = {
  id: string
  name: string
  dishesCount: number
  dishCoverPhotoUrls: string[]
}

export type CreateMenuInput = {
  name: string
  description?: string
  occasion?: string
}

export type UpdateMenuInput = {
  title: string
  // ...
}
