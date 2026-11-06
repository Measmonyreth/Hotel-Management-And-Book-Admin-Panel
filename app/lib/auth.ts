// app/lib/auth.ts

export const AUTH_COOKIE = 'auth';

// ==================== Server-side Auth Utils ====================

/**
 * Get authentication info from cookies (Server-side only)
 * Used in middleware and server components
 */
export async function getAuthFromCookies() {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE)?.value;
    
    if (!authCookie) return null;

    return JSON.parse(decodeURIComponent(authCookie));
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated (Server-side)
 */
export async function isAuthenticated() {
  const auth = await getAuthFromCookies();
  return !!auth?.token;
}

/**
 * Check if user has required role (Server-side)
 */
export async function hasRole(requiredRoles: string[]) {
  const auth = await getAuthFromCookies();
  if (!auth?.role) return false;
  return requiredRoles.includes(auth.role);
}

/**
 * Check if user is admin or staff (Server-side)
 */
export async function isDashboardUser() {
  return hasRole(['ADMIN', 'STAFF']);
}

/**
 * Check if user is customer (Server-side)
 */
export async function isCustomer() {
  return hasRole(['CUSTOMER']);
}

// ==================== Client-side Auth Utils ====================

/**
 * Store token in localStorage (Client-side)
 */
export const storeToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

/**
 * Get token from localStorage (Client-side)
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

/**
 * Clear token from localStorage (Client-side)
 */
export const clearToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

/**
 * Set auth info in cookie (Client-side)
 * Note: Server sets httpOnly cookie on login
 */
export const setAuthCookie = (token: string, userType: string, role: string) => {
  if (typeof document === 'undefined') return;

  const authInfo = JSON.stringify({ token, userType, role });
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(authInfo)}; SameSite=Lax; Path=/`;
};

/**
 * Get auth info from cookie (Client-side)
 */
export const getAuthCookie = (): { token: string; userType: string; role: string } | null => {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(new RegExp(`(^| )${AUTH_COOKIE}=([^;]*)`));
  if (!match) return null;

  try {
    return JSON.parse(decodeURIComponent(match[2]));
  } catch {
    return null;
  }
};

/**
 * Clear auth cookie (Client-side)
 */
export const clearAuthCookie = () => {
  if (typeof document === 'undefined') return;

  document.cookie = `${AUTH_COOKIE}=; Max-Age=0; SameSite=Lax; Path=/`;
};

// ==================== API Call Helpers ====================

/**
 * Logout user and clear auth data
 */
export async function logout() {
  try {
    // Call logout API
    await fetch('/api/auth/logout', {
      method: 'POST',
    });

    // Clear client-side auth data
    clearToken();
    clearAuthCookie();

    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

/**
 * Check if user has required role (Client-side)
 */
export const hasClientRole = (requiredRoles: string[]): boolean => {
  const auth = getAuthCookie();
  if (!auth?.role) return false;
  return requiredRoles.includes(auth.role);
};

/**
 * Get current user role (Client-side)
 */
export const getUserRole = (): string | null => {
  const auth = getAuthCookie();
  if (auth?.role) return auth.role;

  if (typeof window === 'undefined') return null;
  return localStorage.getItem('role');
};
