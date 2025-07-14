import { z } from "zod";

// export type Question = {
//     type: QuestionTypes;
//     name: string;
//     label: string;
//     hint: string;
//     required: boolean;
//     relevant: any;
//     appearance: any;
//     default: any;
//     constraint: any;
//     constraint_message: string;
//     calculation: any;
//     trigger: any;
//     choice_filter: any;
//     parameters: any;
//     repeat_count: any;
//     image: any;
//     audio: any;
//     video: any
// }

export type Bind = {
    nodeset: string;
    type?: string;
    required?: string;
    requiredMsg?: string
    relevant?: string;
    constraint?: string;
    constraintMsg?: string;
    readonly?: string; // added readonly attribute
    calculate?: string; // added calculate attribute
    preload?: string; // added preload attribute
    preloadParams?: string; // added preloadParams attribute
};

// export enum NodeType {
//     Group = "group",
//     Input = "input",
//     Select = "select",
//     Select1 = "select1",
//     Repeat = "repeat",
//     Note = "note",
//     Trigger = "trigger",
//     Upload = "upload",
//     Image = "image",
//     Audio = "audio",
// }

// export type BodyNode = {
//     uid?: string; // unique identifier for the node
//     tag: NodeType;                  // input, select1, select, group, trigger
//     ref?: string;                 // link to instance node
//     appearance?: string | null;
//     labelRef?: string; // reference to itext for label
//     hintRef?: string; // reference to itext for hint
//     labels?: { id: string, lang: string, value: string }[]; // for label, can be multiple languages
//     hints?: { id: string, lang: string, value: string }[]; // for hint, can be multiple languages
//     // itemLabels?: { value: string; labelRef?: string | null; labels?: Record<string, string> }[]; // improved structure
//     children?: BodyNode[];
//     items?: {
//         value: string; // value of the item 
//         labels: { lang: string, value: string }[]; // updated items structure
//         // updated to use BodyNode instead of FormNode
//     }[];
//     bind: Bind;
// }

export const questionSchema = z.object({
    type: z.enum([
        "text",
        "integer",
        "decimal",
        "note",
        "calculate",
        "select_one_list_name",
        "select_multiple_list_name",
        "select_one_from_file_file_extension",
        "select_multiple_from_file_file_extension",
        "begin_repeat",
        "end_repeat",
        "begin_group",
        "end_group",
        "geopoint",
        "geotrace",
        "geoshape",
        "startGeopoint",
        "range",
        "image",
        "barcode",
        "audio",
        "backgroundAudio",
        "video",
        "file",
        "date",
        "time",
        "datetime",
        "rank",
        "csvExternal",
        "image",
    ]),
    name: z.string(),
    label: z.string(),
    hint: z.string().optional(),
    required: z.boolean().default(false),
    relevant: z.any(),
    appearance: z.any(),
    default: z.any(),
    constraint: z.any(),
    constraint_message: z.string(),
    calculation: z.any(),
    trigger: z.any(),
    choice_filter: z.any(),
    parameters: z.any(),
    repeat_count: z.number().default(0),
    image: z.any(),
    audio: z.any(),
    video: z.any(),
    options_list: z.array(z.object({
        name: z.string(),
    })).optional(),
})

export type Question = z.infer<typeof questionSchema>;


export enum QuestionTypes {
    text = "text",
    integer = "integer",
    decimal = "decimal",
    note = "note",
    calculate = "calculate",
    select_one_list_name = "select_one",
    select_multiple_list_name = "select_multiple",
    select_one_from_file_file_extension = "select_one_from_file",
    select_multiple_from_file_file_extension = "select_multiple_from_file",
    begin_repeat = "begin_repeat",
    end_repeat = "end_repeat",
    begin_group = "begin_group",
    end_group = "end_group",
    geopoint = "geopoint",
    geotrace = "geotrace",
    geoshape = "geoshape",
    startGeopoint = "startGeopoint",
    range = "range",
    image = "image",
    barcode = "barcode",
    audio = "audio",
    backgroundAudio = "backgroundAudio",
    video = "video",
    file = "file",
    date = "date",
    time = "time",
    datetime = "datetime",
    rank = "rank",
    csvExternal = "csvExternal",
    acknowledge = "acknowledge",
    start = "start",
    end = "end",
    today = "today",
    deviceid = "deviceid",
    username = "username",
    phonenumber = "phonenumber",
    email = "email",
    audit = "audit",
}

