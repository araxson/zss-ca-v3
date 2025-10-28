import type { HomeProcessData } from './process.types'

export const homeProcessData: HomeProcessData = {
  heading: 'How our subscription works',
  subheading: 'Launch fast, iterate often. We partner with you for the full lifecycle of your site.',
  steps: [
    {
      id: 1,
      label: 'Step 1',
      title: 'Plan & kickoff',
      description: 'We map goals, collect assets, and schedule your first deliverables within one week.',
    },
    {
      id: 2,
      label: 'Step 2',
      title: 'Design & build',
      description: 'Our team designs responsive pages and integrates content while you review progress asynchronously.',
    },
    {
      id: 3,
      label: 'Step 3',
      title: 'Launch & iterate',
      description: 'Deploy to production with analytics, then keep shipping updates through your subscription.',
    },
  ],
}
