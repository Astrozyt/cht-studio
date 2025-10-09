// registry.ts
import { ContactModel } from "./types";

export type ContactField = { key: string; label: string; type: "string" | "number" | "date" | "boolean" };
export type ContactFieldRegistry = Record<string /*contact_type id*/, ContactField[]>;

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
            type: a.type === "number" ? "number"
                : a.type === "date" ? "date"
                    : a.type === "boolean" ? "boolean"
                        : "string",
        }));
        // de-duplicate by key
        const seen = new Set<string>();
        map[ct.id] = [...core, ...extras].filter(f => (seen.has(f.key) ? false : (seen.add(f.key), true)));
    }
    return map;
}
