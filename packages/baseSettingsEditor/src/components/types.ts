// contact-model.ts
import { z } from "zod";

export const ContactAttrType = z.enum(["text", "number", "date", "select1", "select", "boolean", "phone"]);
export type ContactAttrType = z.infer<typeof ContactAttrType>;

export const ContactAttr = z.object({
    key: z.string().regex(/^[a-z][a-z0-9_]*$/i, "Use letters, numbers, underscores; start with a letter"),
    label: z.string().min(1),
    type: ContactAttrType,
    // for select/select1
    options: z.array(z.object({ value: z.string(), label: z.string().min(1) })).default([]),
    // write to which field on the contact doc:
    saveTo: z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$/).default(""), // e.g. "sex" or "parent._id"
    required: z.boolean().default(false),
    // optional constraints/hints
    hint: z.string().optional(),
});

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
