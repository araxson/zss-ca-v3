# Charts & Analytics - Quick Fix Guide

**Date:** November 5, 2025
**Status:** URGENT - WCAG Violation Present
**Time to Fix:** 1 hour

---

## Critical Issues (Fix Immediately)

### 1. Missing accessibilityLayer ❌ WCAG VIOLATION

**Impact:** Keyboard users and screen reader users CANNOT access chart data

**Files to Fix:**
```bash
features/admin/analytics/components/analytics-page-feature.tsx
features/admin/dashboard/components/growth-trend-chart.tsx
features/admin/dashboard/components/site-status-chart.tsx
features/admin/dashboard/components/subscription-distribution-chart.tsx
features/client/analytics/components/analytics-chart.tsx
features/client/dashboard/components/dashboard-sites-chart.tsx
```

**Find & Replace Pattern:**
```diff
- <BarChart data={data}>
+ <BarChart accessibilityLayer data={data}>
```

**Total Occurrences:** 8 charts (find all `<BarChart` and add `accessibilityLayer`)

---

### 2. Deprecated Chart Color Wrapper

**File:** `features/admin/analytics/components/analytics-page-feature.tsx`
**Line:** 173

**Fix:**
```diff
- <Bar dataKey="value" fill="hsl(var(--chart-2))" />
+ <Bar dataKey="value" fill="var(--chart-2)" />
```

---

### 3. Remove ResponsiveContainer

**File:** `features/admin/analytics/components/analytics-page-feature.tsx`
**Lines:** ~122-140, ~158-176

**Problem:** Using both ChartContainer AND ResponsiveContainer (redundant)

**Fix:**
1. Remove `ResponsiveContainer` import from recharts
2. Remove `<ResponsiveContainer>` wrapper tags
3. Change `h-[300px]` to `min-h-[300px]`

**Before:**
```tsx
<ChartContainer config={...} className="h-[300px]">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      {/* ... */}
    </BarChart>
  </ResponsiveContainer>
</ChartContainer>
```

**After:**
```tsx
<ChartContainer config={...} className="min-h-[300px]">
  <BarChart accessibilityLayer data={data}>
    {/* ... */}
  </BarChart>
</ChartContainer>
```

---

### 4. Replace Recharts Legend

**Files:**
- `features/admin/dashboard/components/growth-trend-chart.tsx`
- `features/client/analytics/components/analytics-chart.tsx`

**Fix:**
```diff
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
+ ChartLegend,
+ ChartLegendContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
- Legend
} from 'recharts'

// In JSX:
- <Legend />
+ <ChartLegend content={<ChartLegendContent />} />
```

---

## Verification Commands

**After fixes, run these to verify:**

```bash
# Check all charts have accessibilityLayer
rg "BarChart" features/ -A 1 | grep "accessibilityLayer" | wc -l
# Should return 8 (or total number of chart components)

# Verify no deprecated hsl() wrappers remain
rg "hsl\(var\(--chart" features/ -t typescript
# Should return NO results

# Verify no ResponsiveContainer imports in analytics
rg "ResponsiveContainer" features/admin/analytics/ -t typescript
# Should return NO results

# Verify ChartLegend usage
rg "ChartLegend" features/ -t typescript
# Should show imports in growth-trend-chart.tsx and analytics-chart.tsx
```

---

## Testing Checklist

After fixes:
- [ ] Tab key navigates between chart elements
- [ ] Arrow keys move through data points
- [ ] Screen reader announces chart values
- [ ] Charts render in light mode
- [ ] Charts render in dark mode
- [ ] Empty states display properly
- [ ] Tooltips show on hover
- [ ] No console errors

---

## Full Report

See `/docs/ui-ux-reports/charts-analytics-audit.md` for complete analysis including:
- Medium/Low priority improvements
- Data export recommendations
- Mobile optimization strategies
- Color scheme analysis
- Responsive design patterns
- Complete accessibility audit

---

**Estimated Time:**
- ✅ Fix 1 (accessibilityLayer): 15 minutes
- ✅ Fix 2 (chart color): 2 minutes
- ✅ Fix 3 (ResponsiveContainer): 10 minutes
- ✅ Fix 4 (ChartLegend): 30 minutes

**Total: ~1 hour** ⏱️
