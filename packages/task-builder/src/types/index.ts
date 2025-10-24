import * as zod from 'zod'

const iconSchema = zod.enum([
    'icon-ANC-danger-sign@2x', 'icon-disease-HIV-AIDS@2x', 'icon-healthcare-diagnosis.svg', 'icon-oppia-mobile@2x', 'icon-people-nurse@2x', 'icon-places-hospital@2x', 'medic-person.svg',
    'icon-calendar', 'icon-disease-HIV-AIDS.svg', 'Icon-healthcare-generic@2x', 'icon-people-baby@2x', 'icon-people-nurse-crop@2x', 'icon-places-household@2x', 'medic-staff.svg',
    'icon-death-general', 'icon-followup-general@2x', 'icon-healthcare-immunization@2x', 'icon-people-child@2x', 'icon-people-person-general@2x', 'icon-service-rating@2x',
    'icon-death-maternal', 'icon-follow-up', 'icon-healthcare-medicine@2x', 'icon-people-children@2x', 'icon-people-woman-baby@2x', 'medic-ccw.svg',
    'icon-death-neonatal', 'icon-healthcare-assessment@2x', 'icon-healthcare-warning@2x', 'icon-people-CHW-crop@2x', 'icon-people-woman-pregnant@2x', 'medic-chw-area.svg',
    'icon-disease-diabetes@2x', 'icon-healthcare-assessment', 'icon-messages-off@2x', 'icon-people-CHW-female@2x', 'icon-places-CHW-area@2x', 'medic-district-hospital.svg',
    'icon-disease-diabetes.svg', 'icon-healthcare-diagnosis@2x', 'icon-messages-on@2x', 'icon-people-family@2x', 'icon-places-clinic@2x', 'medic-family.svg'
]);

const toTuple = (arr: string[]) => arr as [string, ...string[]];


const eventSchema = zod.object({
    id: zod.string().min(2).max(50).default(() => crypto.randomUUID()),
    start: zod.coerce.number().int().min(0).max(365),
    end: zod.coerce.number().int().min(0).max(365),
    // mode: zod.literal('days'),
    days: zod.coerce.number().int().min(0).max(365),
}).refine(v => v.end >= v.start, { path: ['end'], message: 'end must be ≥ start' });

// const EventWithCustom = zod.object({
//     id: zod.string().min(2).max(50).default(() => crypto.randomUUID()),
//     start: zod.coerce.number().int().min(0).max(365),
//     end: zod.coerce.number().int().min(0).max(365),
//     mode: zod.literal('custom'),
//     dueDateExpr: zod.string().min(1, 'Required').max(200),
// }).refine(v => v.end >= v.start, { path: ['end'], message: 'end must be ≥ start' });

// const eventSchema = zod.discriminatedUnion('mode', [EventWithDays, EventWithCustom]);

const actionSchema = zod.object({
    type: zod.enum(["report", "contact"]),
    form: zod.string().min(2).max(50).optional(),  // only for type=report, xlsform id
    label: zod.string().min(2).max(50).optional(), // only for type=contact
    modifyContent: zod.string().min(1).max(1000).optional(), // only for type=contact, Will need to be wrapped in a function
}).superRefine((data, ctx) => {
    if (data.type === "report" && !data.form) {
        ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: "form is required when type is 'report'",
        });
    }
});

const prioritySchema = zod.object({
    level: zod.number().int().min(0).max(10),
    // label: zod.string().min(2).max(50),
})

// export function makeSchema(opts: {
//     reportTargets: string[];
//     contactTargets: string[];
// }) {
//     const { reportTargets, contactTargets } = opts;

//     return zod.discriminatedUnion("type", [
//         zod.object({
//             type: zod.literal("report"),
//             appliesToType: zod.enum(toTuple(reportTargets)),
//         }),
//         zod.object({
//             type: zod.literal("contact"),
//             appliesToType: zod.enum(toTuple(contactTargets)),
//         }),
//     ]);
// }

export function makeTaskSchema(opts: { contactTypes: string[]; formIds: string[] }) {
    // const contactTypeEnum = zod.enum(opts.contactTypes as [string, ...string[]]);
    // const FormId = zod.enum(opts.formIds as [string, ...string[]]);

    const base = zod.object({
        name: zod.string().min(2).max(50).regex(/^[a-zod0-9-]+$/, "use kebab-case (a–zod, 0–9, -)"),
        title: zod.string().min(2).max(80),
        icon: iconSchema,
        appliesTo: zod.enum(["contacts", "reports"]),
        /** The target entity types (usually ["person"] or ["clinic","health_center"]) */
        appliesToType: zod.any(),

        /**
         * In runtime this is a FUNCTION. Here you can store a string expression or DSL;
         * on export compile to: (contact, reports, ctx) => { return <expr>; }
         */
        appliesIf: zod.string().min(0).max(20_000).optional(),

        /** Optional: label template shown under a task; UI-only in Studio */
        contactLabel: zod.string().min(2).max(120).optional(),

        /** When to show/expire the task */
        events: zod.array(eventSchema).min(1).max(20),

        /** What happens when user taps the task */
        actions: zod.array(actionSchema).min(1).max(5),

        /** Optional priority */
        priority: prioritySchema.optional(),
    });

    return base.superRefine((v, ctx) => {
        if (v.appliesTo === "contacts") {
            const arr = Array.isArray(v.appliesToType) ? v.appliesToType : [];
            if (!arr.length || !arr.every((t: any) => (opts.contactTypes as string[]).includes(t))) {
                ctx.addIssue({ code: zod.ZodIssueCode.custom, path: ["appliesToType"], message: "Use valid contact types" });
            }
        } else {
            // reports: must be form ids
            const arr = Array.isArray(v.appliesToType) ? v.appliesToType : [];
            if (!arr.length || !arr.every((f: any) => (opts.formIds as string[]).includes(f))) {
                ctx.addIssue({ code: zod.ZodIssueCode.custom, path: ["appliesToType"], message: "Use valid form ids" });
            }
        }
    });
}

export type TaskSchema = zod.infer<ReturnType<typeof makeTaskSchema>>;

// export const taskSchema = zod.object({
//     name: zod.string().min(2).max(50).regex(/^[a-z0-9-]+$/, "Use only lowercase letters, numbers, and hyphens"),
//     icon: iconSchema,
//     title: zod.string().min(2).max(50),
//     appliesToType: zod.discriminatedUnion("appliesTo", [
//         zod.object({ appliesTo: zod.literal("contacts"), contactType: zod.string().min(2).max(50) }),
//         zod.object({ appliesTo: zod.literal("reports"), form: zod.string().min(2).max(50) })]),
//     appliesTo: zod.enum(["contacts", "reports"]),
//     appliesIf: zod.string().min(0).max(200).optional(),

//     contactLabel: zod.string().min(2).max(50).optional(),
//     resolvedIf: zod.string().min(2).max(200),
//     events: zod.array(eventSchema).min(1).max(20),
//     actions: zod.array(actionSchema).min(1).max(20),
//     priority: zod.array(prioritySchema).min(1).max(5).optional(),
// })

// export function makeHelperFunctionSchema(opts: Options) {
//     const reportSet = new Set(opts.reportIds.map(o => o.id));

// const ReportId = z.string().min(1, "Pick a report")
//     .refine(v => reportSet.has(v), "Invalid report");

// const FieldPath = z.string().min(1, "Pick a field");

// const ReportIdArray = z.array(z.string().min(1))
//     .nonempty("Select at least one report")
//     .refine(arr => arr.every(id => reportSet.has(id)), "Invalid report in list");

// const helperFunction = zod.discriminatedUnion("type", [
//     zod.object({
//         type: zod.literal("isTimely"),
//         date: zod.coerce.date(),
//         event: zod.string().min(2).max(50),
//     }),
//     zod.object({
//         type: zod.literal("addDate"),
//         days: zod.coerce.number().min(0).max(365),
//         event: zod.string().min(2).max(50),
//     }),
//     zod.object({
//         type: zod.literal("getMostRecentTimestamp"),
//         reports: ReportIdArray,
//         form: zod.string().min(2).max(50),
//     }),
//     zod.object({
//         type: zod.literal("getMostRecentReport"),
//         reports: ReportIdArray,
//         form: ReportId,
//     }),
//     zod.object({
//         type: zod.literal("isFormSubmittedInWindow"),
//         form: ReportId,
//         reports: ReportIdArray,
//         start: zod.coerce.date(),
//         end: zod.coerce.date(),
//     }),
//     zod.object({
//         type: zod.literal("isFirstReportNewer"),
//         firstReport: ReportId,
//         secondReport: ReportId,
//     }).refine(data => data.firstReport !== data.secondReport, {
//         message: "First and second report must be different",
//         path: ["secondReport"]
//     }),
//     zod.object({
//         type: zod.literal("isDateValid"),
//         date: zod.date(),
//     }),
//     zod.object({
//         type: zod.literal("now"),
//     }),
//     zod.object({
//         type: zod.literal("getField"),
//         report: zod.string().min(2).max(50),
//         fieldPath: zod.string().min(2).max(200),
//     }),
// ]);

// usage (after fetching lists at runtime)
// const Schema = makeSchema({
//     reportTargets: ["bp", "lab", "summary"],  // get form names at runtime
//     contactTargets: ["household", "person", "organization"], // get contact types from hierarchy
// });

