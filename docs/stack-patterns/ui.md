# UI Patterns - shadcn/ui Rules

**STRICT ENFORCEMENT: Use shadcn/ui components exclusively. NO custom styles. NO typography wrappers.**

---

## 🔴 ABSOLUTE REQUIREMENTS - NON-NEGOTIABLE

### Rule 1: NO Custom Styles - shadcn Components ONLY
**Use ONLY shadcn/ui primitives. Custom styling is FORBIDDEN.**

```tsx
// ❌ FORBIDDEN - Custom markup with manual styles
<div className="rounded-lg border-2 border-blue-500 p-6 bg-white shadow-lg">
  <h3 className="text-2xl font-bold text-gray-900">Title</h3>
  <p className="text-gray-600 mt-2">Description text</p>
</div>

// ✅ REQUIRED - shadcn Card primitive
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
</Card>
```

### Rule 2: NO Unnecessary Wrappers
**Don't add unnecessary wrapper elements. Use direct content.**

```tsx
// ❌ FORBIDDEN - Wrapping title/description slots
<CardTitle>
  <span className="text-2xl font-bold text-primary">Title Text</span>
</CardTitle>

<AlertDescription>
  <p className="text-sm text-gray-700">Message here</p>
</AlertDescription>

// ✅ REQUIRED - Plain text in title/description slots
<CardTitle>Title Text</CardTitle>
<AlertDescription>Message here</AlertDescription>

// ❌ FORBIDDEN - Unnecessary wrappers in content
<CardContent>
  <p>Some text</p>  {/* Unnecessary wrapper */}
</CardContent>

<CardFooter>
  <p><Button>Click me</Button></p>  {/* Unnecessary wrapper */}
</CardFooter>

// ✅ REQUIRED - Direct elements in content slots
<CardContent>
  <div className="text-3xl font-semibold">$12,345</div>
  <form>...</form>
</CardContent>

<CardFooter>
  <Button>Click me</Button>
</CardFooter>
```

**Title/Description slots (plain text only):**
- `CardTitle`, `CardDescription`
- `AlertTitle`, `AlertDescription`
- `DialogTitle`, `DialogDescription`
- `SheetTitle`, `SheetDescription`
- `SidebarMenuItem`, `SidebarMenuButton`
- `TabsTrigger`, `DropdownMenuItem`

**Content/Footer slots (direct elements, no unnecessary `<p>` wrappers):**
- `CardContent`, `CardFooter` → Use `<div>`, `<form>`, `<Button>` directly
- `DialogContent`, `SheetContent` → Use direct components
- Use `<p>` only when you need actual paragraph text semantics

### Rule 3: ALWAYS Replace Ad-Hoc Markup with shadcn Primitives
**Assume a shadcn primitive exists (53 available). Never write custom UI first.**

```tsx
// ❌ FORBIDDEN - Ad-hoc markup
<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
  <p className="font-bold text-yellow-800">Warning</p>
  <p className="text-yellow-700">Check your input</p>
</div>

// ✅ REQUIRED - Alert primitive
<Alert variant="warning">
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Check your input</AlertDescription>
</Alert>

// ❌ FORBIDDEN - Custom status badge
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  Active
</span>

// ✅ REQUIRED - Badge primitive
<Badge variant="success">Active</Badge>

// ❌ FORBIDDEN - Custom tabs
<div className="flex border-b">
  <button className="px-4 py-2 border-b-2 border-blue-500">Tab 1</button>
  <button className="px-4 py-2 text-gray-500">Tab 2</button>
</div>

// ✅ REQUIRED - Tabs primitive
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
</Tabs>
```

**Decision tree:**
1. Is there a shadcn primitive for this? → **Use it** (check MCP)
2. Can I compose multiple primitives? → **Compose them**
3. Is there truly no primitive? → **Use design tokens ONLY** (bg-muted, text-foreground, etc.)
4. Still stuck? → **Ask before proceeding** (never assume custom UI is acceptable)

### Rule 4: ALWAYS Preserve Documented Composition
**Every shadcn component has a required structure. Follow it EXACTLY.**

```tsx
// ❌ FORBIDDEN - Incorrect Card structure
<Card>
  <h2>Title</h2>
  <p>Description</p>
  <div>Content here</div>
</Card>

// ✅ REQUIRED - Correct Card composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>

// ❌ FORBIDDEN - Incorrect Dialog structure
<Dialog>
  <DialogContent>
    <h2>Are you sure?</h2>
    <p>This action cannot be undone</p>
    <Button>Confirm</Button>
  </DialogContent>
</Dialog>

// ✅ REQUIRED - Correct Dialog composition
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>This action cannot be undone</DialogDescription>
    </DialogHeader>
    <Button>Confirm</Button>
  </DialogContent>
</Dialog>
```

**Required compositions:**
- `Card` → `CardHeader` → `CardTitle` + `CardDescription` + `CardContent` + `CardFooter`
- `Alert` → `AlertTitle` + `AlertDescription`
- `Dialog` → `DialogContent` → `DialogHeader` → `DialogTitle` + `DialogDescription`
- `Sheet` → `SheetContent` → `SheetHeader` → `SheetTitle` + `SheetDescription`
- `Accordion` → `AccordionItem` → `AccordionTrigger` + `AccordionContent`
- `Tabs` → `TabsList` → `TabsTrigger` + `TabsContent`
- `DropdownMenu` → `DropdownMenuTrigger` + `DropdownMenuContent` → `DropdownMenuItem`

### Rule 5: Typography Patterns - Component Slots vs Standalone HTML

**There are NO custom typography wrapper components in this project.**

Use one of two approaches:

#### A) Inside shadcn Components - Use Component Slots

Component slots like `CardTitle`, `CardDescription`, `AlertTitle`, etc. are pre-styled `<div>` elements. Use them with **PLAIN TEXT ONLY** - no custom classes:

```tsx
// ✅ REQUIRED - Plain text in slots
<Card>
  <CardHeader>
    <CardTitle>Dashboard</CardTitle>
    <CardDescription>Welcome back</CardDescription>
  </CardHeader>
</Card>

<Alert>
  <AlertTitle>Notice</AlertTitle>
  <AlertDescription>Important message here</AlertDescription>
</Alert>

// ❌ FORBIDDEN - Custom sizing on slots
<CardTitle className="text-2xl font-bold">Dashboard</CardTitle>
<CardDescription className="text-sm text-gray-600">Description</CardDescription>
```

#### B) Outside shadcn Components - Use Standalone HTML with shadcn Typography

When text is NOT inside a shadcn component slot, use native HTML with shadcn typography patterns:

**Headings:**
```tsx
// h1 - Page title
<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
  Page Title
</h1>

// h2 - Section heading
<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
  Section Title
</h2>

// h3 - Subsection
<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
  Subsection
</h3>

// h4 - Minor heading
<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
  Minor Heading
</h4>
```

**Paragraphs:**
```tsx
// Default paragraph
<p className="leading-7 [&:not(:first-child)]:mt-6">
  Regular paragraph text.
</p>

// Lead text (larger, introductory)
<p className="text-xl text-muted-foreground">
  Introductory or lead paragraph.
</p>

// Muted text (smaller, secondary)
<p className="text-sm text-muted-foreground">
  Secondary or helper text.
</p>
```

**Other elements:**
```tsx
// Small text
<small className="text-sm font-medium leading-none">Label</small>

// Inline code
<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
  npm install
</code>

// Lists
<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
  <li>List item one</li>
  <li>List item two</li>
</ul>

// Blockquote
<blockquote className="mt-6 border-l-2 pl-6 italic">
  "Quote text here"
</blockquote>
```

**Decision Tree:**
```
Is this text inside a shadcn component header/slot?
├─ Yes (CardHeader, AlertTitle, DialogDescription, etc.)
│  └─ Use component slot with plain text
│     ✅ <CardTitle>Text</CardTitle>
│     ❌ <h2 className="text-2xl">Text</h2>
│
└─ No (Page content, CardContent, standalone sections)
   └─ Use native HTML with shadcn typography patterns
      ✅ <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Text</h2>
      ✅ <p className="leading-7">Text</p>
```

**Common violations:**
```tsx
// ❌ WRONG - Custom sizing on component slot
<CardTitle className="text-3xl font-bold">Title</CardTitle>

// ✅ RIGHT - Plain text in slot
<CardTitle>Title</CardTitle>

// ❌ WRONG - Using slot outside component context
<div>
  <CardTitle>Title</CardTitle>  {/* Not in a Card! */}
</div>

// ✅ RIGHT - Use standalone HTML pattern
<div>
  <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Title</h2>
</div>
```

### Rule 6: NEVER Edit components/ui/*.tsx
**ALL changes happen in feature/layout files ONLY.**

```bash
# ❌ FORBIDDEN - Editing shadcn components
components/ui/card.tsx          # DON'T TOUCH
components/ui/button.tsx        # DON'T TOUCH
components/ui/typography.tsx    # DON'T TOUCH (DELETE IF EXISTS)

# ✅ REQUIRED - Edit feature files only
features/home/sections/hero/hero.tsx
features/about/about-page.tsx
components/navigation/header.tsx
app/(marketing)/layout.tsx
```

**When you need customization:**
1. Check if it's possible with component props (`variant`, `size`, `className` for layout)
2. Compose multiple primitives instead
3. Use design tokens for spacing/layout only
4. If still blocked, consult team (never edit `components/ui/`)

---

## Quick Reference

| What you need | Where to look |
|---------------|---------------|
| **Component structure** | [Composition Patterns](#composition-patterns) |
| **Design tokens** | [Color & Spacing Tokens](#color--spacing-tokens) |
| **Form patterns** | [Forms](#forms) |
| **Find violations** | [Detection Commands](#detection-commands) |
| **Component docs** | Use `mcp__shadcn__get_component_docs({ component: 'name' })` |

---

## Stack

- **Components:** shadcn/ui (53 primitives)
- **Icons:** lucide-react@0.544.0
- **Theming:** next-themes@0.4.6
- **Toasts:** sonner@2.0.7
- **Tokens:** `app/globals.css` (never edit)

---

## 🚨 Critical Rules - MUST FOLLOW

### 1. NEVER Add Custom Classes to Title/Description Slots

Title and description slots have built-in styling. Use them with **plain text only**:

```tsx
// ❌ FORBIDDEN - Custom typography classes on title/description slots
<CardTitle className="text-3xl font-bold text-primary">Title</CardTitle>
<AlertDescription className="text-sm text-gray-600">Message</AlertDescription>

// ✅ REQUIRED - Plain text in title/description slots
<CardTitle>Title</CardTitle>
<AlertDescription>Message</AlertDescription>
```

### 2. Use Standalone HTML for Non-Slot Text

When text is NOT inside a component slot, use native HTML with shadcn typography patterns:

```tsx
// ✅ REQUIRED - Standalone headings
<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
  Page Title
</h1>

<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
  Section Title
</h2>

// ✅ REQUIRED - Standalone paragraphs
<p className="leading-7 [&:not(:first-child)]:mt-6">
  Regular paragraph text.
</p>

<p className="text-sm text-muted-foreground">
  Secondary or helper text.
</p>
```

**Layout utilities on slots (ALLOWED):**
- Layout: `flex`, `grid`, `flex-row`, `flex-col`, `items-*`, `justify-*`
- Spacing: `gap-*`, `space-*`, `p-*`, `m-*`

```tsx
// ✅ ALLOWED - Layout classes only
<CardHeader className="flex flex-row items-center gap-4">
  <CardTitle>Title</CardTitle>
</CardHeader>
```

**Typography/color on slots (FORBIDDEN):**
- Typography: `text-*`, `font-*`, `leading-*`, `tracking-*`
- Colors: `text-[color]`, `bg-[color]` (except in layout contexts)
- Sizing: Custom text sizes, arbitrary values

### 3. NEVER Use Arbitrary Values

```tsx
// ❌ FORBIDDEN
className="bg-blue-500 text-[#FF0000] p-[24px]"

// ✅ REQUIRED - Design tokens only
className="bg-primary text-destructive p-6"
```

### 3. ALWAYS Use Complete Compositions

```tsx
// ❌ FORBIDDEN - Incomplete structure
<Card>
  <h2>Title</h2>
  <p>Description</p>
</Card>

// ✅ REQUIRED - Complete composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### 5. ALWAYS Explore MCP Before Custom Markup

```typescript
// Before creating ANY custom UI, check if shadcn/ui has it:
mcp__shadcn__list_components()
mcp__shadcn__get_component_docs({ component: 'component-name' })
```

---

## 📌 Important: November 2024 Update

**Text slots are now `<div>` elements (Nov 3, 2024):**

- `CardTitle`, `CardDescription` → `<div>` (not `<h3>`/`<p>`)
- `AlertTitle`, `AlertDescription` → `<div>` (not `<h3>`/`<p>`)
- `DialogTitle`, `DialogDescription` → `<div>` (not `<h2>`/`<p>`)
- All title/description slots across components → `<div>`

**Why:** Better accessibility - you control heading hierarchy.

**Default usage:**
```tsx
// ✅ Use slots as-is (they're styled divs)
<CardTitle>My Title</CardTitle>
```

**When to add semantic HTML:**
```tsx
// ✅ Only if specifically needed for SEO or a11y
<CardTitle>
  <h2>My Title</h2>
</CardTitle>
```

---

## Component Categories

**Always check MCP before building custom UI:**
```typescript
mcp__shadcn__list_components()
mcp__shadcn__get_component_docs({ component: 'name' })
```

### Customer Portal Examples

- **Metric summaries** (`features/customer/dashboard/components/customer-metrics.tsx`) pair each `CardHeader` label with `CardContent` values and avoid custom accent classes.
- **Salon hero banners** (`features/customer/salon-detail/components/salon-header.tsx`) keep media in a `CardContent` block and move text/action controls into a dedicated `CardHeader`.
- **Profile metadata chips** (`features/customer/profile/components/profile-metadata-editor.tsx`) wrap each chip list in its own nested card with a proper header instead of raw divs.
- **Alerts in dialogs** (`features/customer/appointments/components/cancel-appointment-dialog.tsx`) always render `AlertTitle` before the description, even for error states.

### Available Components (53 total)

**Layout & Content**
- `card`, `accordion`, `tabs`, `collapsible`, `separator`, `scroll-area`

**Forms & Inputs**
- `form`, `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `slider`
- `input-otp`, `input-group`, `field`, `label`, `calendar`, `date-picker`

**Overlays**
- `dialog`, `drawer`, `sheet`, `alert-dialog`, `popover`, `tooltip`, `hover-card`

**Navigation**
- `navigation-menu`, `menubar`, `breadcrumb`, `pagination`, `sidebar`, `command`

**Buttons & Actions**
- `button`, `button-group`, `toggle`, `toggle-group`, `dropdown-menu`, `context-menu`

**Feedback**
- `alert`, `toast` (Sonner), `progress`, `skeleton`, `spinner`, `badge`, `sonner`

**Data Display**
- `table`, `data-table`, `avatar`, `chart`, `carousel`, `resizable`, `kbd`

**Typography Slots** (use these, never custom wrappers)
- `CardTitle`, `CardDescription`, `AlertTitle`, `AlertDescription`
- `DialogTitle`, `DialogDescription`, `SheetTitle`, `SheetDescription`

### Pattern Mapping

| Need this UI | Use this component |
|--------------|-------------------|
| Content block | `Card` → CardHeader + CardTitle + CardDescription + CardContent |
| Notice/callout | `Alert` → AlertTitle + AlertDescription |
| Modal popup | `Dialog` → DialogContent + DialogHeader + DialogTitle |
| Side panel | `Sheet` → SheetContent + SheetHeader + SheetTitle |
| Collapsible | `Accordion` → AccordionItem + AccordionTrigger + AccordionContent |
| Tabs | `Tabs` → TabsList + TabsTrigger + TabsContent |
| Dropdown | `DropdownMenu` → DropdownMenuTrigger + DropdownMenuContent |
| Form field | `FormField` → FormItem + FormLabel + FormControl + FormMessage |

---

## Composition Patterns

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

<Card>
  <CardHeader>
    <CardTitle>Revenue</CardTitle>
    <CardDescription>Current month performance</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-semibold">$12,345</div>
    <div className="text-sm text-muted-foreground">Up 12% vs last month</div>
  </CardContent>
  <CardFooter>
    <Button variant="outline">View report</Button>
  </CardFooter>
</Card>
```

**Note:** CardContent and CardFooter contain direct elements (divs, buttons, forms) without unnecessary `<p>` wrappers.

### Alert

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'

<Alert>
  <Terminal className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>
```

### Dialog

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive">Cancel appointment</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm cancellation</DialogTitle>
      <DialogDescription>This cannot be undone.</DialogDescription>
    </DialogHeader>
    {children}
  </DialogContent>
</Dialog>
```

### Sheet (Side Panel)

```tsx
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'

<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>Manage your preferences</SheetDescription>
    </SheetHeader>
    {children}
  </SheetContent>
</Sheet>
```

### Accordion

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings</TabsContent>
  <TabsContent value="password">Password settings</TabsContent>
</Tabs>
```

### Table

```tsx
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead className="text-right">Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell className="text-right">${item.price}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## Forms

**Structure:** React Hook Form + Zod + shadcn/ui Form components

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '' },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

---

## Color & Spacing Tokens

### Design Tokens (REQUIRED)

**Background:**
- `bg-background`, `bg-foreground`, `bg-card`, `bg-popover`
- `bg-primary`, `bg-secondary`, `bg-muted`, `bg-accent`, `bg-destructive`

**Text:**
- `text-foreground`, `text-muted-foreground`, `text-primary`, `text-secondary`
- `text-destructive`, `text-accent-foreground`

**Border:**
- `border-border`, `border-input`, `border-ring`

**Charts:**
- `bg-chart-1`, `bg-chart-2`, `bg-chart-3`, `bg-chart-4`, `bg-chart-5`

**Spacing (Tailwind scale):**
- Use: `p-2`, `p-4`, `p-6`, `gap-2`, `gap-4`, `m-4`, etc.
- Never: `p-[24px]`, `gap-[16px]`, arbitrary pixel values

**❌ FORBIDDEN:**
- Arbitrary colors: `bg-blue-500`, `text-red-600`
- Hex codes: `text-[#FF0000]`
- RGB/HSL: `bg-[rgb(0,0,0)]`
- Arbitrary spacing: `p-[24px]`

---

## Icons & Theming

### Icons (Lucide React)

```tsx
import { Calendar, Users, AlertCircle } from 'lucide-react'

<Calendar className="h-4 w-4 text-muted-foreground" />
<Button size="icon"><Users className="h-4 w-4" /></Button>
```

**Sizes:** `h-4 w-4` (buttons/inline), `h-6 w-6` (headers)

### Toasts (Sonner)

```tsx
// Setup in app/layout.tsx
import { Toaster } from '@/components/ui/sonner'
<Toaster richColors position="top-right" />

// Usage
import { toast } from 'sonner'
toast.success('Saved', { description: 'Changes applied.' })
toast.error('Failed', { description: 'Please try again.' })
```

### Theme Toggle

```tsx
'use client'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { setTheme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="dark:hidden" />
          <Moon className="hidden dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## Accessibility

- Icon-only buttons need `aria-label` and `size="icon"`
- Use shadcn form primitives for proper label associations
- Never remove focus outlines
- Add `sr-only` text for icon-only status indicators
- Remember: Title/description slots are `<div>` (add `<h*>` inside only if needed for SEO/a11y)

```tsx
// Icon-only button
<Button size="icon" aria-label="Delete item">
  <Trash className="h-4 w-4" />
</Button>

// Screen reader only text
<span className="sr-only">Loading...</span>
```

---

## Detection Commands

Run these before committing to find violations:

```bash
# 1. Custom sizing on component slots (FORBIDDEN)
rg "(CardTitle|CardDescription|AlertTitle|AlertDescription|DialogTitle|DialogDescription).*className.*(text-[0-9]|font-|leading-|tracking-)" --type tsx

# 2. Wrappers inside component slots (FORBIDDEN)
rg "<(CardTitle|AlertTitle|DialogTitle)>.*<(span|p|div|h[1-6])" --type tsx

# 3. Arbitrary colors (FORBIDDEN)
rg "(bg|text|border)-(blue|red|green|yellow|purple|pink|indigo|gray|slate|zinc)-[0-9]+" --type tsx
rg "className=.*\[#[0-9a-fA-F]{3,6}\]" --type tsx

# 4. Arbitrary spacing (FORBIDDEN)
rg "className=.*\[[0-9]+px\]" --type tsx

# 5. Incomplete Card compositions (FORBIDDEN)
rg "<Card[^>]*>.*<h[1-6]" --type tsx
rg "<Card>" features --type tsx | grep -v "CardHeader"

# 6. Incomplete Alert compositions (FORBIDDEN)
rg "<Alert[^>]*>.*<p" --type tsx | grep -v "AlertDescription"

# 7. Inline styles (FORBIDDEN)
rg "style=\{\{" --type tsx
```

**Zero violations required before commit.**

---

## 🔒 Strict Enforcement - Pre-Commit Requirements

**ZERO violations allowed. All checks MUST pass before committing.**

### Automated Violation Detection

Run these commands before EVERY commit:

```bash
# 1. Custom sizing on component slots (MUST return 0)
rg "(CardTitle|CardDescription|AlertTitle|AlertDescription|DialogTitle|DialogDescription|SheetTitle|SheetDescription).*className.*(text-[0-9]|font-|leading-|tracking-)" --type tsx features/ components/ app/

# 2. Wrappers inside component slots (MUST return 0)
rg "<(CardTitle|CardDescription|AlertTitle|AlertDescription|DialogTitle|SidebarMenuItem)>.*<(span|p|div|h[1-6])" --type tsx features/

# 3. Arbitrary colors (MUST return 0)
rg "(bg|text|border)-(blue|red|green|yellow|purple|pink|indigo|gray|slate|zinc)-[0-9]+" --type tsx features/
rg "className=.*\[#[0-9a-fA-F]{3,6}\]" --type tsx
rg "className=.*(rgb|hsl)\(" --type tsx

# 4. Arbitrary spacing (MUST return 0)
rg "className=.*\[[0-9]+px\]" --type tsx features/

# 5. Inline styles (MUST return 0)
rg "style=\{\{" --type tsx features/

# 6. Incomplete Card compositions (MUST return 0)
rg "<Card[^>]*>.*<(h[1-6]|p|div class)" --type tsx features/

# 7. Incomplete Alert compositions (MUST return 0)
rg "<Alert[^>]*>.*<p" --type tsx features/ | grep -v "AlertDescription"

# 8. Ad-hoc UI containers (SHOULD return 0)
rg "<div className=\".*rounded.*border.*p-[0-9]" --type tsx features/
```

### Manual Verification Checklist

✅ **Rule 1: NO Custom Styles**
- [ ] All UI elements use shadcn primitives
- [ ] No ad-hoc `<div>` markup with manual styling
- [ ] No custom component wrappers for UI elements

✅ **Rule 2: NO Custom Sizing on Title/Description Slots**
- [ ] CardTitle, CardDescription contain plain text only (no className with text-*/font-*)
- [ ] AlertTitle, AlertDescription contain plain text only
- [ ] DialogTitle, DialogDescription contain plain text only
- [ ] SheetTitle, SheetDescription contain plain text only
- [ ] No `className` with typography/color styles on title/description slots
- [ ] Layout classes only on headers: flex, grid, gap-*, items-*, justify-*

✅ **Rule 3: NO Unnecessary Wrappers**
- [ ] No `<span>`, `<p>` wrappers inside title/description slots
- [ ] Title/description slots contain direct text children only
- [ ] No unnecessary `<p>` wrappers in content/footer slots
- [ ] Content slots use direct elements: `<div>`, `<form>`, `<Button>` without extra wrappers

✅ **Rule 4: Use Standalone HTML Patterns**
- [ ] Standalone headings use shadcn typography patterns (scroll-m-20, etc.)
- [ ] Standalone paragraphs use shadcn patterns (leading-7, text-muted-foreground)
- [ ] No custom arbitrary text sizes outside shadcn patterns

✅ **Rule 5: shadcn Primitives First**
- [ ] Checked MCP for available components before creating custom UI
- [ ] All status indicators use `Badge` component
- [ ] All notices/callouts use `Alert` component
- [ ] All modals use `Dialog` or `Sheet` components
- [ ] All collapsible sections use `Accordion` or `Collapsible`

✅ **Rule 6: Correct Compositions**
- [ ] Card uses CardHeader → CardTitle/CardDescription → CardContent structure
- [ ] Alert uses AlertTitle + AlertDescription
- [ ] Dialog uses DialogHeader → DialogTitle + DialogDescription
- [ ] Sheet uses SheetHeader → SheetTitle + SheetDescription
- [ ] All compositions match shadcn documentation exactly

✅ **Rule 7: NO Editing components/ui/**
- [ ] All changes made in `features/*`, `components/navigation/*`, or `app/*`
- [ ] No modifications to any files in `components/ui/`
- [ ] No new custom UI primitives created

✅ **Design Tokens Only**
- [ ] Using `bg-primary`, `text-foreground`, `text-muted-foreground` (approved tokens)
- [ ] NO `bg-blue-500`, `text-red-600`, or arbitrary Tailwind colors
- [ ] NO hex codes: `#FF0000`, `#3B82F6`
- [ ] NO RGB/HSL: `rgb(255,0,0)`, `hsl(210,100%,50%)`
- [ ] NO arbitrary values: `p-[24px]`, `text-[14px]`

✅ **Build Verification**
```bash
npm run build
# MUST complete with 0 TypeScript errors
```

### Violation Response Protocol

**If ANY detection command returns results:**

1. **STOP immediately** - Do not proceed with commit
2. **Identify violation** - Review the flagged code
3. **Apply correct pattern** - Reference Rules 1-6 above
4. **Re-run detection** - Verify violation is resolved
5. **Commit only when clean** - All checks must pass

**Common violations and fixes:**

```tsx
// Violation: Custom sizing on title slot
<CardTitle className="text-3xl font-bold text-primary">Title</CardTitle>
// Fix: <CardTitle>Title</CardTitle>

// Violation: Wrapped title/description content
<CardTitle><span className="font-bold">Text</span></CardTitle>
<AlertDescription><p>Message</p></AlertDescription>
// Fix:
<CardTitle>Text</CardTitle>
<AlertDescription>Message</AlertDescription>

// Violation: Unnecessary wrapper in content
<CardContent><p>Some text</p></CardContent>
<CardFooter><p><Button>Save</Button></p></CardFooter>
// Fix:
<CardContent><div>Some text</div></CardContent>
<CardFooter><Button>Save</Button></CardFooter>

// Violation: Arbitrary color
<div className="bg-blue-500">Content</div>
// Fix: <Card className="bg-primary">Content</Card>

// Violation: Ad-hoc markup
<div className="rounded border p-4">Message</div>
// Fix: <Alert><AlertDescription>Message</AlertDescription></Alert>

// Violation: Incomplete composition
<Card><h3>Title</h3><p>Text</p></Card>
// Fix:
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Text</CardDescription>
  </CardHeader>
</Card>

// Violation: Plain text without proper pattern
<h2 className="text-2xl font-bold">Section Title</h2>
// Fix: <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Section Title</h2>
```

---

## 🎯 Enforcement Summary

**BEFORE any commit:**
1. Run all detection commands → ALL MUST return 0 results
2. Complete manual checklist → ALL items MUST be checked
3. Run `npm run build` → MUST succeed with 0 errors
4. Review changes → MUST follow all rules

**ZERO tolerance for:**
- Custom sizing/styling on component slots
- Wrapped slot content (no `<span>`, `<p>`, etc. inside slots)
- Arbitrary colors/spacing
- Incomplete compositions
- Custom UI when shadcn primitive exists
- Editing `components/ui/` files

**When in doubt:**
- Check shadcn docs: https://ui.shadcn.com/docs/components
- Use MCP tools: `mcp__shadcn__list_components()` and `mcp__shadcn__get_component_docs()`
- Ask the team
- NEVER proceed with custom UI without verification

---

## Common Refactoring Examples

**Remove custom sizing from slots:**
```tsx
// ❌ Before
<CardTitle className="text-3xl font-bold text-primary">Title</CardTitle>
<CardDescription className="text-sm text-gray-600">Description</CardDescription>

// ✅ After
<CardTitle>Title</CardTitle>
<CardDescription>Description</CardDescription>
```

**Remove unnecessary wrappers:**
```tsx
// ❌ Before
<CardTitle><span className="font-semibold">Title</span></CardTitle>
<AlertDescription><p>Message here</p></AlertDescription>
<CardContent><p>Some content</p></CardContent>
<CardFooter><p><Button>Save</Button></p></CardFooter>

// ✅ After
<CardTitle>Title</CardTitle>
<AlertDescription>Message here</AlertDescription>
<CardContent>
  <div>Some content</div>
</CardContent>
<CardFooter>
  <Button>Save</Button>
</CardFooter>
```

**Fix incomplete Card:**
```tsx
// ❌ Before
<Card><h3>Title</h3><p>Text</p></Card>

// ✅ After
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Text</CardDescription>
  </CardHeader>
</Card>
```

**Use standalone HTML patterns:**
```tsx
// ❌ Before
<h2 className="text-2xl font-bold">Section Title</h2>
<p className="text-gray-600">Description text</p>

// ✅ After
<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Section Title</h2>
<p className="text-sm text-muted-foreground">Description text</p>
```

**Use design tokens:**
```tsx
// ❌ Before
<div className="bg-red-100 text-red-700">Error</div>

// ✅ After
<Alert variant="destructive"><AlertTitle>Error</AlertTitle></Alert>
```

---

**Last Updated:** 2025-10-26
**Changes:**
- Added shadcn typography patterns for standalone HTML elements
- Clarified component slot usage (NO custom sizing/styling)
- Removed references to old typography wrapper components (not in this project)
- Updated detection commands for actual violations
- Nov 3, 2024 shadcn/ui updates included (slots are `<div>` elements)

**MCP Tools:** `mcp__shadcn__list_components()`, `mcp__shadcn__get_component_docs({ component: 'name' })`
**Docs:** https://ui.shadcn.com/docs | **Changelog:** https://ui.shadcn.com/docs/changelog
