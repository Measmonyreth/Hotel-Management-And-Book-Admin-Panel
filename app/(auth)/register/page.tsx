"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { config } from "@/config";

type UserModel = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  nationality: string;
  city_or_province: string;
  country: string;
};

const defaultFormData: UserModel = {
  firstName: "John",
  lastName: "Doe",
  email: "mmreth007@gmail.com",
  password: "plainPassword123",
  phone: "012345678",
  nationality: "USA",
  city_or_province: "New York",
  country: "USA",
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<UserModel>({
    ...defaultFormData,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      nationality: formData.nationality,
      city_or_province: formData.city_or_province,
      country: formData.country,
    };

    try {
      const response = await fetch(
        `${config.apiUrl}/api/customers/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to register");
      }
      router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);

    console.log(formData);
  };

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-white px-6 py-12 text-neutral-900">
      <section className="w-full max-w-2xl rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-neutral-500">
            Hotel Management
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Join us and start booking your perfect stay.
          </p>
        </div>

        {/* Registration Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* First Name and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-neutral-700"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                className="block w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black/30 focus:ring-2 focus:ring-black/10"
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-neutral-700"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                className="block w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black/30 focus:ring-2 focus:ring-black/10"
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              className="mb-2 block text-sm font-medium text-neutral-700"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="block w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black/30 focus:ring-2 focus:ring-black/10"
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="mb-2 block text-sm font-medium text-neutral-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="block w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black/30 focus:ring-2 focus:ring-black/10"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label
              className="mb-2 block text-sm font-medium text-neutral-700"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              className="block w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black/30 focus:ring-2 focus:ring-black/10"
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Nationality and Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-neutral-700"
                htmlFor="nationality"
              >
                Nationality
              </label>
              <select
                className="block w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/10"
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
              >
                <option value="">Select Nationality</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="JP">Japan</option>
                <option value="IN">India</option>
                <option value="BR">Brazil</option>
                <option value="MX">Mexico</option>
              </select>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-neutral-700"
                htmlFor="country"
              >
                Country
              </label>
              <select
                className="block w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/10"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="JP">Japan</option>
                <option value="IN">India</option>
                <option value="BR">Brazil</option>
                <option value="MX">Mexico</option>
              </select>
            </div>
          </div>

          {/* City or Province */}
          <div>
            <label
              className="mb-2 block text-sm font-medium text-neutral-700"
              htmlFor="city_or_province"
            >
              City or Province
            </label>
            <input
              className="block w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black/30 focus:ring-2 focus:ring-black/10"
              id="city_or_province"
              name="city_or_province"
              type="text"
              placeholder="e.g., New York, California"
              value={formData.city_or_province}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-8 w-full rounded-lg bg-neutral-900 px-4 py-3 font-medium text-white transition hover:bg-neutral-800 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Create Account
          </button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-neutral-900 underline-offset-4 hover:text-neutral-700 hover:underline"
            >
              Sign in
            </a>
          </p>
        </form>
      </section>
    </main>
  );
}
