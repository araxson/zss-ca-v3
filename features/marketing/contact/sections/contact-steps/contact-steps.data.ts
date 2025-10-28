import type { ContactStepsData } from './contact-steps.types'

export const contactStepsData: ContactStepsData = {
  heading: 'What to expect next',
  steps: [
    {
      id: 1,
      label: 'Step 1',
      title: 'Discovery call',
      description: 'Tell us about your business, goals, and timeline so we can tailor the engagement.',
    },
    {
      id: 2,
      label: 'Step 2',
      title: 'Proposal & onboarding',
      description: 'Choose a plan, connect billing, and hand off brand assets or site content.',
    },
    {
      id: 3,
      label: 'Step 3',
      title: 'Design & launch',
      description: 'We design, review together, and deploy your new site with ongoing support.',
    },
  ],
}
