import type { HomeMetricsData } from './metrics.types'

export const homeMetricsData: HomeMetricsData = {
  heading: 'Results that compound over every engagement',
  metrics: [
    {
      label: 'Average launch timeline',
      value: '30 days',
      helper: 'From kickoff to production for new marketing sites.',
    },
    {
      label: 'Lead conversion lift',
      value: '+42%',
      helper: 'Median improvement across redesign projects after 90 days.',
    },
    {
      label: 'Support satisfaction',
      value: '98%',
      helper: 'Quarterly CSAT score from retained subscription clients.',
    },
  ],
}
