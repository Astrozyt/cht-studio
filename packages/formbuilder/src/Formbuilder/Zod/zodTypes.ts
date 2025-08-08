import { z, ZodType } from "zod";

export enum NodeType {
    Group = "group",
    Input = "input",
    Select = "select",
    Select1 = "select1",
    Repeat = "repeat",
    Note = "note",
    Trigger = "trigger",
    Upload = "upload",
    Image = "image",
    Audio = "audio",
}

export const bindTypeSchema = z.enum([
    "string",
    "int",
    "decimal",
    "date",
    "dateTime",
    "time",
    "boolean",
    "select1",
    "select",
    "geopoint",
    "geotrace",
    "geoshape",
    "barcode",
    "binary",
    "calculate",
    "acknowledge",
    "image",
    "audio",
    "video",
    "file",
    "external",
]);

export const bindTypeOptions = {
    input: [
        "string", "int", "decimal", "date", "dateTime", "time", "boolean",
        "geopoint", "geotrace", "geoshape", "barcode", "binary"
    ] as const,
    select1: ["select1"] as const,
    select: ["select"] as const,
    note: ["string"] as const,
    trigger: ["string"] as const,
    upload: ["binary"] as const,
    image: ["binary"] as const,
    audio: ["binary"] as const,
    video: ["binary"] as const,
    group: [] as const,
    repeat: [] as const,
} as const;

export type NodeTypeType = typeof NodeType[keyof typeof NodeType];

const labelSchema = z.object({
    lang: z.string().min(2, "Language code required"),
    value: z.string().min(2, "Label value required"),
});

const itemSchema = z.object({
    value: z.string().min(1, "Value required"),
    labels: z.array(labelSchema).default([]),
});

export type Item = z.infer<typeof itemSchema>;

const hintSchema = z.object({
    lang: z.string().min(2),
    value: z.string().min(1),
});

const bindBase = z.object({
    required: z.boolean().optional(),
    readonly: z.boolean().optional(),
    // relevant: z.string().optional(),
    relevant: z.object({}).passthrough().optional(),
    constraint: z.string().optional(),
    constraintMsg: z.string().optional(),
    calculate: z.string().optional(),
    preload: z.string().optional(),
    preloadParams: z.string().optional(),
    type: bindTypeSchema.optional(),
});

const baseNode = z.object({
    uid: z.string(),
    ref: z.string().min(1, "Reference required"),
    appearance: z.string().optional(),
    labels: z.array(labelSchema).optional(),
    hints: z.array(hintSchema).optional(),
    items: z.array(itemSchema).optional(),
});

function bindSchemaForNodeType(nodeType: keyof typeof bindTypeOptions) {
    const types = bindTypeOptions[nodeType];
    const schemaWithoutType = bindBase.omit({ type: true });
    return types.length === 0
        ? schemaWithoutType
        : schemaWithoutType.extend({ type: z.enum(types) });
}

const inputNode = baseNode.extend({
    tag: z.literal(NodeType.Input),
    bind: bindSchemaForNodeType("input"),
    children: z.never().optional(),
});

const selectNode = baseNode.extend({
    tag: z.literal(NodeType.Select),
    bind: bindSchemaForNodeType("select"),
    children: z.never().optional(),
});

const select1Node = baseNode.extend({
    tag: z.literal(NodeType.Select1),
    bind: bindSchemaForNodeType("select1"),
    children: z.never().optional(),
});

const groupNode = baseNode.extend({
    tag: z.literal(NodeType.Group),
    bind: bindSchemaForNodeType("group").optional(),
    children: z.lazy(() => nodeSchema.array()).optional(),
});

const otherNode = baseNode.extend({
    tag: z.nativeEnum(NodeType),
    bind: bindBase,
    children: z.array(z.any()).optional(),
});

let nodeSchema: ZodType<any>;

nodeSchema = z.discriminatedUnion("tag", [
    inputNode,
    selectNode,
    select1Node,
    groupNode,
    // otherNode,
]);

export { nodeSchema };

export type NodeFormValues = z.infer<typeof nodeSchema>;

const FullFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    body: z.array(nodeSchema)
});

export type FullForm = z.infer<typeof FullFormSchema>;
