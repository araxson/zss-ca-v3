import type { ServiceProcessData } from './service-process.types'

export const serviceProcessData: ServiceProcessData = {
  heading: 'From kickoff to launch in 30 days',
  phases: [
    {
      id: 1,
      title: 'Week 1: Strategy sprint',
      description: 'Discovery workshops, messaging, and a prioritized backlog of launch deliverables.',
    },
    {
      id: 2,
      title: 'Week 2–3: Design & build',
      description: 'High-fidelity design, responsive builds, and CMS wiring handled in parallel.',
    },
    {
      id: 3,
      title: 'Week 4: Launch & optimize',
      description: 'QA, analytics tagging, deployment, and a measurement plan for the next iteration.',
    },
  ],
}
