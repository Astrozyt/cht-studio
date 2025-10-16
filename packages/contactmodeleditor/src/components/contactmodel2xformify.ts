// contactmodel-to-xformify.ts

type Localized = { lang: string; value: string };

type ItemChoice = {
    value: string;
    labels: Localized[];
};

type Bind = {
    required?: "yes" | "no";
    relevant?: never;          // left out on purpose (no logic for now)
    constraint?: never;
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

type Form = {
    title: string;
    root: string;       // keep "data" to mirror your writer
    body: Node[];
};

// ---- contact model (what your editor emits via ModelZ) ----
type ContactAttr =
    | {
        key: string;
        label: string;
        type: "text" | "number" | "date";
        hint?: string;
        required?: boolean;
        saveTo: string;                 // e.g. "sex" or "parent._id"
    }
    | {
        key: string;
        label: string;
        type: "select1" | "select";
        hint?: string;
        required?: boolean;
        saveTo: string;
        options: { value: string; label: string }[];
    };

type ContactType = {
    id: string;
    label: string;
    icon?: string;
    parents: string[];
    attributes: ContactAttr[];
};

type ContactModel = {
    contact_types: ContactType[];
};

// ------------------------ helpers ------------------------

function xmlSafeRef(name: string): string {
    if (!name) return "_";
    const first = /^[A-Za-z_]/.test(name) ? name[0] : "_";
    const rest = name.slice(1).replace(/[^\w.-]/g, "_");
    return first + rest;
}

function yesNo(b?: boolean): "yes" | "no" | undefined {
    if (typeof b === "boolean") return b ? "yes" : "no";
    return undefined;
}

function mapTypeToTagAndBind(
    t: string
): { tag: "input" | "select1" | "select"; bindType: string } {
    switch (t) {
        case "select1":
            return { tag: "select1", bindType: "select1" };
        case "select":
            return { tag: "select", bindType: "select" };
        case "number":
            return { tag: "input", bindType: "int" };     // simple default; change to "decimal" if needed
        case "date":
            return { tag: "input", bindType: "date" };
        case "text":
        default:
            return { tag: "input", bindType: "string" };
    }
}

function makeLabels(enText: string): Localized[] {
    return [{ lang: "en", value: enText || "" }];
}

function makeHint(enText?: string): Localized[] {
    return enText ? [{ lang: "en", value: enText }] : [];
}

function makeItems(options: { value: string; label: string }[] | undefined): ItemChoice[] {
    return (options ?? []).map(o => ({
        value: o.value,
        labels: makeLabels(o.label),
    }));
}

function newGroupNode(ref: string, uidSeed: string, label?: string): Node {
    return {
        uid: `grp_${uidSeed}`,
        ref,
        tag: "group",
        labels: makeLabels(label ?? ref),
        hints: [],
        children: [],
        appearance: null,
    };
}

function findOrCreateGroup(root: Node[], pathSeg: string, uidSeed: string): Node {
    const ref = xmlSafeRef(pathSeg);
    let grp = root.find(n => n.tag === "group" && n.ref === ref);
    if (!grp) {
        grp = newGroupNode(ref, `${uidSeed}_${ref}`, pathSeg);
        root.push(grp);
    }
    return grp;
}

// Insert a leaf under a path like ["parent","_id"]
function insertAtPath(root: Node[], path: string[], leaf: Node, uidSeed: string) {
    if (path.length === 0) {
        root.push(leaf);
        return;
    }
    let cursorArray = root;
    let parent: Node | undefined;

    for (let i = 0; i < path.length; i++) {
        const seg = path[i];
        const grp = findOrCreateGroup(cursorArray, seg, uidSeed);
        parent = grp;
        cursorArray = grp.children;
    }
    parent!.children.push(leaf);
}

// --------------------- main mapping ----------------------

function attrToLeafNode(ctId: string, a: ContactAttr): Node {
    const { tag, bindType } = mapTypeToTagAndBind(a.type);
    const leaf: Node = {
        uid: `${ctId}_${a.key}`,
        ref: xmlSafeRef(a.key),
        tag,
        labels: makeLabels(a.label),
        hints: makeHint(a.hint),
        items: (tag === "select" || tag === "select1")
            ? makeItems((a as any).options)
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
    return leaf;
}

export function buildFormForContactType(ct: ContactType): Form {
    const rootChildren: Node[] = [];

    for (const a of ct.attributes) {
        const saveTo = a.saveTo?.trim();
        const path = (saveTo ? saveTo.split(".") : [a.key]).filter(Boolean);
        const leaf = attrToLeafNode(ct.id, a);
        if (path.length <= 1) {
            // direct child
            leaf.ref = xmlSafeRef(path[0] ?? a.key);
            rootChildren.push(leaf);
        } else {
            // nested under groups
            const leafRef = xmlSafeRef(path[path.length - 1]);
            leaf.ref = leafRef;
            insertAtPath(rootChildren, path.slice(0, -1), leaf, ct.id);
        }
    }

    return {
        title: ct.label || ct.id,
        root: "data",
        body: rootChildren,
    };
}

export function buildForms(model: ContactModel): { filename: string; form: Form }[] {
    return model.contact_types.map(ct => {
        const form = buildFormForContactType(ct);
        const base = ct.id.replace(/[^a-z0-9-_.]/gi, "_");
        return { filename: `contact_${base}.json`, form };
    });
}
