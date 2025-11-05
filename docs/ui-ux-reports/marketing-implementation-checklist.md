# Marketing Portal - Implementation Checklist

**Total Time**: 61 minutes
**Priority**: Phase 1 (11 min) recommended before launch

---

## Phase 1: Quick Wins (11 minutes) ⭐ PRE-LAUNCH

### 1. Add ButtonGroup to Hero CTA (2 minutes)

**File**: `features/marketing/home/sections/hero/hero.tsx`

**Lines**: 45-57

**Current Code**:
```tsx
<div
  className="flex flex-wrap justify-center gap-3"
  role="group"
  aria-label={heroData.ctaAriaLabel}
>
  <Button asChild size="lg">
    <Link href={heroData.cta.primary.href}>{heroData.cta.primary.label}</Link>
  </Button>
  <Button asChild size="lg" variant="outline">
    <Link href={heroData.cta.secondary.href}>{heroData.cta.secondary.label}</Link>
  </Button>
</div>
```

**New Code**:
```tsx
import { ButtonGroup } from '@/components/ui/button-group'

<ButtonGroup className="justify-center" role="group" aria-label={heroData.ctaAriaLabel}>
  <Button asChild size="lg">
    <Link href={heroData.cta.primary.href}>{heroData.cta.primary.label}</Link>
  </Button>
  <Button asChild size="lg" variant="outline">
    <Link href={heroData.cta.secondary.href}>{heroData.cta.secondary.label}</Link>
  </Button>
</ButtonGroup>
```

**Steps**:
1. Add import: `import { ButtonGroup } from '@/components/ui/button-group'`
2. Replace `<div>` with `<ButtonGroup>`
3. Keep className, role, and aria-label
4. Test: Buttons should visually group together

---

### 2. Add ButtonGroup to CTA Section (2 minutes)

**File**: `features/marketing/home/sections/cta/cta.tsx`

**Lines**: 29-40

**Current Code**:
```tsx
<div
  className="flex flex-wrap justify-center gap-3"
  role="group"
  aria-label={ctaData.ariaLabel}
>
  <Button asChild variant="secondary">
    <Link href={ctaData.cta.primary.href}>{ctaData.cta.primary.label}</Link>
  </Button>
  <Button asChild variant="outline">
    <Link href={ctaData.cta.secondary.href}>{ctaData.cta.secondary.label}</Link>
  </Button>
</div>
```

**New Code**:
```tsx
import { ButtonGroup } from '@/components/ui/button-group'

<ButtonGroup className="justify-center" role="group" aria-label={ctaData.ariaLabel}>
  <Button asChild variant="secondary">
    <Link href={ctaData.cta.primary.href}>{ctaData.cta.primary.label}</Link>
  </Button>
  <Button asChild variant="outline">
    <Link href={ctaData.cta.secondary.href}>{ctaData.cta.secondary.label}</Link>
  </Button>
</ButtonGroup>
```

**Steps**:
1. Add import: `import { ButtonGroup } from '@/components/ui/button-group'`
2. Replace `<div>` with `<ButtonGroup>`
3. Keep className, role, and aria-label
4. Test: Buttons should visually group together

---

### 3. Improve Badge aria-label in Testimonials (1 minute)

**File**: `features/marketing/home/sections/testimonials/testimonials.tsx`

**Lines**: 82-84

**Current Code**:
```tsx
<Badge variant="secondary" aria-label={`${testimonial.rating} star rating`}>
  {`${testimonial.rating}★`}
</Badge>
```

**New Code**:
```tsx
<Badge variant="secondary" aria-label={`${testimonial.rating} out of 5 stars`}>
  {`${testimonial.rating}★`}
</Badge>
```

**Steps**:
1. Change aria-label text
2. Test with screen reader: Should announce "5 out of 5 stars"

---

### 4. Add aria-describedby to Pricing Tooltips (3 minutes)

**File**: `features/marketing/pricing/sections/pricing-plans/pricing-plan-card.tsx`

**Lines**: 62-103

**Current Code** (page limit tooltip):
```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <button
      type="button"
      className="inline-flex"
      aria-label="What counts as a page?"
    >
      <Info className="size-3 text-muted-foreground" />
    </button>
  </TooltipTrigger>
  <TooltipContent side="top" className="max-w-xs">
    <p className="text-xs">
      Each unique URL path counts as one page. Blog posts, landing pages,
      and service pages all count separately.
    </p>
  </TooltipContent>
</Tooltip>
```

**New Code**:
```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <button
      type="button"
      className="inline-flex"
      aria-label="What counts as a page?"
      aria-describedby="page-limit-tooltip"
    >
      <Info className="size-3 text-muted-foreground" />
    </button>
  </TooltipTrigger>
  <TooltipContent side="top" className="max-w-xs" id="page-limit-tooltip">
    <p className="text-xs">
      Each unique URL path counts as one page. Blog posts, landing pages,
      and service pages all count separately.
    </p>
  </TooltipContent>
</Tooltip>
```

**Repeat for revision limit tooltip** (change ID to "revision-limit-tooltip")

**Steps**:
1. Add `aria-describedby="page-limit-tooltip"` to first button
2. Add `id="page-limit-tooltip"` to first TooltipContent
3. Add `aria-describedby="revision-limit-tooltip"` to second button
4. Add `id="revision-limit-tooltip"` to second TooltipContent
5. Test with screen reader: Should announce tooltip content on focus

---

### 5. Enhance Focus Indicators (3 minutes)

**File**: `app/globals.css`

**Location**: Add after existing base layer

**New Code**:
```css
@layer base {
  /* Existing base styles... */

  /* Enhanced focus indicators for better accessibility */
  *:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
    transition: outline-offset 0.2s ease;
  }

  /* Stronger focus for interactive elements */
  button:focus-visible,
  a:focus-visible,
  [role="button"]:focus-visible {
    outline-width: 3px;
  }
}
```

**Steps**:
1. Open `app/globals.css`
2. Find the `@layer base` section
3. Add the focus-visible styles
4. Test: Tab through the site - focus indicators should be prominent
5. Verify skip link has custom focus styles (already present in layout)

---

## Phase 2: Loading States (20 minutes) 📦 POST-LAUNCH

### 6. Create Skeleton Loading States

Create `loading.tsx` for each page with Skeleton placeholders.

#### 6.1 Pricing Loading (5 minutes)

**File**: `app/(marketing)/pricing/loading.tsx` (NEW FILE)

```tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function PricingLoading() {
  return (
    <div className="container mx-auto flex flex-col gap-16 px-4 py-16 md:py-24">
      {/* Breadcrumb */}
      <Skeleton className="h-6 w-48" />

      {/* Page Title */}
      <div className="flex flex-col items-center text-center gap-4">
        <Skeleton className="h-12 w-3/4 max-w-2xl" />
        <Skeleton className="h-6 w-1/2 max-w-xl" />
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4 border rounded-lg p-6">
            <Skeleton className="h-8 w-32" /> {/* Title */}
            <Skeleton className="h-4 w-full" /> {/* Description */}
            <Skeleton className="h-10 w-28" /> {/* Price */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-10 w-full" /> {/* Button */}
          </div>
        ))}
      </div>
    </div>
  )
}
```

#### 6.2 Contact Loading (3 minutes)

**File**: `app/(marketing)/contact/loading.tsx` (NEW FILE)

```tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function ContactLoading() {
  return (
    <div className="container mx-auto flex flex-col gap-16 px-4 py-16 md:py-24">
      {/* Breadcrumb */}
      <Skeleton className="h-6 w-48" />

      {/* Page Title */}
      <div className="flex flex-col items-center text-center gap-4">
        <Skeleton className="h-12 w-3/4 max-w-2xl" />
        <Skeleton className="h-6 w-1/2 max-w-xl" />
      </div>

      {/* Form */}
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
```

#### 6.3 About Loading (3 minutes)

**File**: `app/(marketing)/about/loading.tsx` (NEW FILE)

```tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function AboutLoading() {
  return (
    <div className="container mx-auto flex flex-col gap-16 px-4 py-16 md:py-24">
      <Skeleton className="h-6 w-48" />
      <div className="flex flex-col items-center text-center gap-4">
        <Skeleton className="h-12 w-3/4 max-w-2xl" />
        <Skeleton className="h-6 w-1/2 max-w-xl" />
      </div>

      {/* Sections */}
      <div className="space-y-16">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4 border rounded-lg p-6">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

#### 6.4 Services Loading (3 minutes)

**File**: `app/(marketing)/services/loading.tsx` (NEW FILE)

```tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function ServicesLoading() {
  return (
    <div className="container mx-auto flex flex-col gap-16 px-4 py-16 md:py-24">
      <Skeleton className="h-6 w-48" />
      <div className="flex flex-col items-center text-center gap-4">
        <Skeleton className="h-12 w-3/4 max-w-2xl" />
        <Skeleton className="h-6 w-1/2 max-w-xl" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4 border rounded-lg p-6">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="space-y-2 mt-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

#### 6.5 Case Studies Loading (3 minutes)

**File**: `app/(marketing)/case-studies/loading.tsx` (NEW FILE)

```tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function CaseStudiesLoading() {
  return (
    <div className="container mx-auto flex flex-col gap-16 px-4 py-16 md:py-24">
      <Skeleton className="h-6 w-48" />
      <div className="flex flex-col items-center text-center gap-4">
        <Skeleton className="h-12 w-3/4 max-w-2xl" />
        <Skeleton className="h-6 w-1/2 max-w-xl" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-4 border rounded-lg p-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-32" />
          </div>
        ))}
      </div>
    </div>
  )
}
```

#### 6.6 Resources Loading (3 minutes)

**File**: `app/(marketing)/resources/loading.tsx` (NEW FILE)

```tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function ResourcesLoading() {
  return (
    <div className="container mx-auto flex flex-col gap-16 px-4 py-16 md:py-24">
      <Skeleton className="h-6 w-48" />
      <div className="flex flex-col items-center text-center gap-4">
        <Skeleton className="h-12 w-3/4 max-w-2xl" />
        <Skeleton className="h-6 w-1/2 max-w-xl" />
      </div>

      {/* Categories */}
      <div className="flex gap-3 justify-center flex-wrap">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-32" />
        ))}
      </div>

      {/* Resource Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-4 border rounded-lg p-6">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Steps for Phase 2**:
1. Create each `loading.tsx` file in the appropriate `app/(marketing)/` directory
2. Copy the corresponding template code
3. Adjust skeleton heights/widths to match actual page layout
4. Test: Navigate to each page and check loading state appears briefly
5. Verify no layout shift when content loads

---

## Phase 3: Polish (30 minutes) ✨ OPTIONAL

### 7. Replace Emoji Icons with Lucide Icons (15 minutes)

**File**: `features/marketing/home/sections/features/features.data.ts` (and similar)

**Current Pattern**:
```tsx
// features.data.ts
{
  id: 'speed',
  icon: '⚡', // Emoji
  iconLabel: 'Lightning bolt icon',
  title: 'Lightning Fast',
  description: '...'
}

// features.tsx
<ItemMedia variant="icon" aria-hidden="true">
  <span aria-hidden role="img" className="text-lg">
    {feature.icon}
  </span>
</ItemMedia>
<span className="sr-only">{feature.iconLabel}</span>
```

**New Pattern**:
```tsx
// features.data.ts
import { Zap, Shield, Clock, Users, Globe, Award } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Feature = {
  id: string
  Icon: LucideIcon // Changed from icon: string
  iconLabel: string
  title: string
  description: string
}

{
  id: 'speed',
  Icon: Zap, // Icon component
  iconLabel: 'Lightning bolt icon',
  title: 'Lightning Fast',
  description: '...'
}

// features.tsx
<ItemMedia variant="icon" aria-hidden="true">
  <feature.Icon className="size-5" aria-hidden="true" />
</ItemMedia>
<span className="sr-only">{feature.iconLabel}</span>
```

**Steps**:
1. Open features.data.ts (and similar data files)
2. Import lucide-react icons
3. Update type definition to use LucideIcon
4. Replace emoji strings with Icon components
5. Update features.tsx to use Icon component
6. Test: Icons should render consistently across devices

**Recommended Icon Mappings**:
- ⚡ → Zap
- 🛡️ → Shield
- ⏱️ → Clock
- 👥 → Users
- 🌍 → Globe
- 🏆 → Award
- 📊 → BarChart
- 🎯 → Target
- 💡 → Lightbulb
- ✨ → Sparkles

---

### 8. Add XS Breakpoint Coverage (10 minutes)

**File**: Various pricing card text elements

**Pattern**: Add `text-xs` for very small screens (<360px)

**Example**:
```tsx
// Before
<p className="text-sm text-muted-foreground">
  {plan.page_limit ? `${plan.page_limit} pages` : 'Unlimited pages'}
</p>

// After
<p className="text-xs sm:text-sm text-muted-foreground">
  {plan.page_limit ? `${plan.page_limit} pages` : 'Unlimited pages'}
</p>
```

**Files to Update**:
- `features/marketing/pricing/sections/pricing-plans/pricing-plan-card.tsx`
- Any small text that might wrap awkwardly on <360px screens

**Steps**:
1. Test site on 320px viewport (smallest common mobile size)
2. Identify text that wraps awkwardly or overflows
3. Add `text-xs sm:text-sm` pattern to those elements
4. Verify improvements on small screens

---

### 9. Audit Icon ARIA Labels (5 minutes)

**Pattern**: Ensure all icon-only buttons have descriptive aria-label

**Checklist**:
- [ ] Carousel navigation buttons (prev/next) - Already have aria-hidden
- [ ] Info tooltip buttons - Already have aria-label
- [ ] Social media icon links (if any) - Check for aria-label
- [ ] Icon-only CTAs (if any) - Check for aria-label

**Steps**:
1. Search codebase for `<button` and `<a` with only icon children
2. Verify each has either:
   - `aria-label` describing the action
   - Visible text label
   - `aria-labelledby` pointing to visible label
3. Add missing aria-labels where needed
4. Test with screen reader

---

## Testing Checklist

After completing any phase:

### Functional Testing
- [ ] All pages load without errors
- [ ] All forms submit successfully
- [ ] All links navigate correctly
- [ ] Breadcrumbs work on all sub-pages
- [ ] Carousel navigation works (keyboard + mouse)
- [ ] Accordion expands/collapses correctly
- [ ] Tooltips appear on hover and focus
- [ ] ButtonGroup buttons visually group

### Accessibility Testing
- [ ] All buttons have proper focus indicators
- [ ] Skip to main content link works
- [ ] Tab order is logical on all pages
- [ ] Screen reader announces all dynamic content
- [ ] Form errors are announced
- [ ] Tooltips are associated with triggers
- [ ] All images have alt text or aria-hidden

### Responsive Testing
- [ ] Mobile layout works on 320px screens
- [ ] Tablet layout works on 768px screens
- [ ] Desktop layout works on 1920px screens
- [ ] Touch targets are at least 44x44px
- [ ] Text is readable without horizontal scrolling

### Performance Testing
- [ ] Lighthouse score 90+
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] No layout shift with Skeleton loading states

---

## Deployment Checklist

Before deploying to production:

- [ ] Phase 1 fixes completed (11 minutes)
- [ ] All tests passing
- [ ] Lighthouse accessibility score 95+
- [ ] No console errors or warnings
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on iOS and Android
- [ ] Verified structured data with Google Rich Results Test
- [ ] Verified forms work (contact form submission)
- [ ] Verified Stripe checkout flow (pricing page)

---

## Post-Deployment

After launching:

- [ ] Complete Phase 2 (loading states) - 20 minutes
- [ ] Complete Phase 3 (polish) - 30 minutes
- [ ] Monitor analytics for user behavior
- [ ] A/B test different CTA variants
- [ ] Collect user feedback
- [ ] Review Web Vitals metrics
- [ ] Update based on user testing

---

**Created**: 2025-01-05
**Total Time**: 61 minutes
**Priority**: Phase 1 (11 min) before launch, Phases 2-3 post-launch
