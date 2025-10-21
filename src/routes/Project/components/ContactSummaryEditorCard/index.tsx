import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { FlatField, FormInfo, normalizeRow, suggestKey } from "./helpers";
import { SummaryRow, SummaryRowSchema } from "./types";

export const ContactSummaryEditorCard = () => {
    const [rows, setRows] = useState<SummaryRow[]>([
        {
            id: "rule1",
            key: "contact_last_name",
            rule: "last_value",
            form: "contact_form",
            fieldPath: "fields.last_name",
            type: "string",
            description: "Last name of the contact",
        },
        {
            id: "rule2",
            key: "days_since_last_contact",
            rule: "days_since_last_form",
            form: "contact_form",
            type: "number",
            withinDays: 30,
            fallback: 9999,
            description: "Days since last contact form submission",
        },
    ]);
    const [forms, setForms] = useState<FormInfo[]>([{ id: "contact_form", title: "Contact Form" }, { id: "survey_form", title: "Survey Form" }, { id: "feedback_form", title: "Feedback Form" }]);
    const [fieldsByForm, setFieldsByForm] = useState<Record<string, FlatField[]>>({ contact_form: [{ path: "fields.first_name", label: "First Name", type: "string" }, { path: "fields.last_name", label: "Last Name", type: "string" }, { path: "fields.age", label: "Age", type: "int" }], survey_form: [{ path: "fields.rating", label: "Rating", type: "int" }, { path: "fields.comments", label: "Comments", type: "string" }], feedback_form: [{ path: "fields.feedback_text", label: "Feedback Text", type: "string" }, { path: "fields.satisfaction_level", label: "Satisfaction Level", type: "int" }] });
    const { projectName } = useParams();

    //TODO: Load initial rows from DB

    //TODO: Real implementation


    // TODO: Save rows to DB/JSON
    const persistRows = async (rows: SummaryRow[]) => {
        // For simplicity, we clear all and re-add
        if (!projectName) return;
        return;
    };

    const defaultFormId = forms[0]?.id ?? "";
    const defaultField = defaultFormId ? (fieldsByForm[defaultFormId]?.[0]?.path ?? "") : "";
    const form = useForm<SummaryRow>({
        resolver: zodResolver(SummaryRowSchema),
        defaultValues: {
            id: "<unique_id>",
            key: defaultFormId ? suggestKey(defaultFormId, defaultField) : "",
            rule: "last_value",
            form: defaultFormId,
            fieldPath: defaultField,
            type: "number",
            withinDays: 365,
            fallback: "",
            description: "",
        },
        mode: "onBlur",
    });

    const { control, register, handleSubmit, setValue, getValues, watch, formState: { errors } } = form;

    const onAdd = handleSubmit(async (data) => {
        const normalized = normalizeRow(data);
        const next = [...rows, normalized];
        setRows(next);
        await persistRows(next); //TODO
        const currentForm = data.form;
        const firstField = fieldsByForm[currentForm]?.[0]?.path ?? "";
        form.reset({
            id: "<unique_id>",
            key: suggestKey(currentForm, firstField),
            rule: "last_value",
            form: currentForm,
            fieldPath: firstField,
            type: "number",
            withinDays: 365,
            fallback: "",
            description: "",
        });
    });

    const selectedRule = watch("rule");
    const selectedForm = watch("form");
    const availableFields = useMemo(
        () => (selectedForm ? (fieldsByForm[selectedForm] ?? []) : []),
        [selectedForm, fieldsByForm]
    );

    const removeRow = async (idx: number) => {
        const next = rows.filter((_, i) => i !== idx);
        setRows(next);
        await persistRows(next);
    };

    return (
        <Card className="space-y-4">
            <div className=" justify-between items-center">

                <h1 className="text-lg font-semibold">Contact Summary Editor</h1>
                <h2 className="text-sm text-muted-foreground">Define summary fields for contacts</h2>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Key</TableHead>
                            <TableHead>Rule</TableHead>
                            <TableHead>Form</TableHead>
                            <TableHead>Field</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Within</TableHead>
                            <TableHead>Fallback</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((r, i) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.key}</TableCell>
                                <TableCell>{r.rule}</TableCell>
                                <TableCell>{r.form}</TableCell>
                                <TableCell>{r.rule === "last_value" ? r.fieldPath?.replace(/^fields\./, '') : <em>—</em>}</TableCell>
                                <TableCell>{r.type}</TableCell>
                                <TableCell>{r.withinDays ?? <em>—</em>}</TableCell>
                                <TableCell>{r.fallback as any ?? <em>—</em>}</TableCell>
                                <TableCell>{r.description ?? <em>—</em>}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="destructive" size="sm" onClick={() => removeRow(i)}>Trash</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {rows.length === 0 && (
                            <TableRow><TableCell colSpan={9}><em>No rules yet</em></TableCell></TableRow>
                        )}
                        <TableRow>
                            <TableCell>
                                <Input {...register("key")} />
                                {errors.key && <p className="text-xs text-red-600">{errors.key.message}</p>}
                            </TableCell>

                            <TableCell>
                                <Controller
                                    control={control}
                                    name="rule"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={(v) => {
                                            field.onChange(v);
                                            if (v === "days_since_last_form") setValue("fieldPath", undefined, { shouldDirty: true });
                                        }}>
                                            <SelectTrigger><SelectValue placeholder="Rule" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="last_value">last_value</SelectItem>
                                                <SelectItem value="days_since_last_form">days_since_last_form</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </TableCell>

                            <TableCell>
                                <Controller
                                    control={control}
                                    name="form"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={(v) => {
                                            field.onChange(v);
                                            const first = fieldsByForm[v]?.[0]?.path ?? "";
                                            setValue("fieldPath", first, { shouldDirty: true });
                                            if (!getValues("key")) setValue("key", suggestKey(v, first), { shouldDirty: true });
                                        }}>
                                            <SelectTrigger><SelectValue placeholder="Form" /></SelectTrigger>
                                            <SelectContent>
                                                {forms.map(f => <SelectItem key={f.id} value={f.id}>{f.title ?? f.id}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.form && <p className="text-xs text-red-600">{errors.form.message}</p>}
                            </TableCell>

                            {selectedRule === "last_value" && (
                                <TableCell>
                                    <Controller
                                        control={control}
                                        name="fieldPath"
                                        render={({ field }) => (
                                            <Select value={field.value ?? ""} onValueChange={(v) => {
                                                field.onChange(v);
                                                // optional: guess type
                                                const ff = availableFields.find(f => f.path === v);
                                                if (ff?.type && ["int", "integer", "decimal", "number"].includes(ff.type)) {
                                                    setValue("type", "number", { shouldDirty: true });
                                                }
                                            }}>
                                                <SelectTrigger><SelectValue placeholder="Field" /></SelectTrigger>
                                                <SelectContent>
                                                    {availableFields.map(ff => (
                                                        <SelectItem key={ff.path} value={ff.path}>{ff.label} ({ff.path})</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.fieldPath && <p className="text-xs text-red-600">{errors.fieldPath.message}</p>}
                                </TableCell>
                            ) || (<TableCell><em>—</em></TableCell>)}

                            <TableCell>
                                <Controller
                                    control={control}
                                    name="type"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="number">number</SelectItem>
                                                <SelectItem value="string">string</SelectItem>
                                                <SelectItem value="boolean">boolean</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </TableCell>

                            {selectedRule === "last_value" && (
                                <>
                                    <TableCell>
                                        <Input type="number" {...register("withinDays", { valueAsNumber: true })} />
                                    </TableCell>

                                    <TableCell>
                                        <Input {...register("fallback" as const)} />
                                    </TableCell>
                                </>
                            ) || (<><TableCell><em>—</em></TableCell> <TableCell><em>—</em></TableCell></>)}
                            <TableCell>
                                <Input {...register("description")} />
                            </TableCell>

                            <TableCell className="flex justify-end">
                                <Button onClick={onAdd}>Add</Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </Card >
    );
}

