# Route Protection & Middleware Setup - Quick Guide

## ✅ What Was Implemented

### 1. **Middleware Protection** (`middleware.ts` at root)
   - ✓ Protects all routes except public ones (login, register, etc.)
   - ✓ Dashboard (`/dashboard/*`) - ONLY for ADMIN & STAFF
   - ✓ Customer routes (`/rooms`, `/profile`) - ONLY for CUSTOMER
   - ✓ Redirects to `/login` if no auth cookie
   - ✓ Redirects to appropriate dashboard based on role

### 2. **Authentication Endpoints**
   - ✓ `POST /api/auth/login` - Sets httpOnly auth cookie
   - ✓ `POST /api/auth/logout` - Clears auth cookie

### 3. **Auth Utilities** (`app/lib/auth.ts`)
   - ✓ Server-side: `getAuthFromCookies()`, `isAuthenticated()`, `hasRole()`
   - ✓ Client-side: `getAuthCookie()`, `hasClientRole()`, `logout()`

### 4. **Updated Files**
   - ✓ Logout page uses new auth utilities

## 🚀 How to Use

### For Login (Frontend):
```tsx
// app/(auth)/login/page.tsx
import { setAuthCookie } from "@/app/lib/auth";

const handleLogin = async (email, password) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  const data = await res.json();
  
  if (data.success) {
    // Cookie is already set by the API
    // Redirect happens automatically via middleware
    window.location.href = '/dashboard'; // or '/rooms' for customers
  }
};
```

### For Logout (Frontend):
```tsx
import { logout } from "@/app/lib/auth";

const handleLogout = async () => {
  await logout();
  // User is redirected to /login automatically
};
```

### For Role-Based UI (Client Component):
```tsx
'use client';
import { hasClientRole, getUserRole } from "@/app/lib/auth";

export default function MyComponent() {
  const userRole = getUserRole();
  const isAdmin = hasClientRole(['ADMIN', 'STAFF']);
  
  return (
    <div>
      {isAdmin && <AdminPanel />}
      {userRole === 'CUSTOMER' && <CustomerPanel />}
    </div>
  );
}
```

### For Protected Server Components:
```tsx
import { isDashboardUser, hasRole } from "@/app/lib/auth";

export default async function DashboardLayout() {
  const isDashboard = await isDashboardUser();
  
  if (!isDashboard) {
    redirect('/unauthorized');
  }
  
  return <DashboardContent />;
}
```

## 🔒 Route Protection Summary

| Route | Access | Redirect If... |
|-------|--------|----------------|
| `/dashboard` | ADMIN, STAFF | No auth → `/login` |
| | | Customer → `/rooms` |
| `/rooms`, `/profile` | CUSTOMER | No auth → `/login` |
| | | Admin/Staff → `/dashboard` |
| `/login`, `/register` | Public | Authenticated → Dashboard |
| All Other Routes | Authenticated | No auth → `/login` |

## 🧪 Testing the Setup

1. **Test unauthenticated access:**
   ```bash
   # Try accessing dashboard without login
   # Should redirect to /login automatically
   ```

2. **Test customer access:**
   ```bash
   # Login as CUSTOMER
   # Access /rooms → should work ✓
   # Access /dashboard → should redirect to /rooms ✓
   ```

3. **Test admin access:**
   ```bash
   # Login as ADMIN or STAFF
   # Access /dashboard → should work ✓
   # Access /rooms → should redirect to /dashboard ✓
   ```

## 📝 Key Files

- **Middleware**: `middleware.ts` (root)
- **Auth Logic**: `app/lib/auth.ts`
- **Login Route**: `app/api/auth/login/route.ts`
- **Logout Route**: `app/api/auth/logout/route.ts`
- **Logout Page**: `app/(auth)/logout/page.tsx`

## ⚙️ Environment Setup

The system uses:
- **Cookie Name**: `auth`
- **Cookie Type**: httpOnly (secure in production)
- **Cookie Duration**: 7 days
- **Auth Backends**:
  - Customers: `http://localhost:8080/api/customers/login`
  - Employees: `http://localhost:8080/api/auth/login`

## 🎯 Next Steps

1. Test the login flow
2. Verify dashboard is protected
3. Check customer routes work correctly
4. Test logout functionality
5. Verify role-based redirects work

All done! Your routes are now protected with role-based access control. 🎉
