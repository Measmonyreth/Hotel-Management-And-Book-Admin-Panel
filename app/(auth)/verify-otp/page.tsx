"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { config } from "@/config";

function VerifyOtpContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);

    const newOtp = [...otp];
    for (let i = 0; i < digits.length; i++) {
      newOtp[i] = digits[i];
    }
    setOtp(newOtp);

    const lastIndex = Math.min(digits.length, 5);
    if (lastIndex < 6) {
      document.getElementById(`otp-${lastIndex}`)?.focus();
    }
  };

  const otpValue = otp.join("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Invalid verification link. Please register again.");
      router.replace("/register");
      return;
    }

    const isValid = otpValue.length === 6 && /^\d{6}$/.test(otpValue);
    if (!isValid) {
      alert("Please enter a valid 6-digit code.");
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/api/email/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ otpCode: otpValue, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data?.message || "OTP verification failed.");
        return;
      }

      alert("OTP verified successfully!");
      router.push(`/login?email=${encodeURIComponent(email)}&verified=true`);
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("Something went wrong while verifying the code.");
    }
  };
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-white px-6 py-12 text-neutral-900">
      <section className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-medium text-neutral-500">
            Hotel Management
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Verify your identity
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            We've sent a 6-digit code to your email or phone
          </p>
        </div>

        {/* OTP Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* OTP Input Fields */}
          <div>
            <label className="mb-4 block text-sm font-medium text-neutral-700">
              Enter verification code
            </label>
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="h-14 w-12 rounded-lg border-2 border-black/10 bg-white text-center text-2xl font-semibold outline-none transition placeholder:text-neutral-400 focus:border-black/30 focus:ring-2 focus:ring-black/10"
                  placeholder="-"
                  autoComplete="off"
                />
              ))}
            </div>
          </div>

          {/* Timer and Resend */}
          <div className="flex items-center justify-between text-sm">
            <p className="text-neutral-600">
              {timer > 0 ? (
                <>
                  Code expires in{" "}
                  <span className="font-medium text-neutral-900">
                    {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
                  </span>
                </>
              ) : (
                <span className="text-red-600 font-medium">Code expired</span>
              )}
            </p>
            <button
              type="button"
              disabled={timer > 0}
              className="text-neutral-600 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed font-medium underline-offset-4 hover:underline"
            >
              Resend Code
            </button>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={otpValue.length !== 6}
            className="mt-8 w-full rounded-lg bg-neutral-900 px-4 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify Code
          </button>
        </form>

        {/* Help Text */}
        <div className="mt-8 border-t border-black/10 pt-6">
          <p className="mb-3 text-center text-sm font-medium text-neutral-700">
            Didn't receive the code?
          </p>
          <div className="space-y-2 text-sm text-neutral-600">
            <p>• Check your spam or junk folder</p>
            <p>• Make sure you entered the correct email or phone</p>
            <p>
              • Contact support if you continue to experience issues
            </p>
          </div>
        </div>

        {/* Back to Login */}
        <p className="mt-6 text-center text-sm text-neutral-500">
          <a
            href="/login"
            className="font-medium text-neutral-900 underline-offset-4 hover:text-neutral-700 hover:underline"
          >
            Back to login
          </a>
        </p>
      </section>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpContent />
    </Suspense>
  );
}
