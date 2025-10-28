import { ResourcesHero } from './sections/resources-hero'
import { ResourcesCategories } from './sections/resources-categories'
import { ResourcesList } from './sections/resources-list'
import { ResourcesCta } from './sections/resources-cta'
import { ItemGroup } from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'

export function ResourcesPage() {
  return (
    <ItemGroup className="container mx-auto flex flex-col gap-16 px-4 py-16 md:py-24">
      <SectionHeader
        title="Resources for scaling web ops"
        description="Playbooks, templates, and guides we rely on to ship reliable marketing sites for our clients."
        align="center"
      />
      <ResourcesHero />
      <ResourcesCategories />
      <ResourcesList />
      <ResourcesCta />
    </ItemGroup>
  )
}
