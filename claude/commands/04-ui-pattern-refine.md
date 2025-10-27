# 04 UI Pattern Refine

**Core Principle:** The Supabase database defines the canonical data shape; UI components must present only schema-backed fields while leaving database structures untouched.

**Role:** shadcn/ui enforcer focusing on accessibility, slot fidelity, and pattern adherence across all 54+ available shadcn components.

**Action Mode:** Identify UI violations and ship frontend code fixes that realign components, data bindings, and accessibility with schema-backed patterns—never modify database primitives.

**Mission:** Audit and refactor UI components to strictly follow `docs/stack-patterns/ui.md` patterns without altering primitives.

## Available Component Library (54+ Components)

**ALWAYS check if a shadcn component exists before creating custom UI:**
```typescript
mcp__shadcn__list_components()
mcp__shadcn__get_component_docs({ component: 'name' })
```

**Component Categories:**

1. **Layout & Content:** Card, Accordion, Tabs, Collapsible, Separator, Scroll Area, Resizable
2. **Forms & Inputs:** Form, Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider, Input OTP, Calendar, Date Picker, Field, Label
3. **Charts & Data Visualization:** Chart (with multiple variants - line, bar, area, pie, radar, radial), Data Table, Table, Avatar
4. **Overlays:** Dialog, Drawer, Sheet, Alert Dialog, Popover, Tooltip, Hover Card, Command
5. **Navigation:** Navigation Menu, Menubar, Breadcrumb, Pagination, Sidebar
6. **Buttons & Actions:** Button, Button Group, Toggle, Toggle Group, Dropdown Menu, Context Menu
7. **Feedback:** Alert, Toast (Sonner), Progress, Skeleton, Spinner, Badge
8. **Utilities:** Carousel, KBD

**Latest Updates:** Check https://ui.shadcn.com/docs/changelog for October 2025 new components and improvements.

## Strict Rules from docs/stack-patterns/ui.md

### Rule 1: NO Custom Styles - shadcn Components ONLY
Use ONLY shadcn/ui primitives. Custom styling is FORBIDDEN.

### Rule 2: NO Unnecessary Wrappers
Don't add unnecessary wrapper elements anywhere:
- **Title/Description slots** (CardTitle, AlertDescription, etc.) → Plain text only, no wrappers
- **Content/Footer slots** (CardContent, CardFooter, etc.) → Direct elements (divs, buttons, forms), no unnecessary `<p>` wrappers
- Use semantic HTML only when structurally necessary (`<form>`, `<div>` for layout)

### Rule 3: ALWAYS Replace Ad-Hoc Markup
Assume a shadcn primitive exists (54+ available). Never write custom UI first. Check MCP if unsure.

### Rule 4: ALWAYS Preserve Documented Composition
Every shadcn component has required structure. Follow it EXACTLY (CardHeader → CardTitle + CardDescription → CardContent).

### Rule 5: Component Slots vs Standalone HTML
- **Inside slots:** Use plain text (e.g., `<CardTitle>Text</CardTitle>`)
- **Outside slots:** Use shadcn typography patterns (e.g., `<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Text</h2>`)

### Rule 6: NEVER Edit components/ui/*.tsx
ALL changes happen in feature/layout files ONLY. Never modify shadcn component source files.

## Inputs
- **Pattern rules:** `docs/stack-patterns/ui.md` (source of truth)
- **Component docs:** shadcn MCP tools and https://ui.shadcn.com/docs/changelog
- **Target files:** Components under `features/**/components/` and shared UI compositions
- **Detection commands:** 8 automated violation detectors

## Execution Plan (Code-Only)

1. **Read `docs/stack-patterns/ui.md`** - Get all rules and approved patterns
2. **Run all 8 detection commands** - Find violations:
   - Custom sizing on component slots
   - Wrappers inside slots
   - Arbitrary colors/spacing
   - Inline styles
   - Incomplete compositions
   - Ad-hoc UI containers
3. **Check component availability** - Use MCP before creating custom UI:
   ```typescript
   mcp__shadcn__list_components()
   mcp__shadcn__get_component_docs({ component: 'chart' }) // Example
   ```
4. **Normalize compositions** - Replace custom markup with shadcn primitives:
   - Custom cards → Card + CardHeader + CardTitle + CardDescription + CardContent
   - Custom notices → Alert + AlertTitle + AlertDescription
   - Custom modals → Dialog/Sheet with proper composition
   - Custom charts → Chart component with appropriate variant
   - Custom data tables → Data Table component
5. **Remove violations** - Fix all detected issues:
   - Remove custom sizing from title/description slots (use plain text)
   - Remove unnecessary wrappers everywhere (no `<span>` in titles, no `<p>` wrapping buttons)
   - Use direct elements in content slots (divs for layout, buttons directly, forms directly)
   - Replace arbitrary colors with design tokens (bg-primary, text-foreground)
   - Complete incomplete compositions
6. **Validate accessibility** - Ensure proper semantics:
   - Icon-only buttons have `aria-label`
   - Form fields use shadcn Form primitives
   - Proper heading hierarchy maintained
7. **Run typecheck** - Verify no regressions after changes

## Deliverable

**Updated components aligned with shadcn conventions:**
- Zero violations from detection commands
- All UI using approved shadcn primitives (54+ available)
- Proper composition structures maintained
- Design tokens only (no arbitrary colors/spacing)
- Accessibility standards met

**Brief completion report:**
- Count of violations found and fixed
- Components refactored
- Detection command results (all must return 0)
