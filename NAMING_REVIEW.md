# Naming Convention & Architecture Review

## Current Issues

### 1. INCONSISTENT NAMING (PRIORITY: MEDIUM)

#### Page Files - ALREADY CORRECT ✅
All page files are already in kebab-case (lowercase):
- `src/components/pages/home.tsx` ✅
- `src/components/pages/profile.tsx` ✅
- `src/components/pages/ai.tsx` ✅
- `src/components/pages/systems.tsx` ✅ (just fixed)
- `src/components/pages/practice-ml.tsx` ✅
- `src/components/pages/job-search.tsx` ✅
- `src/components/pages/carousel-showcase.tsx` ✅

#### Component Folders & Files - ALL CORRECT ✅
- `ai-card/ai-card.tsx` ✅
- `carousel/carousel.tsx` ✅
- `system-card/system-card.tsx` ✅
- `profile-card/profile-card.tsx` ✅
- `menu/vertical-menu.tsx` ✅
- `layout/vertical-sidebar-layout.tsx` ✅
- `layout/admin-sidebar-layout.tsx` ✅

**Conclusion**: Naming is actually consistent! All use kebab-case.

---

## 2. REDUNDANT COMPONENTS (PRIORITY: HIGH)

### Problem: Carousel Component Duplication

**Current Structure:**
```
carousel/carousel.tsx          ← Generic carousel component
pages/carousel-showcase.tsx    ← Demo/documentation page
pages/job-search.tsx           ← Also uses Carousel
```

**Issues:**
- `carousel-showcase.tsx` is purely educational (shows how to use Carousel)
- Only `job-search.tsx` needs Carousel in production
- Carousel is a **reusable utility component**, not a page

**Recommendation:**
1. ✅ Keep `carousel/carousel.tsx` as a reusable component
2. ✅ Keep `job-search.tsx` using Carousel (legitimate use)
3. ❌ **REMOVE `carousel-showcase.tsx`** - It's just documentation, not production code

---

## 3. EMPTY DIRECTORIES (PRIORITY: LOW)

### Directory: `src/ml/supervised/`
- **Status**: Empty (Decision-Tree moved to docs/)
- **Action**: DELETE THIS DIRECTORY

### Files to Review:
- `.DS_Store` files (macOS metadata) - Can be ignored (in .gitignore)
- Dist build artifacts - Normal, not needed in cleanup

---

## 4. RECOMMENDED FIXES

### Action 1: Remove Carousel Showcase Page
```bash
# Delete the demo page
rm src/components/pages/carousel-showcase.tsx

# Update App.tsx to remove the import and route
# Line 10: Remove import CarouselShowcase
# Line 36: Remove <Route path="/carousel" element={<CarouselShowcase />} />

# Update VerticalMenu if it has a link
```

### Action 2: Remove Empty Directory
```bash
# Delete empty ml/supervised directory
rmdir src/ml/supervised

# If src/ml becomes empty after, delete it too
rmdir src/ml
```

### Action 3: Update App.tsx Imports
- Remove the carousel-showcase import
- Remove the carousel route

---

## Summary: Architecture is GOOD ✅

Your naming convention is already consistent and follows best practices:
- ✅ **Folders**: kebab-case (e.g., `ai-card`, `system-card`)
- ✅ **Files**: kebab-case (e.g., `ai-card.tsx`, `system-card.tsx`)
- ✅ **React Components**: PascalCase (exported as `AICard`, `SystemCard`)
- ✅ **Route files**: kebab-case matching folder names

**Only action needed:** Remove redundant carousel-showcase page and empty directories.
