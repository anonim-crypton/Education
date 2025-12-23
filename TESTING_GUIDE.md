# Testing Guide - Teacher Admin Panel

**For**: O'qituvchi Admin Paneli  
**Date**: December 23, 2024

---

## ⚡ Quick Start Testing (5 minutes)

### Step 1: Start Backend
```bash
cd edu_game
python manage.py runserver 0.0.0.0:8000
```
✅ Should see: "Starting development server at http://127.0.0.1:8000/"

### Step 2: Start Frontend
```bash
npm run dev
# or
next dev
```
✅ Should see: "Ready in X.XXXs"

### Step 3: Open Browser
```
http://localhost:3000
```

### Step 4: Login as Teacher
- Username: `teacher1` (or any teacher account)
- Password: (your password)

### Step 5: Navigate to Dashboard
```
http://localhost:3000/teacher-dashboard
```

---

## ✅ Test Checklist

### Test 1: Check Sidebar Navigation (2 min)
```
GOAL: Verify all navigation buttons are visible
```

**Steps**:
1. Open teacher dashboard
2. Look at left sidebar
3. Verify you can see:
   - ✅ Mening Kurslarim
   - ✅ Darslar (NEW)
   - ✅ O'quvchilar (NEW)
   - ✅ Yangi Kurs
   - ✅ Darsni Yuklash

**Expected Result**: All 5 buttons visible ✅

---

### Test 2: Courses Count on Dashboard (2 min)
```
GOAL: Verify dashboard shows number of courses
```

**Steps**:
1. On dashboard, look for courses count
2. Check if it shows a number (e.g., "5 Kurs")

**Expected Result**: Number displays correctly ✅

**If not working**:
```bash
curl -H "Authorization: Token {token}" \
  http://localhost:8000/api/dashboard/
```
Check if response includes `courses_count` field

---

### Test 3: Click "Darslar" Button (3 min)
```
GOAL: Verify lessons page loads with video list
```

**Steps**:
1. Click "Darslar" button in sidebar
2. Wait for page to load (should see spinner)
3. Verify you can see:
   - ✅ Page title: "Yuklangan Darslar"
   - ✅ Video list (if teacher has videos)
   - ✅ For each video: title, course, date, stats

**Expected Result**: Videos display with all details ✅

**If videos don't show**:
```bash
curl -H "Authorization: Token {token}" \
  http://localhost:8000/api/lessons/
```
Check if response includes lessons array

---

### Test 4: Click "O'quvchilar" Button (3 min)
```
GOAL: Verify students page loads with student list
```

**Steps**:
1. Click "O'quvchilar" button in sidebar
2. Wait for page to load
3. Verify you can see:
   - ✅ Page title: "O'quvchilar"
   - ✅ Student cards (if students exist)
   - ✅ For each student: avatar, name, email

**Expected Result**: Students display correctly ✅

**If students don't show**:
```bash
curl -H "Authorization: Token {token}" \
  http://localhost:8000/api/users/teacher/students/
```
Check if response includes students array

---

### Test 5: Test Search on Students Page (3 min)
```
GOAL: Verify search functionality works
```

**Steps**:
1. On students page, find search box
2. Type student name (e.g., "Ahmad")
3. Verify results filter in real-time
4. Try searching by email
5. Clear search box
6. Verify all students show again

**Expected Result**: Search filters results instantly ✅

---

### Test 6: Test Sidebar Visibility During Upload (3 min)
```
GOAL: Verify sidebar doesn't disappear when uploading
```

**Steps**:
1. Click "Darsni Yuklash" button
2. Fill upload form
3. While on upload page, verify sidebar is still visible
4. Verify you can still click other buttons
5. Try clicking "Darslar" while on upload page

**Expected Result**: Sidebar always visible, buttons always clickable ✅

---

### Test 7: Test Navigation Persistence (3 min)
```
GOAL: Verify navigation works from all pages
```

**Steps**:
1. On dashboard, click "Darslar"
2. From lessons, click "O'quvchilar"
3. From students, click "Mening Kurslarim"
4. From courses, click "Darsni Yuklash"
5. From upload, click back to dashboard

**Expected Result**: All navigation works seamlessly ✅

---

### Test 8: Test Responsive Design (2 min)
```
GOAL: Verify works on mobile/tablet
```

**Steps**:
1. Open browser dev tools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select iPhone or tablet size
4. Navigate through pages
5. Verify sidebar collapses/expands properly

**Expected Result**: Works on all screen sizes ✅

---

### Test 9: Test Empty States (2 min)
```
GOAL: Verify helpful messages when no data
```

**Steps**:
1. Create a new teacher account (with no courses)
2. View "Darslar" page
3. Should see message: "Siz hali hech qanday dars yuklamagan"
4. View "O'quvchilar" page
5. Should see message: "Hozircha sizning kurslariga hech qanday o'quvchi yozilmagan"

**Expected Result**: Helpful messages displayed ✅

---

### Test 10: Test Error Handling (2 min)
```
GOAL: Verify errors handled gracefully
```

**Steps**:
1. Stop backend server
2. Try loading lessons page
3. Should see error message (not crash)
4. Start backend again
5. Page should work again

**Expected Result**: Graceful error handling ✅

---

## 🔧 Common Issues & Fixes

### Issue: "401 Unauthorized" on API calls
**Solution**: Token expired, re-login
```bash
# Clear tokens and login again
```

### Issue: "404 Not Found" on students endpoint
**Solution**: Backend not updated, restart
```bash
cd edu_game
python manage.py runserver
```

### Issue: Sidebar buttons not showing
**Solution**: Clear browser cache
```
Ctrl+Shift+Del → Clear cache → Refresh
```

### Issue: Videos/students not loading
**Solution**: Check database has data
```bash
python manage.py shell
>>> from users.models import Course, Lesson
>>> Course.objects.filter(teacher_user_id=1).count()
>>> Lesson.objects.count()
```

---

## 📊 Performance Testing

### Load Time Check:
```
Target: Page loads in < 2 seconds
```

**Test**:
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Check total load time

**Expected**: < 2 seconds ✅

### API Response Time:
```
Target: API responds in < 500ms
```

**Test**:
```bash
time curl -H "Authorization: Token {token}" \
  http://localhost:8000/api/lessons/
```

**Expected**: < 500ms ✅

---

## 🧪 Database Testing

### Verify Data:
```bash
python manage.py shell
```

```python
# Check courses
from users.models import Course
Course.objects.filter(teacher_user__username='teacher1').count()

# Check lessons
from users.models import Lesson
Lesson.objects.count()

# Check users
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.filter(is_staff=False).count()
```

---

## ✅ Final Verification Checklist

- [ ] Backend running without errors
- [ ] Frontend running without errors
- [ ] Can login as teacher
- [ ] Sidebar shows 5 navigation buttons
- [ ] Dashboard shows courses count
- [ ] "Darslar" page loads and shows videos
- [ ] "O'quvchilar" page loads and shows students
- [ ] Search works on students page
- [ ] Sidebar visible on all pages
- [ ] No console errors
- [ ] No network errors (all requests 200 OK)
- [ ] Pages load in < 2 seconds
- [ ] Works on mobile
- [ ] Error messages show gracefully

---

## 🚀 Ready for Production?

When all tests pass, you can:

1. **Deploy to staging**:
   ```bash
   git add .
   git commit -m "Add teacher admin features"
   git push
   ```

2. **Deploy to production**:
   - Backend: Deploy Django app
   - Frontend: Deploy Next.js app
   - Database: Run migrations on production
   - Test: Verify in production environment

---

## 📝 Test Report Template

```
TEST REPORT - Teacher Admin Panel
Date: _______________
Tester: ______________

RESULTS:
- Sidebar Navigation: ✅ / ❌
- Dashboard Courses: ✅ / ❌
- Lessons Page: ✅ / ❌
- Students Page: ✅ / ❌
- Search Function: ✅ / ❌
- Navigation Persistence: ✅ / ❌
- Responsive Design: ✅ / ❌
- Error Handling: ✅ / ❌
- Performance: ✅ / ❌

NOTES:
_________________________________
_________________________________

APPROVED FOR PRODUCTION: YES / NO
```

---

## 🎯 Quick Test (30 seconds)

Fastest way to verify everything works:

```bash
# Terminal 1 - Backend
cd edu_game && python manage.py runserver

# Terminal 2 - Frontend
npm run dev

# Terminal 3 - Quick test
sleep 5
curl -s -H "Authorization: Token {token}" \
  http://localhost:8000/api/lessons/ | python -m json.tool | head -20

# Then in browser
# 1. Login at http://localhost:3000
# 2. Go to http://localhost:3000/teacher-dashboard
# 3. Click "Darslar" - should load
# 4. Click "O'quvchilar" - should load
# 5. Check if sidebar is always visible
```

✅ If all works, you're good to go!

---

**Test Duration**: ~45 minutes for complete testing  
**Quick Test**: ~2 minutes  
**Status**: Ready for testing ✅

Good luck! 🚀
