export const config = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "My App",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? 10000),
  debug: process.env.NEXT_PUBLIC_DEBUG === "true",
  apiKey: process.env.NEXT_PUBLIC_API_KEY ?? process.env.BASE_API_KEY
} as const;