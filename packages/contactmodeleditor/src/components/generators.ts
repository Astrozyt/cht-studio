// generators.ts
import { ContactModel } from "./types";

type JsonFormField =
    | { type: "text"; name: string; label: string; required?: boolean; bind?: { save_to_contact?: string } }
    | { type: "int"; name: string; label: string; required?: boolean; bind?: { save_to_contact?: string } }
    | { type: "date"; name: string; label: string; required?: boolean; bind?: { save_to_contact?: string } }
    | { type: "select1"; name: string; label: string; required?: boolean; choices: { name: string; label: string }[]; bind?: { save_to_contact?: string } }
    | { type: "select"; name: string; label: string; required?: boolean; choices: { name: string; label: string }[]; bind?: { save_to_contact?: string } }
    | { type: "binary"; name: string; label: string; required?: boolean; bind?: { save_to_contact?: string } }; // for phone/photo etc if needed

type JsonForm = {
    form_id: string;
    title: string;
    fields: JsonFormField[];
};

function toJsonField(a: ContactModel["contact_types"][number]["attributes"][number]): JsonFormField {
    const base = {
        name: a.key,
        label: a.label,
        required: a.required || undefined,
        bind: a.saveTo ? { save_to_contact: a.saveTo } : undefined,
    };

    switch (a.type) {
        case "text": return { type: "text", ...base };
        case "number": return { type: "int", ...base };
        case "date": return { type: "date", ...base };
        case "boolean": return { type: "select1", ...base, choices: [{ name: "true", label: "Yes" }, { name: "false", label: "No" }] };
        case "phone": return { type: "text", ...base }; // you can add a regex constraint later
        case "select1": return { type: "select1", ...base, choices: a.options.map(o => ({ name: o.value, label: o.label })) };
        case "select": return { type: "select", ...base, choices: a.options.map(o => ({ name: o.value, label: o.label })) };
    }
}

export function generateCreateForm(ct: ContactModel["contact_types"][number]): JsonForm {
    return {
        form_id: `${ct.id}-create`,
        title: `Create ${ct.label}`,
        fields: ct.attributes.map(toJsonField),
    };
}

export function generateEditForm(ct: ContactModel["contact_types"][number]): JsonForm {
    return {
        form_id: `${ct.id}-edit`,
        title: `Edit ${ct.label}`,
        fields: ct.attributes.map(toJsonField),
    };
}

// Registry for logic builder
export type ContactField = { key: string; label: string; type: "string" | "number" | "date" | "boolean" };
export type ContactFieldRegistry = Record<string, ContactField[]>;

export function buildContactFieldRegistry(model: ContactModel): ContactFieldRegistry {
    const map: ContactFieldRegistry = {};
    for (const ct of model.contact_types) {
        const core: ContactField[] = [
            { key: "contact._id", label: "Contact ID", type: "string" },
            { key: "contact.type", label: "Contact type", type: "string" },
            { key: "contact.name", label: "Name", type: "string" },
            { key: "contact.parent._id", label: "Parent ID", type: "string" },
            { key: "contact.reported_date", label: "Created at", type: "date" },
        ];
        const extras: ContactField[] = ct.attributes.map(a => ({
            key: `contact.${a.saveTo || a.key}`,
            label: a.label,
            type: a.type === "number" ? "number" : a.type === "date" ? "date" :
                a.type === "boolean" ? "boolean" : "string",
        }));
        const seen = new Set<string>();
        map[ct.id] = [...core, ...extras].filter(f => (seen.has(f.key) ? false : (seen.add(f.key), true)));
    }
    return map;
}

// base_settings patch
type ContactTypeBase = { id: string; name_key: string; icon: string; forms?: { create?: string; edit?: string }; parents?: string[]; };
export function patchBaseSettings(base: { contact_types: ContactTypeBase[] }, model: ContactModel) {
    const idx = new Map(base.contact_types.map((t, i) => [t.id, i]));
    for (const ct of model.contact_types) {
        const forms = { create: `${ct.id}-create`, edit: `${ct.id}-edit` };
        const i = idx.get(ct.id);
        if (i != null) {
            base.contact_types[i] = { ...base.contact_types[i], icon: ct.icon, forms, parents: ct.parents, name_key: base.contact_types[i].name_key || `contact.type.${ct.id}` };
        } else {
            base.contact_types.push({ id: ct.id, name_key: `contact.type.${ct.id}`, icon: ct.icon, forms, parents: ct.parents });
        }
    }
    return base;
}