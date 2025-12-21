# Button Styling Guide

## Three Main Action Buttons

### 1. Courses Catalog Button (📚 Kurslar katalogi)

```tsx
<Link href="/courses" className="w-full sm:w-auto">
  <Button 
    size="lg" 
    className="gap-3 w-full sm:w-auto" 
    variant="outline"
  >
    <BookOpen className="w-5 h-5" />
    <span>Kurslar katalogi</span>
  </Button>
</Link>
```

**Styling:**
- **Variant:** Outline (border with hover background)
- **Size:** Large (h-11, px-8)
- **Icon:** BookOpen (20x20)
- **Gap:** 3 (12px)
- **Responsive:** Full width on mobile, auto on tablet+
- **Hover:** Background accent color

---

### 2. Teachers List Button (👨‍🏫 O'qituvchilar ro'yxati)

```tsx
<Link href="/teachers" className="w-full sm:w-auto">
  <Button 
    size="lg" 
    className="gap-3 w-full sm:w-auto" 
    variant="outline"
  >
    <GraduationCap className="w-5 h-5" />
    <span>O'qituvchilar ro'yxati</span>
  </Button>
</Link>
```

**Styling:**
- **Variant:** Outline (border with hover background)
- **Size:** Large (h-11, px-8)
- **Icon:** GraduationCap (20x20)
- **Gap:** 3 (12px)
- **Responsive:** Full width on mobile, auto on tablet+
- **Hover:** Background accent color

---

### 3. Become Teacher Button (✨ O'qituvchi bo'lish) - PRIMARY CTA

```tsx
<Link href="/become-teacher" className="w-full sm:w-auto">
  <Button 
    size="lg" 
    className="gap-3 w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600"
  >
    <ArrowRight className="w-5 h-5" />
    <span>O'qituvchi bo'lish</span>
  </Button>
</Link>
```

**Styling:**
- **Variant:** Custom Gradient (no variant used)
- **Size:** Large (h-11, px-8)
- **Icon:** ArrowRight (20x20)
- **Gap:** 3 (12px)
- **Responsive:** Full width on mobile, auto on tablet+
- **Background:** Gradient (from-amber-600 to-amber-500)
- **Hover:** Darker gradient (from-amber-700 to-amber-600)
- **Text Color:** White (default for gradients)

---

## Button Container Layout

```tsx
<div className="flex flex-col sm:flex-row gap-4 pt-2">
  {/* Buttons go here */}
</div>
```

**Container Styling:**
- **Display:** Flex
- **Direction:** Column on mobile, row on tablet+ (sm:flex-row)
- **Gap:** 4 (16px between buttons)
- **Padding Top:** 2 (8px)

---

## Responsive Behavior

### Mobile (< 640px)
```
[Courses Button]
full width

[Teachers Button]
full width

[Become Teacher Button]
full width gradient
```

### Tablet (640px - 1024px)
```
[Courses] [Teachers] [Become Teacher]
auto width, side by side
```

### Desktop (> 1024px)
```
[Courses] [Teachers] [Become Teacher]
auto width, side by side, more spacing
```

---

## Color Scheme

### Outline Buttons (Courses & Teachers)

```
State: Default
├── Text: Foreground color
├── Border: Border color
└── Background: Transparent

State: Hover
├── Text: Accent foreground
├── Border: Same
└── Background: Accent background

State: Focus
├── Ring: 2px ring-ring with offset
└── Other: Same as hover
```

### Gradient Button (Become Teacher)

```
State: Default
├── Background: Gradient (amber-600 → amber-500)
├── Text: White
└── Border: None

State: Hover
├── Background: Darker gradient (amber-700 → amber-600)
├── Text: White
└── Border: None

State: Focus
├── Ring: 2px ring-ring with offset
└── Other: Same as hover
```

---

## Icon Styling

All buttons use the same icon sizing:

```tsx
<IconComponent className="w-5 h-5" />
```

**Size:** 20x20 pixels (w-5 h-5)

**Icons Used:**
- **Courses:** BookOpen
- **Teachers:** GraduationCap
- **Become Teacher:** ArrowRight

---

## Typography

### Button Text

```tsx
size="lg"
className="font-semibold text-sm"
```

**Font Properties:**
- **Size:** Small (14px)
- **Weight:** Semibold (600)
- **Line Height:** 1.5

### Full Button Styling

```tsx
// From shadcn/ui button component
"h-11 rounded-md px-8"        // Size
"font-medium text-sm"          // Typography
"ring-offset-background"       // Focus ring
"focus-visible:outline-none"   // Focus state
"focus-visible:ring-2"         // Focus ring
"focus-visible:ring-ring"      // Focus ring color
"focus-visible:ring-offset-2"  // Focus ring offset
"disabled:pointer-events-none" // Disabled state
"disabled:opacity-50"          // Disabled style
```

---

## Spacing Details

### Inside Button
```
Icon (w-5 h-5) + gap-3 (12px) + Text
= 20px + 12px + text width
```

### Between Buttons
```
gap-4 in container = 16px between buttons
```

### Around Button Container
```
pt-2 = 8px top padding
```

---

## Accessibility

### Focus States
- All buttons have visible focus rings (2px)
- Focus ring color: ring-ring (usually primary)
- Focus offset: 2px

### Keyboard Navigation
- All buttons are keyboard accessible
- Tab order follows DOM order
- Enter/Space activates buttons

### Screen Readers
- Button text is clear and descriptive
- Icons are supplementary (not required for understanding)
- Link text indicates destination

### Color Contrast
- Outline buttons: Good contrast on dark background
- Gradient button: Good contrast (white on amber)

---

## State Styling

### Default State
```css
opacity: 1
cursor: pointer
```

### Hover State
```css
/* Outline buttons */
background-color: var(--accent)
text-color: var(--accent-foreground)

/* Gradient button */
background: gradient(darker amber)
```

### Active/Pressed State
```css
opacity: 0.95
transform: scale(0.98)
```

### Disabled State
```css
opacity: 0.5
pointer-events: none
cursor: not-allowed
```

### Focus State
```css
outline: 2px solid var(--ring)
outline-offset: 2px
```

---

## Custom Gradient Button Details

### Gradient Colors

**Default:**
```
from-amber-600  (#d97706)
to-amber-500    (#f59e0b)
```

**Hover:**
```
from-amber-700  (#b45309)
to-amber-600    (#d97706)
```

**Gradient Direction:**
```
to-r (left to right)
```

### Gradient Implementation

```tsx
className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600"
```

---

## Styling Customization

### Change Button Variant (Courses Button)
```tsx
// Current: outline
variant="outline"

// Options:
variant="default"      // Solid primary
variant="secondary"    // Solid secondary
variant="destructive"  // Solid red
variant="ghost"        // No border, hover only
variant="link"         // Text link style
```

### Change Button Size
```tsx
// Current: lg
size="lg"

// Options:
size="sm"      // h-9, px-3
size="default" // h-10, px-4
size="lg"      // h-11, px-8
size="icon"    // h-10, w-10 (for icon-only buttons)
```

### Change Button Colors
```tsx
// For gradient button, change Tailwind colors:
from-amber-600 to-amber-500

// Options:
from-blue-600 to-blue-500
from-red-600 to-red-500
from-green-600 to-green-500
from-purple-600 to-purple-500
```

---

## Common Issues & Solutions

### Buttons Not Aligned
**Issue:** Buttons have different heights
**Solution:** Ensure all use `size="lg"` and same container

### Text Wrapping
**Issue:** Button text wraps on mobile
**Solution:** Check if button has `w-full` on mobile

### Icon Not Showing
**Issue:** Icon doesn't display
**Solution:** Check icon import and className

### Hover Effect Not Working
**Issue:** Hover styling doesn't apply
**Solution:** Check CSS specificity and Tailwind compilation

### Links Not Working
**Issue:** Buttons don't navigate
**Solution:** Verify href paths in Link component

---

## Best Practices

✅ Always use size="lg" for consistency
✅ Always include icons for visual clarity
✅ Always wrap with Link component
✅ Always use responsive classes (w-full sm:w-auto)
✅ Always include gap-3 for spacing between icon and text
✅ Always test on mobile, tablet, desktop
✅ Always verify focus states for accessibility
✅ Always provide alt text in title attribute if needed

---

## Code Examples

### Import Required Components
```tsx
import { Button } from "@/components/ui/button";
import { Link } from "next/link";
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react";
```

### Complete Button Template
```tsx
<Link href="/your-route" className="w-full sm:w-auto">
  <Button 
    size="lg" 
    className="gap-3 w-full sm:w-auto" 
    variant="outline"
  >
    <IconComponent className="w-5 h-5" />
    <span>Button Label</span>
  </Button>
</Link>
```

### Gradient Button Template
```tsx
<Link href="/your-route" className="w-full sm:w-auto">
  <Button 
    size="lg" 
    className="gap-3 w-full sm:w-auto bg-gradient-to-r from-color-600 to-color-500 hover:from-color-700 hover:to-color-600"
  >
    <IconComponent className="w-5 h-5" />
    <span>Button Label</span>
  </Button>
</Link>
```

---

## Final Summary

| Aspect | Detail |
|--------|--------|
| Button Type | 2x Outline + 1x Gradient |
| Size | Large (h-11) |
| Icons | BookOpen, GraduationCap, ArrowRight |
| Gap | 3 (12px) |
| Responsive | w-full on mobile, w-auto on tablet+ |
| Container | flex flex-col sm:flex-row gap-4 |
| Hover | Color change for outline, gradient change for CTA |
| Focus | 2px ring with offset |
| Accessible | ✅ Keyboard, screen reader, color contrast |

---

**Version:** 1.0
**Last Updated:** December 2024
**Status:** Production Ready
