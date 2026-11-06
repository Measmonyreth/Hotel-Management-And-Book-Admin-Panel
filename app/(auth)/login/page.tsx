"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { config } from "@/config";

type LoginTab = "email" | "google";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<LoginTab>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    const verified = searchParams.get("verified");

    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }

    if (verified === "true") {
      setMessage("OTP verified successfully. Please sign in to continue.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      setMessage(data.message || "Login successful!");

      if (data.userType === "CUSTOMER") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", "CUSTOMER");
        localStorage.setItem("role", "CUSTOMER");
        router.push("/rooms");
      } else if (data.userType === "EMPLOYEE") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.userType);
        localStorage.setItem("role", data.role);
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setMessage("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth
    window.location.href = `${config.apiUrl}/login/google`;
  };

  // Check for OAuth error from callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlError = urlParams.get("error");
    if (urlError) {
      setMessage("Google login failed. Please try again.");
    }
  }, []);

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-white px-6 py-12 text-neutral-900">
      <section className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-neutral-500">
            Hotel Management
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Sign in to manage your hotel account.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mb-6 flex rounded-lg border border-black/10 bg-neutral-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("email")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "email"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Email Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("google")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "google"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Google Login
          </button>
        </div>

        {/* Email Login Form */}
        {activeTab === "email" && (
          <>
            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-neutral-700"
                  htmlFor="login-identifier"
                >
                  Email or username
                </label>
                <input
                  className="block w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black/30 focus:ring-2 focus:ring-black/10"
                  id="login-identifier"
                  name="identifier"
                  value={email}
                  placeholder="you@example.com"
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    className="block text-sm font-medium text-neutral-700"
                    htmlFor="login-password"
                  >
                    Password
                  </label>
                  <a
                    className="text-sm font-medium text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline"
                    href="/forget-password"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  className="block w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black/30 focus:ring-2 focus:ring-black/10"
                  id="login-password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>

              {message ? (
                <p className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                  {message}
                </p>
              ) : null}

              {error ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              <button
                className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-500">
              Don&apos;t have an account?{" "}
              <a
                className="font-medium text-neutral-900 underline-offset-4 hover:underline"
                href="/register"
              >
                Create one
              </a>
            </p>
          </>
        )}

        {/* Google Login */}
        {activeTab === "google" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white border border-black/10 shadow-sm">
                <svg className="h-8 w-8" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900">
                Sign in with Google
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                Use your Google account to sign in as a customer.
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-xs text-neutral-500">
              Google login is only available for customer accounts.
            </p>

            <p className="mt-6 text-center text-sm text-neutral-500">
              Are you an admin or staff?{" "}
              <a
                className="font-medium text-neutral-900 underline-offset-4 hover:underline"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("email");
                }}
              >
                Sign in with email
              </a>
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
