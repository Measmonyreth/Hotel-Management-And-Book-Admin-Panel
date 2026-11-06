"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [debugUrl, setDebugUrl] = useState("loading...");

  useEffect(() => {
    const handleCallback = () => {
      // Set debug URL immediately
      setDebugUrl(window.location.href);
      
      // Get the full URL
      const currentUrl = window.location.href;
      const url = new URL(currentUrl);
      const hash = window.location.hash;

      let token = "";

      // Try to get token from URL search params
      token = url.searchParams.get("token") || "";
      if (!token) {
        token = url.searchParams.get("access_token") || "";
      }
      if (!token) {
        token = url.searchParams.get("accessToken") || "";
      }
      if (!token) {
        token = url.searchParams.get("id_token") || "";
      }

      // Try hash fragment if no token found
      if (!token && hash) {
        const hashUrl = new URL(hash.startsWith("#") ? "http://localhost" + hash : "http://localhost#" + hash);
        token = hashUrl.searchParams.get("token") || "";
        if (!token) {
          token = hashUrl.searchParams.get("access_token") || "";
        }
        if (!token) {
          token = hashUrl.searchParams.get("accessToken") || "";
        }

        if (!token) {
          token = hashUrl.searchParams.get("id_token") || "";
        }
      }

      // Check localStorage as fallback
      const storedToken = localStorage.getItem("token");

      if (token || storedToken) {
        const finalToken = token || storedToken || "";
        
        // Store token in localStorage
        localStorage.setItem("token", finalToken);
        localStorage.setItem("userType", "CUSTOMER");
        localStorage.setItem("role", "CUSTOMER");

        // Set auth cookie for middleware
        const authInfo = JSON.stringify({ 
          token: finalToken, 
          userType: "CUSTOMER", 
          role: "CUSTOMER" 
        });
        document.cookie = `auth=${encodeURIComponent(authInfo)}; SameSite=Lax; Path=/`;

        // Redirect to rooms
        router.push("/rooms");
      } else {
        // No token found
        console.error("No token found in OAuth callback");
        console.error("Current URL:", currentUrl);
        console.error("Hash:", hash);
        router.push("/login?error=no_token");
      }
    };

    // Small delay to ensure component is mounted
    const timer = setTimeout(handleCallback, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 mx-auto rounded-full border-4 border-neutral-200 border-t-blue-600 animate-spin"></div>
        <h2 className="text-xl font-semibold text-neutral-900">
          Logging you in...
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Please wait while we complete the sign-in process.
        </p>
      </div>

      {/* <div className="mt-8 p-4 bg-neutral-100 rounded-lg text-left max-w-md">
        <p className="text-xs text-neutral-500 mb-2">Debug Info:</p>
        <p className="text-xs text-neutral-700 font-mono break-all">
          URL: {debugUrl}
        </p>
      </div> */}
    </div>
  );
}
