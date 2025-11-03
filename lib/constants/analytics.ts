/**
 * Empty analytics summary object used as default/fallback
 */
export const EMPTY_ANALYTICS_SUMMARY = {
  totalPageViews: 0,
  totalUniqueVisitors: 0,
  totalConversions: 0,
  averagePageViews: 0,
  averageUniqueVisitors: 0,
  averageConversions: 0,
} as const

/**
 * Default time ranges for analytics queries
 */
export const ANALYTICS_TIME_RANGES = {
  WEEK: 7,
  MONTH: 30,
  QUARTER: 90,
  YEAR: 365,
} as const

/**
 * Analytics metric keys
 */
export const ANALYTICS_METRICS = {
  PAGE_VIEWS: 'page_views',
  UNIQUE_VISITORS: 'unique_visitors',
  CONVERSIONS: 'conversions',
} as const
