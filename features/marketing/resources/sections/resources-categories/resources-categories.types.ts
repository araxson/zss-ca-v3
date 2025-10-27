export interface ResourceCategory {
  id: string
  name: string
  description: string
}

export interface ResourcesCategoriesData {
  heading: string
  categories: ResourceCategory[]
}
