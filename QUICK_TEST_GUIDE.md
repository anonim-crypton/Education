# Quick Test Guide - Teachers Public Access

## ⚡ Quick Start (5 minutes)

### 1. Start Backend
```bash
cd edu_game
python manage.py runserver 8000
```

### 2. Start Frontend  
```bash
npm run dev
# Opens http://localhost:3000
```

### 3. Create Teacher in Admin
1. Go to: `http://localhost:8000/dashboard/teachers/`
2. Login if needed: `http://localhost:8000/users/admin/login/`
3. Fill form:
   - **Username**: `test_teacher_1`
   - **Password**: `TestPass123!`
   - **Full Name**: `Yusuf Aka`
   - **Subject**: `Matematika`
   - **Avatar**: (optional) Upload an image
4. Click **Saqlash** (Save)

### 4. Verify in Admin Panel
Go to: `http://localhost:8000/dashboard/teachers/list/`
- ✅ Should see your new teacher in the list

### 5. Check Frontend
Go to: `http://localhost:3000/teachers`
- ✅ Should see your new teacher displayed
- ✅ Avatar should display if uploaded
- ✅ All details visible: name, subject, email, etc.

---

## 🧪 Detailed Testing

### Test 1: API Endpoint Access (No Auth)
```bash
# This should work WITHOUT any token
curl http://localhost:8000/api/teachers/

# Or with verbose output
curl -v http://localhost:8000/api/teachers/
```

**Expected**: 
- Status: `200 OK`
- Returns JSON array with teachers

---

### Test 2: Avatar Upload
1. Create teacher with avatar image
2. Check frontend - avatar should display
3. Open browser DevTools (F12)
4. Check Network tab - avatar image should load from `/media/avatars/...`

---

### Test 3: Frontend Fetch
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to `http://localhost:3000/teachers`
4. Look for log: `"Teachers data:"` with array of teachers
5. Should **NOT** see error messages

---

### Test 4: Error Handling
1. Stop backend server
2. Go to frontend `/teachers` page
3. Should **NOT** break
4. Should show empty/loading state gracefully

---

### Test 5: Multiple Teachers
1. Create 3-5 teachers
2. Check frontend displays all
3. Test search functionality

---

## 📝 Verification Checklist

### Backend
- [ ] `/api/teachers/` returns 200 OK without authentication
- [ ] Response includes all teacher fields
- [ ] Avatar URLs are full URLs (include domain)
- [ ] `select_related('user')` is implemented

### Frontend
- [ ] Teachers page loads without errors
- [ ] Teachers list displays from API
- [ ] Avatar images display correctly
- [ ] Search works for names and subjects
- [ ] No token authentication needed

### Admin Dashboard
- [ ] Can still create teachers
- [ ] Created teachers appear in admin list
- [ ] Can upload avatars

---

## 🐛 Debugging Tips

### If Teachers Don't Show on Frontend

1. **Check API Response**
   ```bash
   curl http://localhost:8000/api/teachers/
   ```
   - Should return JSON array
   - Should have teachers in it

2. **Check Browser Console**
   ```javascript
   // Manually fetch to debug
   fetch('http://localhost:8000/api/teachers/')
     .then(r => r.json())
     .then(data => console.log(data))
   ```

3. **Check Django Logs**
   - Look for SQL queries
   - Look for any error messages

### If Avatars Don't Display

1. **Check Avatar URL**
   ```bash
   # Should return image file
   curl http://localhost:8000/media/avatars/[filename].jpg
   ```

2. **Check Media Configuration**
   - Settings has `MEDIA_URL = '/media/'`
   - Settings has `MEDIA_ROOT` configured
   - Files actually exist in file system

3. **Check Console Errors**
   - F12 → Console tab
   - Look for 404 errors on image requests

---

## 📊 Database Check

### Check Teachers in DB
```bash
# In Django shell
python manage.py shell

from teachers.models import Teacher
from django.contrib.auth import get_user_model
User = get_user_model()

# List all teachers
teachers = Teacher.objects.select_related('user').all()
for t in teachers:
    print(f"{t.user.get_full_name()} - {t.subject}")
    
# Check specific teacher
teacher = Teacher.objects.first()
print(f"Avatar: {teacher.user.avatar}")
```

---

## 🔧 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | ✅ Fixed - endpoint is now public |
| Avatars not showing | Check `/media/avatars/` folder has files |
| Teachers list empty | Create a teacher in admin dashboard first |
| API returns 500 error | Check Django logs for SQL errors |
| Frontend stuck on "Yuklanmoqda..." | Check network tab, API might be down |

---

## 📈 Performance Baseline

### Expected Load Times
- `/api/teachers/` endpoint: < 100ms (with 10 teachers)
- Teachers page load: < 500ms total
- Avatar image load: < 1s per image

### Database Queries
- Should be **1 query** for `/api/teachers/` (due to `select_related`)
- Not N+1 queries

---

## 🎯 Success Criteria

✅ **Test Passes If**:
1. Admin can create teachers
2. Created teachers appear in admin list
3. Created teachers appear on `/teachers` page
4. Avatars display correctly
5. No authentication errors
6. No console errors
7. Page loads fast

---

## 📞 Still Having Issues?

Check these files:
1. `edu_game/teachers/views.py` - Verify permission_classes = []
2. `edu_game/teachers/serializers.py` - Verify get_avatar() implementation
3. `components/teachers-page.tsx` - Verify fetch logic
4. Django logs - Run with `python manage.py runserver --verbosity 2`
5. Browser console - F12 to see detailed errors
