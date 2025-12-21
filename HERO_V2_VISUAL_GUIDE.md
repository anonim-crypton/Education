# Hero Component V2 - Visual & Layout Guide

## Page Structure

```
┌────────────────────────────────────────────────────────────────┐
│                         NAVBAR                                 │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                       HERO SECTION                             │
│                    (min-h-screen / Full)                       │
│                                                                │
│  ┌─────────────────────────┐  ┌──────────────────────────┐   │
│  │                         │  │                          │   │
│  │    LEFT COLUMN          │  │   RIGHT COLUMN (VIDEO)   │   │
│  │    (Content)            │  │                          │   │
│  │                         │  │  ┌────────────────────┐  │   │
│  │  🎤 Badge: "Jonli!"     │  │  │  [YouTube Video]   │  │   │
│  │                         │  │  │  Player            │  │   │
│  │  📖 HEADING (text-9xl)  │  │  │                    │  │   │
│  │  "Sayt qanday ishlaydi?"│  │  │  Responsive        │  │   │
│  │                         │  │  │  Full Height       │  │   │
│  │  📝 Brief Description   │  │  │  Beautiful Border  │  │   │
│  │  "Sifatli ta'lim..."    │  │  │                    │  │   │
│  │                         │  │  └────────────────────┘  │   │
│  │  🔘 3 Action Buttons    │  │                          │   │
│  │  • Kurslar              │  │                          │   │
│  │  • O'qituvchilar        │  │                          │   │
│  │  • O'qituvchi bo'l      │  │                          │   │
│  │                         │  │                          │   │
│  │  📊 Stats (3 Cards)     │  │                          │   │
│  │  ┌──────┬────────┬──┐   │  │                          │   │
│  │  │100+  │ 50+    │10K+│   │  │                          │   │
│  │  │Kurs  │Teacher │Stud│   │  │                          │   │
│  │  └──────┴────────┴──┘   │  │                          │   │
│  │                         │  │                          │   │
│  └─────────────────────────┘  └──────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
│                  REST OF PAGE CONTENT                          │
└────────────────────────────────────────────────────────────────┘
```

---

## Responsive Layouts

### 📱 Mobile (< 640px)
```
┌──────────────────────────┐
│      HERO SECTION        │
│                          │
│  ┌──────────────────┐    │
│  │  Badge: Jonli!   │    │
│  │                  │    │
│  │  HEADING         │    │
│  │  (text-6xl)      │    │
│  │  "Sayt qanday    │    │
│  │   ishlaydi?"     │    │
│  │                  │    │
│  │  Brief desc      │    │
│  │                  │    │
│  │  ┌────────────┐  │    │
│  │  │ Kurslar    │  │    │
│  │  └────────────┘  │    │
│  │  ┌────────────┐  │    │
│  │  │O'qituvchilar│ │    │
│  │  └────────────┘  │    │
│  │  ┌────────────┐  │    │
│  │  │O'q. bo'l   │  │    │
│  │  └────────────┘  │    │
│  │                  │    │
│  │  ┌─┬──────┬──┐   │    │
│  │  │1│  2   │3 │   │    │
│  │  └─┴──────┴──┘   │    │
│  │  (Stats Cards)   │    │
│  └──────────────────┘    │
│                          │
│  ┌──────────────────┐    │
│  │                  │    │
│  │  [VIDEO PLAYER]  │    │
│  │                  │    │
│  │  min-h-96        │    │
│  │                  │    │
│  └──────────────────┘    │
│                          │
└──────────────────────────┘
```

### 💻 Tablet (640px - 1024px)
```
┌─────────────────────────────────────┐
│         HERO SECTION                │
│                                     │
│  ┌──────────────┐  ┌─────────────┐  │
│  │              │  │             │  │
│  │ Content      │  │  [VIDEO]    │  │
│  │              │  │             │  │
│  │ • Badge      │  │  Responsive │  │
│  │ • Heading    │  │  Height:    │  │
│  │   (text-7xl) │  │  min-h-[500]│  │
│  │ • Desc       │  │             │  │
│  │ • Buttons    │  │             │  │
│  │ • Stats      │  │             │  │
│  │              │  │             │  │
│  └──────────────┘  └─────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### 🖥️ Desktop (> 1024px)
```
┌───────────────────────────────────────────────────────┐
│                   HERO SECTION                         │
│                  (min-h-screen / Full)                 │
│                                                        │
│  ┌──────────────────────┐  ┌─────────────────────────┐ │
│  │                      │  │                         │ │
│  │ Content Area         │  │   [VIDEO PLAYER]        │ │
│  │ (Left Column)        │  │   (Right Column)        │ │
│  │                      │  │                         │ │
│  │ 🎤 Badge: "Jonli!"   │  │ ┌─────────────────────┐ │ │
│  │                      │  │ │                     │ │ │
│  │ 📖 HEADING           │  │ │  [YouTube Video]    │ │ │
│  │ (text-9xl / 64px)    │  │ │                     │ │ │
│  │ "Sayt qanday         │  │ │  Responsive Width   │ │ │
│  │  ishlaydi?"          │  │ │  Height:            │ │ │
│  │                      │  │ │  min-h-[600px]      │ │ │
│  │ 📝 Description       │  │ │                     │ │ │
│  │ "Sifatli ta'lim,     │  │ │  Beautiful Gradient │ │ │
│  │  turli kurslar..."   │  │ │  Border Styling     │ │ │
│  │                      │  │ │  Hover Effects      │ │ │
│  │ 🔘 Buttons (3)       │  │ │                     │ │ │
│  │ ┌──────┬──────┬────┐ │  │ │                     │ │ │
│  │ │Kurs  │O'qit.│O'q.│ │  │ │                     │ │ │
│  │ │      │      │bo'l│ │  │ │                     │ │ │
│  │ └──────┴──────┴────┘ │  │ └─────────────────────┘ │ │
│  │                      │  │                         │ │
│  │ 📊 Stats (3 Cards)   │  │                         │ │
│  │ ┌────────────────┐   │  │                         │ │
│  │ │ 100+  │ 50+ │10K+│ │  │                         │ │
│  │ │Kurs  │O'qit│Stud│ │  │                         │ │
│  │ └────────────────┘   │  │                         │ │
│  │                      │  │                         │ │
│  └──────────────────────┘  └─────────────────────────┘ │
│                                                        │
└───────────────────────────────────────────────────────┘
```

---

## Text Content Sizing

### Heading Typography

**Mobile (< 640px)**
```
text-6xl = 36px
lineHeight = 1 (tight)
Result: Readable but bold
```

**Tablet (640px - 1024px)**
```
md:text-7xl = 48px
lineHeight = 1 (tight)
Result: More prominent
```

**Desktop (> 1024px)**
```
lg:text-9xl = 64px
lineHeight = 1 (tight)
Result: Maximum impact
```

---

## Color Scheme

### Text & Foreground
```
Badge:           Outline variant (border + light text)
Heading:         White / Foreground color
Description:     Muted foreground
Buttons:         
  • Outline:     Border + text color
  • Gradient:    White text on amber gradient
```

### Stats Cards
```
Card 1 (Courses):
  Background:    from-blue-500/20 to-purple-500/20
  Hover:         from-blue-500/30 to-purple-500/30
  Text:          White numbers, muted labels

Card 2 (Teachers):
  Background:    from-indigo-500/20 to-blue-500/20
  Hover:         from-indigo-500/30 to-blue-500/30
  Text:          White numbers, muted labels

Card 3 (Students):
  Background:    from-purple-500/20 to-pink-500/20
  Hover:         from-purple-500/30 to-pink-500/30
  Text:          White numbers, muted labels
```

### Video Container
```
Background:      from-blue-900/40 via-purple-900/40 to-indigo-900/40
Border:          border-blue-500/20 (default)
Border (Hover):  border-blue-500/40 (darker on hover)
Video Embed:     Standard YouTube player
```

---

## Spacing Details

### Gaps & Padding

**Container Padding**
```
px-4             Mobile/Tablet
(auto with max-w) Desktop
py-8 lg:py-16    Vertical padding
```

**Content Spacing**
```
gap-8            Between sections
pt-4             Top padding for stats
gap-3            Between buttons
gap-4            Between stats cards
```

**Video Container**
```
p-6              Padding inside container
```

---

## Button Styling

### Outline Buttons (Courses & Teachers)
```
Size:            lg (h-11, px-8)
Gap:             3 (12px)
Responsive:      w-full sm:w-auto
Hover:           Background change to accent
Focus:           Ring outline
```

### Gradient Button (Become Teacher)
```
Size:            lg (h-11, px-8)
Gap:             3 (12px)
Responsive:      w-full sm:w-auto
Background:      from-amber-600 to-amber-500
Hover:           from-amber-700 to-amber-600
Text Color:      White
Focus:           Ring outline
```

### Button Container
```
Display:         flex
Direction:       flex-col sm:flex-row
Gap:             3 (12px)
Padding Top:     4 (16px)
```

---

## Stats Cards Styling

### Stats Grid
```
Layout:          grid-cols-3
Gap:             4 (16px)
Padding Top:     4 (16px)
```

### Individual Card
```
Padding:         p-4 (16px)
Border Radius:   rounded-xl
Display:         flex items-center justify-center
```

### Stats Numbers
```
Mobile:          text-3xl (28px)
Tablet/Desktop:  md:text-4xl (36px)
Font Weight:     bold
Color:           White
```

### Stats Labels
```
Mobile:          text-xs (12px)
Tablet/Desktop:  md:text-sm (14px)
Font Weight:     semibold
Color:           Muted foreground
```

---

## Video Player Details

### Container
```
Width:           Full (100%)
Height:          Responsive
Layout:          flex items-stretch justify-center
```

### IFrame Attributes
```
width="100%"                    Full container width
height="100%"                   Full container height
frameBorder="0"                 No border
allow="..."                     Full features enabled
allowFullScreen                 Allow fullscreen mode
```

### Responsive Heights
```
Mobile:          min-h-96 (384px)
Tablet:          md:min-h-[500px] (500px)
Desktop:         lg:min-h-[600px] (600px)
```

### Video URL
```
Format:  https://www.youtube.com/embed/VIDEO_ID
Current: https://www.youtube.com/embed/dQw4w9WgXcQ
```

---

## Interactive States

### Hover Effects

**Stats Cards Hover:**
```
Gradient deepens: Increases opacity by 0.1
Border effect: Subtle color shift
Transition: Smooth transition-all
```

**Video Border Hover:**
```
Default:  border-blue-500/20
Hover:    border-blue-500/40 (becomes more visible)
Transition: transition-all
```

**Button Hover:**
```
Outline Buttons:
  Background: Changes to accent background
  Text: Changes to accent foreground
  
Gradient Button:
  Background: Darker amber gradient
  Text: Remains white
```

---

## Accessibility

### Focus States
```
Ring:            2px ring-ring
Offset:          2px ring-offset
Color:           Ring color (usually primary)
```

### Keyboard Navigation
- All buttons: Tab-accessible
- All links: Enter-activatable
- Focus order: DOM order

### Screen Readers
- Heading: H1 (main content heading)
- Links: Descriptive link text
- Video: Title attribute in iframe
- Buttons: Clear button labels

### Color Contrast
- WCAG AA compliant (minimum 4.5:1)
- Text readable on backgrounds
- Not color-dependent for meaning

---

## Browser Rendering

### CSS Grid
```
grid grid-cols-1 gap-8 items-stretch lg:grid-cols-2 h-full

Mobile:      1 column, full width, stacked
Large:       2 columns, equal height (items-stretch)
```

### Flexbox
```
flex items-stretch justify-center

Items:       Fill available space (stretch)
Justify:     Center horizontally
Direction:   Column or row (default)
```

### Responsive Classes
```
Base classes apply to mobile (< 640px)
sm:          640px and up
md:          768px and up
lg:          1024px and up
```

---

## Performance Metrics

| Aspect | Impact |
|---|---|
| HTML | Minimal (simple structure) |
| CSS | No new external files |
| JS | None (except React runtime) |
| Images | None |
| Video | YouTube CDN (external) |
| Load Time | No negative impact |

---

## Summary

```
✅ Full-height hero section (min-h-screen)
✅ Responsive two-column layout
✅ Large heading (text-9xl on desktop)
✅ Concise, scannable text
✅ Three action buttons
✅ Compact stats cards
✅ YouTube video embed
✅ Beautiful styling with gradients
✅ Smooth hover effects
✅ Mobile-first responsive design
```

---

**Version:** 2.0
**Date:** December 2024
**Status:** Production Ready
