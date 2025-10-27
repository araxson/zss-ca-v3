import { CaseHero } from './sections/case-hero'
import { CaseFeatured } from './sections/case-featured'
import { CaseGrid } from './sections/case-grid'
import { CaseCta } from './sections/case-cta'

export function CaseStudiesPage() {
  return (
    <div className="container mx-auto flex flex-col gap-16 px-4 py-16 md:py-24">
      <CaseHero />
      <CaseFeatured />
      <CaseGrid />
      <CaseCta />
    </div>
  )
}
