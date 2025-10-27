export interface CaseStudyListItem {
  id: string
  name: string
  industry: string
  summary: string
  services: string[]
}

export interface CaseGridData {
  heading: string
  cases: CaseStudyListItem[]
}
