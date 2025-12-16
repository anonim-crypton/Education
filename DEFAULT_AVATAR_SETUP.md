# Default Avatar Setup - New Users

## Overview
Yangi kirganlarga default avatar rasmi ko'rsatish sozlanildi. Rasm `placeholder-user.jpg` public folder-da mavjud.

## Default Avatar Image
**File:** `/public/placeholder-user.jpg`
**Size:** Optimal circle avatar
**Type:** Default user icon
**Format:** JPG

## Changes Made

### 1. Navbar Component (components/navbar.tsx) ✅

**Account Button Avatar:**
- Old: Conditional render (image OR initials)
- New: Always show image with default fallback
- Line 321-327 updated

```tsx
<img
  src={userData?.avatar_url || "/placeholder-user.jpg"}
  alt="Avatar"
  className="w-full h-full object-cover"
/>
```

**Dropdown Header Avatar:**
- Old: Conditional render (image OR initials)
- New: Always show image with default fallback
- Line 347-354 updated

```tsx
<img
  src={userData?.avatar_url || "/placeholder-user.jpg"}
  alt="Avatar"
  className="w-full h-full object-cover"
/>
```

### 2. Account Settings Page (app/account-settings/page.tsx) ✅

**Avatar Display:**
- Old: Fallback to gradient circle with initials
- New: Show actual image or default placeholder
- Line 214-220 updated

```tsx
<img
  src={avatarPreview || userData?.avatar_url || "/placeholder-user.jpg"}
  alt="Avatar"
  className="w-12 h-12 rounded-full object-cover"
/>
```

Priority: avatarPreview > userData.avatar_url > default

### 3. Dashboard Page (app/dashboard/page.tsx) ✅

**Welcome Card Avatar:**
- Added large avatar image display (16x16)
- Shows with border (white/30)
- Appears next to welcome message
- Line 85-99 updated

```tsx
<img
  src={userData?.avatar_url || "/placeholder-user.jpg"}
  alt="Avatar"
  className="w-16 h-16 rounded-full object-cover border border-white/30"
/>
```

## Avatar Display Locations

| Location | Size | Default | With Border |
|----------|------|---------|-------------|
| Navbar Button | 8x8 | ✅ `/placeholder-user.jpg` | None |
| Navbar Dropdown | 12x12 | ✅ `/placeholder-user.jpg` | None |
| Settings Page | 12x12 | ✅ `/placeholder-user.jpg` | None |
| Dashboard | 16x16 | ✅ `/placeholder-user.jpg` | white/30 |

## Fallback Priority

All avatar displays follow this priority:

1. **User's uploaded avatar** (`userData?.avatar_url`)
2. **Avatar preview** (when uploading)
3. **Default placeholder** (`/placeholder-user.jpg`)

```
userData?.avatar_url || avatarPreview || "/placeholder-user.jpg"
```

## How It Works

### New User Without Avatar
```
User Login
   ↓
No avatar_url in userData
   ↓
Falls back to /placeholder-user.jpg
   ↓
Default icon displays
```

### User With Custom Avatar
```
User Upload Avatar
   ↓
avatar_url saved in database
   ↓
On login: userData.avatar_url populated
   ↓
Custom avatar displays (no fallback needed)
```

## Benefits

✅ **Consistent UX** - All users have avatar visible immediately
✅ **Professional Look** - Default placeholder is generic icon
✅ **No Missing Images** - Fallback prevents broken links
✅ **Easy Upgrade** - Users can upload custom avatar anytime
✅ **Responsive** - Works on all screens

## Styling Details

### Default Avatar Classes
```tsx
w-full h-full object-cover  // For small avatars
w-8 h-8 rounded-full         // Navbar button
w-12 h-12 rounded-full       // Dropdown/Settings
w-16 h-16 rounded-full       // Dashboard
```

### Border Styling
```tsx
border-white/30              // Dashboard card
border-white/50              // (Other contexts if needed)
border border-white/50       // Account/Dropdown
```

## Files Modified

| File | Changes | Lines |
|------|---------|-------|
| components/navbar.tsx | Navbar button & dropdown avatar | 321-327, 347-354 |
| app/account-settings/page.tsx | Settings avatar with default | 214-220 |
| app/dashboard/page.tsx | Welcome card avatar | 85-99 |

## Testing Checklist

✅ New user without avatar → Shows placeholder
✅ User with avatar → Shows uploaded image
✅ Navbar button → Shows avatar
✅ Navbar dropdown → Shows avatar
✅ Settings page → Shows avatar
✅ Dashboard → Shows avatar with border
✅ All sizes render correctly
✅ No console errors

## Image File Info

**Filename:** `placeholder-user.jpg`
**Location:** `/public/placeholder-user.jpg`
**Fallback URL:** `/placeholder-user.jpg` (from public folder)
**Type:** Default user icon/avatar

## Responsive Behavior

- Navbar button: Small (8x8) - compact
- Dropdown header: Medium (12x12) - profile view
- Settings page: Medium (12x12) - edit view
- Dashboard welcome: Large (16x16) - main view

All sizes use `object-cover` to maintain aspect ratio and fill circle perfectly.

