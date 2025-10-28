export interface ResourceItem {
  id: string
  title: string
  description: string
  type: 'Guide' | 'Template' | 'Benchmark';
  link: string
  linkLabel?: string
}

export interface ResourcesListData {
  heading: string
  resources: ResourceItem[]
}
