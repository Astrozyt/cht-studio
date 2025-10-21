import { SummaryRow } from "./types";

export type FormInfo = { id: string; title?: string };
export type FlatField = { path: string; label: string; type?: string };

export const suggestKey = (formId: string, fieldPath?: string) => {
    const leaf = (fieldPath ?? "").split(".").pop() || "value";
    return `${formId}_${leaf}`.replace(/[^a-z0-9_]/gi, "_").toLowerCase();
};

export const normalizeRow = (r: SummaryRow): SummaryRow => {
    if (r.rule === "last_value" && r.fieldPath) {
        let fp = r.fieldPath.trim().replace(/^fields\./, "").replace(/^\./, "");
        return { ...r, fieldPath: `fields.${fp}` };
    }
    return { ...r, fieldPath: undefined };
};
