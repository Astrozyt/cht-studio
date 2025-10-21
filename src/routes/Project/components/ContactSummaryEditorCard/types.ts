import { z } from "zod";

export const Rule = z.enum(["last_value", "days_since_last_form"]);
export const Coerce = z.enum(["number", "string", "boolean"]);

export const SummaryRowSchema = z.object({
    id: z.string().min(1),
    key: z.string().min(1).regex(/^[a-z][a-z0-9_]*$/),
    rule: Rule,
    form: z.string().min(1),
    fieldPath: z.string().optional(), // required only for last_value
    type: Coerce.default("number"),
    withinDays: z.coerce.number().int().nonnegative().optional(),
    fallback: z.union([z.string(), z.number(), z.boolean()]).optional(),
    description: z.string().optional(),
}).refine(r => r.rule !== "last_value" || !!r.fieldPath, {
    path: ["fieldPath"],
    message: "Field is required for 'last_value'",
});

export type SummaryRow = z.infer<typeof SummaryRowSchema>;
