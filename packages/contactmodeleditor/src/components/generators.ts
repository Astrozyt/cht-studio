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

type ContactAttr =
    | { key: string; label: string; type: "text" | "number" | "date"; hint?: string; required?: boolean; saveTo: string }
    | { key: string; label: string; type: "select1" | "select"; hint?: string; required?: boolean; saveTo: string; options: { value: string; label: string }[] };

type ContactType = {
    id: string;
    label: string;
    attributes: ContactAttr[];
};

// ---- xformify JSON (must match your Rust types.rs) ----
type Localized = { lang: string; value: string };
type ItemChoice = { value: string; labels: Localized[] };
type Bind = {
    required?: "yes" | "no";
    constraint_msg?: string;
    calculate?: string;
    preload?: string;
    preload_params?: string;
    type?: string;
};
type Node = {
    uid: string;
    ref: string;
    labels: Localized[];
    hints?: Localized[];
    items?: ItemChoice[];
    tag: "input" | "select1" | "select" | "group";
    bind?: Bind;
    children: Node[];
    appearance?: string | null;
};
type Form = { title: string; root: string; body: Node[] };

// ---- helpers ----
const xmlSafeRef = (name: string) => {
    if (!name) return "_";
    const first = /^[A-Za-z_]/.test(name) ? name[0] : "_";
    const rest = name.slice(1).replace(/[^\w.-]/g, "_");
    return first + rest;
};
const labelsEN = (s: string): Localized[] => [{ lang: "en", value: s || "" }];
const hintsEN = (s?: string): Localized[] => (s ? [{ lang: "en", value: s }] : []);
const yesNo = (b?: boolean): "yes" | "no" | undefined => (typeof b === "boolean" ? (b ? "yes" : "no") : undefined);

function mapAttrType(t: ContactAttr["type"]): { tag: "input" | "select1" | "select"; bindType: string } {
    switch (t) {
        case "select1": return { tag: "select1", bindType: "select1" };
        case "select": return { tag: "select", bindType: "select" };
        case "number": return { tag: "input", bindType: "int" }; // use "decimal" if you prefer
        case "date": return { tag: "input", bindType: "date" };
        case "text":
        default: return { tag: "input", bindType: "string" };
    }
}

function attrToLeaf(ctId: string, a: ContactAttr): Node {
    const { tag, bindType } = mapAttrType(a.type);
    return {
        uid: `${ctId}_${a.key}`,
        ref: xmlSafeRef(a.key), // may be overridden if nested
        tag,
        labels: labelsEN(a.label),
        hints: hintsEN(a.hint),
        items:
            tag === "select" || tag === "select1"
                ? ("options" in a ? a.options.map(o => ({ value: o.value, labels: labelsEN(o.label) })) : [])
                : [],
        bind: {
            required: yesNo(a.required),
            type: bindType,
            constraint_msg: "",
            calculate: "",
            preload: "",
            preload_params: "",
        },
        children: [],
        appearance: null,
    };
}

function newGroup(ref: string, uidSeed: string, label?: string): Node {
    return {
        uid: `grp_${uidSeed}_${ref}`,
        ref,
        tag: "group",
        labels: labelsEN(label ?? ref),
        hints: [],
        children: [],
        appearance: null,
    };
}

function findOrCreateGroup(siblings: Node[], ref: string, uidSeed: string): Node {
    let g = siblings.find(n => n.tag === "group" && n.ref === ref);
    if (!g) { g = newGroup(ref, uidSeed, ref); siblings.push(g); }
    return g;
}

function insertAtPath(rootChildren: Node[], path: string[], leaf: Node, uidSeed: string) {
    if (path.length <= 1) {
        leaf.ref = xmlSafeRef(path[0] ?? leaf.ref);
        rootChildren.push(leaf);
        return;
    }
    let cursor = rootChildren;
    for (let i = 0; i < path.length - 1; i++) {
        const seg = xmlSafeRef(path[i]);
        const grp = findOrCreateGroup(cursor, seg, uidSeed);
        cursor = grp.children;
    }
    leaf.ref = xmlSafeRef(path[path.length - 1]);
    cursor.push(leaf);
}

type Mode = "create" | "edit";
function buildForm(ct: ContactType, mode: Mode, makeEditFieldsOptional = true): Form {
    const children: Node[] = [];
    for (const a of ct.attributes) {
        const path = (a.saveTo?.trim() ? a.saveTo.trim().split(".") : [a.key]).filter(Boolean);
        const leaf = attrToLeaf(ct.id, a);
        if (mode === "edit" && makeEditFieldsOptional && leaf.bind) leaf.bind.required = "no";
        insertAtPath(children, path, leaf, ct.id);
    }
    return { title: `${ct.label} (${mode})`, root: "data", body: children };
}

// ---- PUBLIC: keep your existing names/signatures ----
export function generateCreateForm(ct: ContactType): Form {
    return buildForm(ct, "create");
}
export function generateEditForm(ct: ContactType): Form {
    return buildForm(ct, "edit", true); // make required -> "no" on edit
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
// type ContactTypeBase = { id: string; name_key: string; icon: string; forms?: { create?: string; edit?: string }; parents?: string[]; };
type ContactTypeBase = { id: string; name_key: string; icon: string; create_form: string; edit_form: string; primary_contact: boolean; places: boolean; persons: boolean; parents?: string[]; };

export function patchBaseSettings(base: { contact_types: ContactTypeBase[] }, model: ContactModel) {
    const idx = new Map(base.contact_types.map((t, i) => [t.id, i]));
    for (const ct of model.contact_types) {
        const create_form = `${ct.id}-create`;
        const edit_form = `${ct.id}-edit`;
        // const forms = { create: create_form, edit: edit_form };
        const persons = (ct as any).personOrPlace === "person";
        const places = (ct as any).personOrPlace === "place";
        const primary_contact = (ct as any).isPrimaryContact;
        const i = idx.get(ct.id);
        if (i != null) {
            base.contact_types[i] = { ...base.contact_types[i], icon: ct.icon, create_form, edit_form, places, persons, primary_contact, parents: ct.parents, name_key: base.contact_types[i].name_key || `contact.type.${ct.id}` };
        } else {
            base.contact_types.push({ id: ct.id, name_key: `contact.type.${ct.id}`, icon: ct.icon, create_form, edit_form, places, persons, primary_contact, parents: ct.parents });
        }
    }
    return base;
}