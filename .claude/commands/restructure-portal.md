# Restructure Portal Features

**Mission:** Restructure admin or client portal features to follow the Hybrid Structure Pattern (Pattern 1) as defined in `CLAUDE.md` and `docs/rules/architecture.md`.

**Action Mode:** Analyze current structure, create detailed plan, get user confirmation, then execute restructuring with file moves, updates, and validations.

---

## 📊 Current State Analysis

### Admin Portal
- **Total feature folders:** 6 features (+ 2 utility folders: components, error-boundaries)
- **Total pages:** 11 pages
- **Features requiring restructure:** 2 features with 7 total pages
  1. **clients** (2 pages: list + [id] detail)
  2. **sites** (3 pages: list + new + [id] detail)
- **Already correct structure:** dashboard (1 page), audit-logs (1 page), notifications (1 page), profile (1 page)
- **Shared features:** support (uses features/shared/support - correct placement)

### Client Portal
- **Total feature folders:** 4 features (+ 2 utility folders: components, error-boundaries)
- **Total pages:** 9 pages
- **Features requiring restructure:** 1 feature with 2 total pages
  1. **sites** (2 pages: list + [id] detail)
- **Already correct structure:** dashboard (1 page), profile (1 page), subscription (1 page), notifications (1 page)
- **Shared features:** support (uses features/shared/support - correct placement)

### Total Restructuring Required
- **🎯 3 features** need restructuring (admin/clients, admin/sites, client/sites)
- **📄 9 pages** total will be affected
- **📁 6 new sub-directories** will be created ([id]/ and new/ folders)
- **🔧 Estimated files to move/split:** 15-20 files

---

## 🎯 Objective

Transform portal features from current structure to the new Hybrid Pattern:
- Main page at root level with its own api/, components/
- Sub-pages (detail, create) nested within parent directory
- Mirrors app/ directory structure for clarity
- Each route has its own isolated API and components

---

## 📋 Pre-Flight Checklist

Before starting, verify:
1. ✅ User specified portal: `admin` or `client`
2. ✅ Current structure analyzed with file counts
3. ✅ Target app/ routes identified
4. ✅ Backup strategy confirmed (git commit recommended)
5. ✅ User approval obtained for restructure plan

---

## 🔍 Phase 1: Analysis

### Step 1.1: Analyze Current Structure

```bash
# List all feature directories in the portal
find features/{portal} -maxdepth 1 -type d

# For each feature, count files and identify structure
for dir in features/{portal}/*/; do
  echo "=== $dir ==="
  find "$dir" -type f | wc -l
  tree -L 2 "$dir" 2>/dev/null || ls -R "$dir"
done
```

### Step 1.2: Map to App Routes

```bash
# List all app routes for the portal
find app/\({portal}\)/{portal} -type f -name "page.tsx"

# Map features to routes:
# app/(admin)/admin/sites/page.tsx      → features/admin/sites/
# app/(admin)/admin/sites/[id]/page.tsx → features/admin/sites/[id]/
# app/(admin)/admin/sites/new/page.tsx  → features/admin/sites/new/
```

### Step 1.3: Identify Required Changes

For each feature, determine:
- **Single page** (no sub-routes) → Keep flat structure
- **List + Detail** → Create `[id]/` sub-directory
- **List + Create + Detail** → Create `new/` and `[id]/` sub-directories

---

## 📝 Phase 2: Planning

### Step 2.1: Generate Restructure Plan

For each feature needing changes, create a detailed plan:

```markdown
## Feature: {portal}/{feature}

### Current Structure:
```
features/{portal}/{feature}/
├── admin-{feature}-feature.tsx         (135 lines - SPLIT)
├── {feature}-detail-page-feature.tsx   (57 lines)
├── api/
│   ├── queries/
│   │   └── index.ts
│   └── mutations/
│       └── index.ts
└── components/
    ├── index.ts
    ├── {feature}-table.tsx
    └── {feature}-form.tsx
```

### Target Structure:
```
features/{portal}/{feature}/
├── api/                               # For list page
│   ├── queries/
│   │   ├── index.ts                   (< 50 lines)
│   │   └── {feature}.ts               (< 300 lines)
│   ├── mutations/
│   │   ├── index.ts
│   │   └── bulk-actions.ts            (if needed)
│   └── schema.ts
├── components/
│   ├── index.ts
│   ├── {feature}-table.tsx
│   ├── {feature}-stats.tsx            (extracted from feature file)
│   └── {feature}-filters.tsx          (if needed)
├── [id]/                              # For detail page
│   ├── api/
│   │   ├── queries/
│   │   │   ├── index.ts
│   │   │   └── {feature}-detail.ts
│   │   ├── mutations/
│   │   │   ├── index.ts
│   │   │   ├── update.ts
│   │   │   └── delete.ts
│   │   └── schema.ts
│   ├── components/
│   │   ├── index.ts
│   │   ├── {feature}-detail-card.tsx
│   │   └── edit-{feature}-form.tsx
│   └── index.ts
├── new/                               # For create page (if exists)
│   ├── api/
│   │   ├── mutations/
│   │   │   ├── index.ts
│   │   │   └── create.ts
│   │   └── schema.ts
│   ├── components/
│   │   ├── index.ts
│   │   └── create-{feature}-form.tsx
│   └── index.ts
└── index.ts                           # Main feature export
```

### Actions Required:
1. Create new directories: `[id]/`, `new/`
2. Move existing files:
   - `{feature}-detail-page-feature.tsx` → Split into `[id]/` components
   - Existing API functions → Organize by route
3. Split oversized files:
   - `admin-{feature}-feature.tsx` (135 lines) → Extract stats, filters
4. Create new index.ts files for each sub-directory
5. Update imports in app/ pages
```

### Step 2.2: Present Plan to User

Show the complete plan for ALL features, highlighting:
- Files to be created
- Files to be moved
- Files to be split
- Expected line count changes
- Import updates required

**Get explicit user approval before proceeding.**

---

## 🛠️ Phase 3: Execution

### Step 3.1: Create Directory Structure

```bash
# For each feature requiring restructure
mkdir -p features/{portal}/{feature}/[id]/api/queries
mkdir -p features/{portal}/{feature}/[id]/api/mutations
mkdir -p features/{portal}/{feature}/[id]/components
mkdir -p features/{portal}/{feature}/new/api/mutations
mkdir -p features/{portal}/{feature}/new/components
```

### Step 3.2: Move and Organize API Files

For each feature:

1. **Main page API** (list view):
   - Keep/move query functions to `api/queries/{feature}.ts`
   - Keep/move bulk mutations to `api/mutations/` if applicable
   - Create `api/schema.ts` for list-related schemas

2. **Detail page API** (`[id]/`):
   - Move detail queries to `[id]/api/queries/{feature}-detail.ts`
   - Move update/delete mutations to `[id]/api/mutations/`
   - Create `[id]/api/schema.ts` for detail schemas

3. **Create page API** (`new/`):
   - Move create mutation to `new/api/mutations/create.ts`
   - Create `new/api/schema.ts` for create schemas

### Step 3.3: Reorganize Components

For each feature:

1. **Main page components**:
   - Keep list/table components in root `components/`
   - Extract stats cards from feature files
   - Extract filters if they exist

2. **Detail page components** (`[id]/components/`):
   - Move detail view components
   - Move edit form components
   - Keep focused on single entity display/editing

3. **Create page components** (`new/components/`):
   - Move create form components
   - Keep focused on entity creation

### Step 3.4: Split Oversized Feature Files

For any feature file > 200 lines:

1. **Extract inline logic** to components:
   ```tsx
   // Before (in feature file)
   const stats = { total: ..., active: ... }

   // After (new component)
   // components/{feature}-stats.tsx
   export function {Feature}Stats({ data }) { ... }
   ```

2. **Extract complex sections**:
   - Stats/metrics → `{feature}-stats.tsx`
   - Filters → `{feature}-filters.tsx`
   - Actions → `{feature}-actions.tsx`

3. **Keep feature file simple**:
   ```tsx
   // index.ts (main feature)
   export async function {Feature}PageFeature() {
     const data = await get{Feature}List()
     return (
       <>
         <{Feature}Stats data={data} />
         <{Feature}Table items={data.items} />
       </>
     )
   }
   ```

### Step 3.5: Create Index Files

For every new directory, create index.ts:

```typescript
// features/{portal}/{feature}/index.ts
export * from './api'
export * from './components'

// features/{portal}/{feature}/[id]/index.ts
export { {Feature}DetailPageFeature } from './components/{feature}-detail-page-feature'
export * from './api'

// features/{portal}/{feature}/new/index.ts
export { Create{Feature}PageFeature } from './components/create-{feature}-page-feature'
export * from './api'
```

### Step 3.6: Update App Page Imports

Update all page.tsx files to import from new locations:

```tsx
// Before
import { Admin{Feature}Feature } from '@/features/admin/{feature}'

// After (list page)
import { {Feature}PageFeature } from '@/features/admin/{feature}'

// After (detail page)
import { {Feature}DetailPageFeature } from '@/features/admin/{feature}/[id]'

// After (create page)
import { Create{Feature}PageFeature } from '@/features/admin/{feature}/new'
```

---

## ✅ Phase 4: Validation

### Step 4.1: File Size Validation

```bash
# Check all files meet size limits
find features/{portal} -name "*.ts" -o -name "*.tsx" | while read file; do
  lines=$(wc -l < "$file")
  if [[ "$file" == *"/index.ts"* ]] && [ $lines -gt 50 ]; then
    echo "❌ $file: $lines lines (limit: 50)"
  elif [[ "$file" == *"/components/"* ]] && [ $lines -gt 200 ]; then
    echo "❌ $file: $lines lines (limit: 200)"
  elif [[ "$file" == *"/queries/"* ]] && [ $lines -gt 300 ]; then
    echo "❌ $file: $lines lines (limit: 300)"
  elif [[ "$file" == *"/mutations/"* ]] && [ $lines -gt 300 ]; then
    echo "❌ $file: $lines lines (limit: 300)"
  fi
done
```

### Step 4.2: Structure Validation

Verify each feature follows the pattern:

```bash
# For features with detail pages
test -d "features/{portal}/{feature}/[id]/api" || echo "❌ Missing [id]/api/"
test -d "features/{portal}/{feature}/[id]/components" || echo "❌ Missing [id]/components/"
test -f "features/{portal}/{feature}/[id]/index.ts" || echo "❌ Missing [id]/index.ts"

# For features with create pages
test -d "features/{portal}/{feature}/new/api" || echo "❌ Missing new/api/"
test -d "features/{portal}/{feature}/new/components" || echo "❌ Missing new/components/"
test -f "features/{portal}/{feature}/new/index.ts" || echo "❌ Missing new/index.ts"
```

### Step 4.3: Index File Validation

Ensure all index.ts files export their contents:

```bash
# Check each index.ts has exports
find features/{portal} -name "index.ts" | while read file; do
  if ! grep -q "export" "$file"; then
    echo "❌ $file: No exports found"
  fi
done
```

### Step 4.4: Type Check

```bash
# Run type checking
npm run build --dry-run 2>&1 | grep -i error
```

### Step 4.5: Import Validation

Check for any broken imports:

```bash
# Search for old import patterns
grep -r "from '@/features/{portal}/{feature}/admin-" app/ && echo "❌ Found old imports"
grep -r "from '@/features/{portal}/{feature}/{feature}-detail-page-feature" app/ && echo "❌ Found old imports"
```

---

## 📊 Phase 5: Reporting

Generate a summary report:

```markdown
# Restructure Complete: {portal} Portal

## Summary
- Features restructured: X
- Directories created: Y
- Files moved: Z
- Files split: W
- Total lines refactored: N

## Structure Overview

### Before:
```
features/{portal}/
├── {feature-1}/
│   ├── admin-{feature-1}-feature.tsx (135 lines)
│   └── api/
├── {feature-2}/
│   └── ...
```

### After:
```
features/{portal}/
├── {feature-1}/
│   ├── api/                    (list page)
│   ├── components/
│   ├── [id]/                   (detail page)
│   │   ├── api/
│   │   ├── components/
│   │   └── index.ts
│   └── index.ts
├── {feature-2}/
│   └── ...
```

## Validation Results
✅ All file size limits met
✅ All index.ts files created
✅ All imports updated
✅ Type checking passed
✅ Build successful

## Next Steps
1. Review changes with git diff
2. Test all routes manually
3. Commit changes: "refactor({portal}): restructure to hybrid pattern"
4. Consider adding new pages (analytics, settings) per recommendations
```

---

## 🚨 Safety Rules

### NEVER Edit These
- ❌ `components/ui/*` - shadcn/ui primitives
- ❌ `lib/types/database.types.ts` - Auto-generated
- ❌ `app/globals.css` - Locked

### ALWAYS
- ✅ Get user approval before moving files
- ✅ Maintain all existing functionality
- ✅ Keep server directives (`'use server'`, `'server-only'`)
- ✅ Preserve all type definitions
- ✅ Update imports in all affected files
- ✅ Run validation after each major change

### CRITICAL
- 🔴 Stop if type checking fails
- 🔴 Stop if imports can't be resolved
- 🔴 Stop if user requests halt
- 🔴 Never delete files without confirmation

---

## 📝 Usage

To use this command:

```bash
# In Claude Code
/restructure-portal

# Claude will ask:
"Which portal would you like to restructure? (admin/client)"

# Then provide analysis and plan for approval
```

---

## 🎓 Pattern Reference

See `CLAUDE.md` and `docs/rules/architecture.md` for:
- Complete Pattern 1 (Portal Features - Hybrid Structure)
- File size limits
- Naming conventions
- Index file patterns
- Server directive requirements

---

## 🔄 Rollback Strategy

If issues arise:

```bash
# Stash changes
git stash

# Or reset to last commit
git reset --hard HEAD

# Or restore specific files
git restore features/{portal}/{feature}
```

**Always commit working state before running this command.**

---

---

## 📋 Quick Reference: Exact Features to Restructure

### Admin Portal (2 features, 7 pages)

#### 1. features/admin/clients/
```
Current: Flat structure with separate feature files
Target:
├── api/                    # For /admin/clients (list)
├── components/
├── [id]/                   # For /admin/clients/[id] (detail)
│   ├── api/
│   ├── components/
│   └── index.ts
└── index.ts
```
**Pages affected:** 2
- `/admin/clients` (list)
- `/admin/clients/[id]` (detail)

#### 2. features/admin/sites/
```
Current: Flat structure with separate feature files (135 lines - needs splitting)
Target:
├── api/                    # For /admin/sites (list)
├── components/
├── new/                    # For /admin/sites/new (create)
│   ├── api/
│   ├── components/
│   └── index.ts
├── [id]/                   # For /admin/sites/[id] (detail)
│   ├── api/
│   ├── components/
│   └── index.ts
└── index.ts
```
**Pages affected:** 3
- `/admin/sites` (list)
- `/admin/sites/new` (create)
- `/admin/sites/[id]` (detail)

**File requiring split:** `admin-sites-feature.tsx` (135 lines → extract stats, filters)

---

### Client Portal (1 feature, 2 pages)

#### 1. features/client/sites/
```
Current: Flat structure with separate feature files
Target:
├── api/                    # For /client/sites (list)
├── components/
├── [id]/                   # For /client/sites/[id] (detail)
│   ├── api/
│   ├── components/
│   └── index.ts
└── index.ts
```
**Pages affected:** 2
- `/client/sites` (list)
- `/client/sites/[id]` (detail)

---

### Features NOT Requiring Changes

**Admin:**
- ✅ dashboard (single page - already correct)
- ✅ audit-logs (single page - already correct)
- ✅ notifications (single page - already correct)
- ✅ profile (single page - already correct)
- ✅ support (uses shared feature - correct placement)

**Client:**
- ✅ dashboard (single page - already correct)
- ✅ profile (single page - already correct)
- ✅ subscription (single page - already correct)
- ✅ notifications (single page - already correct)
- ✅ support (uses shared feature - correct placement)

---

## End of Restructure Command

**Remember:** This is a structural refactoring. Functionality should remain identical. Focus on organization, clarity, and adherence to the Hybrid Pattern.
