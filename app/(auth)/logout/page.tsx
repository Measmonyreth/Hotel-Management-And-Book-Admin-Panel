"use client";

import { useEffect } from "react";
import { clearToken, clearAuthCookie } from "@/app/lib/auth";

export default function LogoutPage() {
  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call our Next.js logout API which handles backend logout
        const response = await fetch("/api/auth/logout", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error(`Logout request failed with status ${response.status}`);
        }

        // Clear client-side auth data
        clearToken();
        clearAuthCookie();
        localStorage.removeItem("role");
        localStorage.removeItem("userType");
      } catch (error) {
        console.error("Logout failed:", error);
        clearToken();
        clearAuthCookie();
        localStorage.removeItem("role");
        localStorage.removeItem("userType");
      } finally {
        // Reload so middleware evaluates the cleared auth cookie.
        window.location.replace("/login");
      }
    };

    void performLogout();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl font-bold">Logging out...</h1>
      <p className="mt-4">Please wait while we log you out.</p>
    </div>
  );
}
