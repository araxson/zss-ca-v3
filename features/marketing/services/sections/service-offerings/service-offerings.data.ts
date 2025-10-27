import type { ServiceOfferingsData } from './service-offerings.types'

export const serviceOfferingsData: ServiceOfferingsData = {
  heading: 'Included in every subscription',
  cards: [
    {
      id: 'strategy',
      title: 'Strategy & research',
      summary: 'We start with your goals, audience, and brand voice so every page has purpose.',
      features: [
        { title: 'Audience discovery', description: 'User interviews and keyword research to guide messaging.' },
        { title: 'Content planning', description: 'Page outlines, content guidance, and copy support.' },
        { title: 'Launch roadmap', description: 'Milestone planning so stakeholders know what ships when.' },
      ],
    },
    {
      id: 'design',
      title: 'Design & development',
      summary: 'Modern, responsive websites built on a battle-tested Next.js stack.',
      features: [
        { title: 'Component-driven design', description: 'Systemized UI components for faster iterations.' },
        { title: 'Performance obsessed', description: 'Lighthouse, accessibility, and SEO baked into every build.' },
        { title: 'CMS-ready architecture', description: 'Optional CMS integrations without manual maintenance.' },
      ],
    },
    {
      id: 'care',
      title: 'Growth & care',
      summary: 'Stay ahead of customer needs with continuous improvements and analytics insights.',
      features: [
        { title: 'Ongoing enhancements', description: 'Unlimited update requests routed through your roadmap.' },
        { title: 'Monthly analytics digest', description: 'Actionable insights with recommendations from our team.' },
        { title: 'Priority support', description: 'Canadian experts available for rapid assistance when you need it.' },
      ],
    },
  ],
}
