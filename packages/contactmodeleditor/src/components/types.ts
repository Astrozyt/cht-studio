// contact-model.ts
import { z } from "zod";

export const ContactAttrType = z.enum(["text", "number", "date", "select1", "select", "boolean", "phone"]);
export type ContactAttrType = z.infer<typeof ContactAttrType>;

// helper for select options
const OptionSchema = z.object({
    value: z.string(),
    label: z.string().min(1),
});

// shared fields
const ContactAttrBase = z.object({
    key: z.string().regex(/^[a-z][a-z0-9_]*$/i, "Use letters, numbers, underscores; start with a letter"),
    label: z.string().min(1),
    saveTo: z
        .string()
        .regex(/^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$/)
        .or(z.literal(""))
        .default(""), // e.g. "sex" or "parent._id"
    required: z.boolean().default(false),
    hint: z.string().optional(),
});

// For non-select types: no options (or an empty array if UI still provides one)
const NonSelectAttr = ContactAttrBase.extend({
    type: z.enum(["text", "number", "date", "boolean", "phone"]),
    options: z.array(OptionSchema).max(0).optional().default([]),
});

// For select/select1: options are required
const SelectAttr = ContactAttrBase.extend({
    type: z.enum(["select", "select1"]),
    options: z.array(OptionSchema).min(1, "At least one option required"),
});

// 🔁 Final union
export const ContactAttr = z.discriminatedUnion("type", [NonSelectAttr, SelectAttr]);
export type ContactAttr = z.infer<typeof ContactAttr>;

export const ContactTypeModel = z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    label: z.string().min(1),
    icon: z.string().min(1),
    parents: z.array(z.string()).default([]), // other contact_type ids
    attributes: z.array(ContactAttr).default([]),
});

export const ContactModel = z.object({
    contact_types: z.array(ContactTypeModel).nonempty(),
});
export type ContactModel = z.infer<typeof ContactModel>;
