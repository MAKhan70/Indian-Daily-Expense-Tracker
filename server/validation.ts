import { z } from "zod";

const dateKey = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/);
const monthKey = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const shortText = (max: number) => z.string().trim().max(max);

export const expenseSchema = z.object({
  id: shortText(128).min(1),
  name: shortText(80).default(""),
  merchant: shortText(120).default(""),
  amount: z.coerce.number().positive().max(10_000_000),
  categoryGroup: shortText(100).default("Other"),
  category: shortText(120).min(1),
  subcategory: shortText(120).default(""),
  frequency: z.enum(["daily", "weekly", "monthly", "one-off"]),
  payment: shortText(64).min(1),
  date: dateKey,
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).default("12:00"),
  status: z.enum(["actual", "planned"]).default("actual"),
  planNote: shortText(300).default(""),
  reminder: z.enum(["month", "week", "both", "none"]).default("none"),
  color: shortText(32).default("sage"),
});

export const archiveSchema = expenseSchema.extend({
  archiveId: shortText(128).min(1),
  archivedAt: z.string().datetime(),
  archiveReason: z.enum(["Edited", "Deleted"]),
});

const advanceAccountSchema = z.object({
  id: z.string().regex(/^advance-[1-5]$/),
  label: shortText(60),
  merchant: shortText(120).default(""),
  amountPaid: z.coerce.number().min(0).max(1_000_000_000),
});

const creditAccountSchema = z.object({
  id: z.string().regex(/^credit-[1-5]$/),
  label: shortText(60),
  merchant: shortText(120).default(""),
  creditLimit: z.coerce.number().min(0).max(1_000_000_000),
});

export const stateSchema = z.object({
  expenses: z.array(expenseSchema).max(25_000),
  archivedExpenses: z.array(archiveSchema).max(50_000).default([]),
  advanceAccounts: z.array(advanceAccountSchema).length(5),
  creditAccounts: z.array(creditAccountSchema).length(5),
  monthlyBudget: z.coerce.number().min(0).max(1_000_000_000),
  monthlyBudgets: z.record(monthKey, z.coerce.number().min(0).max(1_000_000_000)),
  aliases: z.record(z.string(), shortText(80)).default({}),
  dark: z.boolean().default(false),
  appearance: z.object({
    mode: z.enum(["light", "dark", "system"]),
    palette: z.enum(["heritage", "indigo", "ocean", "forest", "rose"]),
    look: z.enum(["soft", "crisp"]),
  }).default({ mode: "light", palette: "heritage", look: "soft" }),
  profilePhoto: z.string().max(500_000).refine((value) => !value || /^data:image\/(jpeg|png|webp);base64,/.test(value), "Invalid profile image").default(""),
});

export type LedgerStateInput = z.infer<typeof stateSchema>;
