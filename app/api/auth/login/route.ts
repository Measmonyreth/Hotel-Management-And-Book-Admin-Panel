// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/config';

const AUTH_COOKIE = 'auth';
const API_URL = config.apiUrl.replace(/\/+$/, '').replace(/\/api$/i, '');
const API_HEADERS = {
  "Content-Type": "application/json",
  ...(config.apiKey ? { "X-API-KEY": config.apiKey } : {}),
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Try customer login
    const usersRes = await fetch(`${API_URL}/api/customers/login`, {
      method: "POST",
      headers: API_HEADERS,
      body: JSON.stringify({ email, password }),
    });

    const usersData = await usersRes.json();

    if (usersRes.ok && usersData?.data?.token) {
      const authCookie = {
        token: usersData.data.token,
        userType: "CUSTOMER",
        role: "CUSTOMER",
      };

      const response = NextResponse.json({
        success: true,
        userType: "CUSTOMER",
        role: "CUSTOMER",
        token: usersData.data.token,
        message: "Customer login successful!",
      });

      // Set httpOnly cookie for middleware authentication
      response.cookies.set(AUTH_COOKIE, encodeURIComponent(JSON.stringify(authCookie)), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    // Try employee login
    const employeesRes = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: API_HEADERS,
      body: JSON.stringify({ email, password }),
    });

    const employeesData = await employeesRes.json();

    if (employeesRes.ok && employeesData?.data?.accessToken) {
      const role = employeesData?.data?.user?.role;

      if (role === "ADMIN" || role === "STAFF" || role === "MANAGER") {
        const authCookie = {
          token: employeesData.data.accessToken,
          userType: "EMPLOYEE",
          role,
        };

        const response = NextResponse.json({
          success: true,
          userType: "EMPLOYEE",
          role,
          token: employeesData.data.accessToken,
//          employeeRecordId: employeesData.data.user?.id,
          message: "Employee login successful!",
        });

        // Set httpOnly cookie for middleware authentication
        response.cookies.set(AUTH_COOKIE, encodeURIComponent(JSON.stringify(authCookie)), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });

        return response;
      }

      return NextResponse.json(
        { success: false, error: "Invalid role" },
        { status: 403 }
      );
    }

    // Both failed
    const errorMsg = usersData?.message || employeesData?.message || "Login failed";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
