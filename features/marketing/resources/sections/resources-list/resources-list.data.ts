import { BarChart2, BookOpen, ClipboardList } from 'lucide-react'
import type { ResourcesListData } from './resources-list.types'

export const resourcesListData: ResourcesListData = {
  heading: 'Latest resources',
  resources: [
    {
      id: 'launch-checklist',
      title: 'Website launch checklist',
      description: 'Keep stakeholders aligned with a launch plan covering QA, tracking, and GTM tasks.',
      type: 'Template',
      link: '#launch-checklist',
      linkLabel: 'View launch checklist resource',
      icon: ClipboardList,
      iconLabel: 'Checklist resource icon',
    },
    {
      id: 'conversion-benchmarks',
      title: 'Conversion benchmarks for Canadian SMBs',
      description: 'Benchmark your landing page and lead magnet performance against industry peers.',
      type: 'Benchmark',
      link: '#conversion-benchmarks',
      linkLabel: 'View conversion benchmarks resource',
      icon: BarChart2,
      iconLabel: 'Benchmark resource icon',
    },
    {
      id: 'seo-playbook',
      title: 'Local SEO playbook',
      description: 'Step-by-step guide to launching localized landing pages and schema for service businesses.',
      type: 'Guide',
      link: '#seo-playbook',
      linkLabel: 'View local SEO playbook resource',
      icon: BookOpen,
      iconLabel: 'Guide resource icon',
    },
  ],
}
