import "dotenv/config";
import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { sendAuthEmail } from "./email.js";

const trustedOrigins = (process.env.TRUSTED_ORIGINS || "http://localhost:5173,http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const trustedProxies = (process.env.TRUSTED_PROXY_CIDRS || "127.0.0.1/32,::1/128").split(",").map((value) => value.trim()).filter(Boolean);

export const auth = betterAuth({
  appName: "Pocket Ledger",
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins,
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION === "true",
    sendResetPassword: async ({ user, url }) => {
      void sendAuthEmail({ to: user.email, subject: "Reset your Pocket Ledger password", text: `Reset your password using this secure link: ${url}` });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void sendAuthEmail({ to: user.email, subject: "Verify your Pocket Ledger email", text: `Verify your email using this secure link: ${url}` });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 8 },
      "/sign-up/email": { window: 60, max: 5 },
      "/request-password-reset": { window: 300, max: 3 },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    ipAddress: { ipAddressHeaders: ["x-forwarded-for", "x-real-ip"], trustedProxies },
    database: {
      generateId: () => crypto.randomUUID(),
      joins: true,
    },
  },
});

export { trustedOrigins };
