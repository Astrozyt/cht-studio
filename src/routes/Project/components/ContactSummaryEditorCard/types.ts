export type RuleType = "last_value" | "count" | "boolean";

export interface BaseRule {
    id: number; // ui id
    key: string; // exposed in contact-summary context
    type: RuleType;
    description?: string;
}

export interface LastValueRule extends BaseRule {
    type: "last_value";
    form: string; // form code, e.g., "bp"
    path: string; // dot path inside report, e.g., "fields.systolic"
    withinDays?: number; // optional time window
}

export interface CountRule extends BaseRule {
    type: "count";
    form: string; // form code
    where?: string; // JS predicate expression on report, e.g., "r.fields.completed === true"
    withinDays?: number;
}

export interface BooleanRule extends BaseRule {
    type: "boolean";
    logic: string; // JS expression with (reports, contact, utils)
}

export type AnyRule = LastValueRule | CountRule | BooleanRule;

export interface SummaryConfig {
    fields: AnyRule[];
}