export interface HomeMetric {
  label: string
  value: string
  helper: string
}

export interface HomeMetricsData {
  heading: string
  metrics: HomeMetric[]
}
