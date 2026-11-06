// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromCookies } from '@/app/lib/auth';
import { config } from '@/config';

const API_URL = config.apiUrl.replace(/\/+$/, '').replace(/\/api$/i, '');
const API_HEADERS = {
  'Content-Type': 'application/json',
  ...(config.apiKey ? { 'X-API-KEY': config.apiKey } : {}),
};

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    const token = auth?.token;

    if (token) {
      // Call appropriate backend logout endpoint based on userType
      if (auth.userType === 'CUSTOMER') {
        await fetch(`${API_URL}/api/customers/logout`, {
          method: 'POST',
          headers: API_HEADERS,
          body: JSON.stringify({ token }),
        }).catch(() => {}); // Ignore backend errors
      } else if (auth.userType === 'EMPLOYEE') {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: API_HEADERS,
          body: JSON.stringify({ token }),
        }).catch(() => {}); // Ignore backend errors
      }
    }

    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear the auth cookie
    response.cookies.delete('auth');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear cookie even if there's an error
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );
    response.cookies.delete('auth');
    return response;
  }
}
