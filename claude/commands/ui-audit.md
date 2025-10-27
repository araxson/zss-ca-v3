---
description: Audit and improve UI/UX using shadcn components, fix violations, and maximize component variety
---

# UI/UX Audit & Improvement

**Your Role:** You are a shadcn/ui expert specializing in component composition, design systems, and UI pattern enforcement. Your goal is to identify violations, suggest better component alternatives, and maximize the use of shadcn's full component library.

**Scope:** Entire project (all routes, features, components)

**Reference:** All rules and patterns are documented in `docs/stack-patterns/ui-patterns.md`. Read it first.

---

## Step 1: Read Documentation

```bash
# Read the complete UI patterns documentation
Read docs/stack-patterns/ui-patterns.md
```

This contains:
- All 6 absolute rules
- Component composition patterns
- Typography patterns (slots vs standalone HTML)
- Detection commands
- Common violations and fixes

---

## Step 2: Discover Available Components

```typescript
// List all available shadcn components
mcp__shadcn__list-components()
```

**Why:** You need to know what's available to suggest better alternatives.

---

## Step 3: Scan for Violations

Run detection commands from `docs/stack-patterns/ui-patterns.md`:

```bash
# 1. Custom sizing on component slots
rg "(CardTitle|CardDescription|AlertTitle|AlertDescription|DialogTitle|DialogDescription).*className.*(text-[0-9]|font-|leading-|tracking-)" --type tsx

# 2. Wrappers inside slots
rg "<(CardTitle|AlertTitle|DialogTitle)>.*<(span|p|div|h[1-6])" --type tsx

# 3. Arbitrary colors
rg "(bg|text|border)-(blue|red|green|yellow|purple|pink|indigo|gray|slate|zinc)-[0-9]+" --type tsx

# 4. Inline styles
rg "style=\{\{" --type tsx

# 5. Incomplete compositions
rg "<Card[^>]*>.*<(h[1-6]|p|div class)" --type tsx
```

---

## Step 4: Identify Component Upgrade Opportunities

**Goal:** Maximize use of shadcn's component library for better UX and consistency.

### Look for patterns that could use specialized components:

**Multiple buttons → `button-group`:**
```tsx
// ❌ Before
<div className="flex gap-2">
  <Button>Save</Button>
  <Button variant="outline">Cancel</Button>
</div>

// ✅ After (if button-group exists)
<ButtonGroup>
  <Button>Save</Button>
  <Button variant="outline">Cancel</Button>
</ButtonGroup>
```

**Repeated input patterns → `input-group` or `field`:**
```tsx
// Check if input-group can simplify prefix/suffix patterns
```

**Tab-like divs → `Tabs`:**
```tsx
// ❌ Custom tabs
<div className="flex border-b">
  <button>Tab 1</button>
  <button>Tab 2</button>
</div>

// ✅ Tabs component
<Tabs><TabsList><TabsTrigger>...</TabsTrigger></TabsList></Tabs>
```

**Collapsible sections → `Accordion` or `Collapsible`:**
```tsx
// Check if any expandable sections could use these
```

**Manual tables → `Table` or `data-table`:**
```tsx
// Check if custom table markup could use Table composition
```

**Custom badges/chips → `Badge`:**
```tsx
// Status indicators, labels, tags
```

**Manual tooltips → `Tooltip`:**
```tsx
// Hover hints, helper text
```

**Manual dropdowns → `DropdownMenu`:**
```tsx
// Action menus, context menus
```

**Date inputs → `calendar` or `date-picker`:**
```tsx
// Any date selection could be enhanced
```

**Navigation → `breadcrumb`, `pagination`, `navigation-menu`:**
```tsx
// Check if navigation patterns exist
```

**Empty states → `empty` component:**
```tsx
// "No results" or "No data" states
```

**Keyboard shortcuts → `kbd`:**
```tsx
// Display keyboard shortcuts with proper styling
```

**Multiple related inputs → `input-group` or `field`:**
```tsx
// Group related fields together
```

### How to Identify:

1. **Read component files** - Look at current implementation
2. **Check shadcn docs** - `mcp__shadcn__get_component_docs({ component: 'name' })`
3. **Suggest upgrades** - If a specialized component exists, propose replacing custom markup
4. **Prioritize variety** - Use the full component library, not just Card/Button/Input

---

## Step 5: Create Improvement Plan

Use TodoWrite to organize work:

```typescript
TodoWrite({
  todos: [
    { content: "Read docs/stack-patterns/ui-patterns.md", status: "in_progress", activeForm: "Reading UI pattern documentation" },
    { content: "List all available shadcn components", status: "pending", activeForm: "Listing shadcn components" },
    { content: "Scan for violations across project", status: "pending", activeForm: "Scanning for violations" },
    { content: "Identify component upgrade opportunities", status: "pending", activeForm: "Identifying component upgrades" },
    { content: "Fix violations in [feature/route]", status: "pending", activeForm: "Fixing violations" },
    { content: "Implement component upgrades", status: "pending", activeForm: "Implementing upgrades" },
    { content: "Verify zero violations", status: "pending", activeForm: "Verifying fixes" },
    { content: "Run build to confirm", status: "pending", activeForm: "Running build" },
  ]
})
```

---

## Step 6: Fix Violations

Follow patterns from `docs/stack-patterns/ui-patterns.md`:

- Remove custom sizing from component slots
- Remove wrappers from slots
- Replace arbitrary colors with design tokens
- Complete incomplete compositions
- Use standalone HTML patterns for non-slot text

---

## Step 7: Implement Component Upgrades

For each opportunity identified:

1. **Check if component exists:**
   ```typescript
   mcp__shadcn__get_component_docs({ component: 'component-name' })
   ```

2. **Install if needed:**
   ```bash
   npx shadcn@latest add component-name
   ```

3. **Replace custom markup** with proper component composition

4. **Test and verify** - Ensure UX is improved

---

## Step 8: Verify Fixes

```bash
# Run all detection commands (see Step 3)
# All MUST return 0 results

# Build check
npm run build
```

---

## Step 9: Report Summary

```markdown
## UI/UX Audit Report

### Violations Fixed
- Custom sizing on slots: [count] files
- Arbitrary colors: [count] files
- Wrappers in slots: [count] files
- Incomplete compositions: [count] files
- Inline styles: [count] files

### Component Upgrades
- [Custom markup] → [shadcn component]: [count] instances
  - Files: [list]
  - Benefit: [UX improvement description]

### shadcn Component Variety
- Components used before: [count]
- Components used after: [count]
- New components introduced: [list]

### Files Modified
- [file paths]

### Verification ✅
- Zero violations
- Build passes
- All components properly composed
```

---

## Rules (From ui-patterns.md)

**Critical violations to fix:**
1. ❌ Custom sizing on component slots (CardTitle, AlertDescription, etc.)
2. ❌ Wrappers inside slots (`<CardTitle><span>...</span></CardTitle>`)
3. ❌ Arbitrary colors (`bg-blue-500`, `text-red-600`)
4. ❌ Inline styles (`style={{ ... }}`)
5. ❌ Incomplete compositions (Card without CardHeader/CardTitle/CardContent)
6. ❌ Custom UI when shadcn component exists

**Component slot rule:**
- Slots like `CardTitle`, `AlertDescription` are pre-styled `<div>` elements
- Use with **PLAIN TEXT ONLY** - no className with text-*/font-* styles
- Layout classes OK: `flex`, `gap-*`, `items-*`

**Standalone HTML rule:**
- Outside component slots, use shadcn typography patterns:
  ```tsx
  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
  <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
  <p className="leading-7 [&:not(:first-child)]:mt-6">
  <p className="text-sm text-muted-foreground">
  ```

---

## Tips for Success

1. **Prioritize component variety** - Use specialized components over generic divs
2. **Check MCP docs** - Always verify component exists and read usage
3. **Think composition** - Can you combine multiple components?
4. **Design tokens only** - `bg-primary`, `text-muted-foreground`, never `bg-blue-500`
5. **Complete structures** - Every component has a documented composition pattern
6. **Read ui-patterns.md** - All rules and examples are there

---

**BEGIN AUDIT NOW.**
