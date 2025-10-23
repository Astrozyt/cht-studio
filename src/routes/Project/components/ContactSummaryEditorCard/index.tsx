import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { FlatField, FormInfo, normalizeRow, suggestKey } from "./helpers";
import { SummaryRow, SummaryRowSchema } from "./types";
import { getAllProjectFields } from "@ght/db";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

export const ContactSummaryEditorCard = () => {
    const [rows, setRows] = useState<SummaryRow[]>([]);
    const [fieldsByForm, setFieldsByForm] = useState<Map<string, FlatField[]>>();
    const { projectName } = useParams();

    //TODO: Load initial rows from DB
    useEffect(() => {
        const loadAvailableFields = async () => {
            const rowsFromDb = await getAllProjectFields(projectName || "default");
            console.log("Loaded project fields:", rowsFromDb);
            const ProjectFieldMap = new Map<string, FlatField[]>();
            rowsFromDb.forEach(f => {
                const form = f.form;
                if (!ProjectFieldMap.has(form)) ProjectFieldMap.set(form, []);
                ProjectFieldMap.get(form)?.push({ path: f.jsonpath || f.name, label: f.label, type: f.type });
            });
            setFieldsByForm(ProjectFieldMap);
            console.log("Fields by form:", ProjectFieldMap);
        };
        loadAvailableFields();
    }, [projectName]);


    // Load initial rows from contact-summary.json
    useEffect(() => {
        const loadInitialRows = async () => {
            try {
                const data = await readTextFile(`projects/${projectName}/configuration/contact-summary.json`, { baseDir: BaseDirectory.AppLocalData });
                const parsed: SummaryRow[] = JSON.parse(data);
                setRows(parsed);
            } catch (error) {
                console.warn("Could not load contact-summary.json:", error);
            }
        };
        loadInitialRows();
    }, [projectName]);


    const defaultFormId = fieldsByForm && Array.from(fieldsByForm.keys())[0];

    const defaultField = defaultFormId && fieldsByForm ? (fieldsByForm.get(defaultFormId)?.[0]?.path ?? "") : "";
    const form = useForm<SummaryRow>({
        resolver: zodResolver(SummaryRowSchema),
        defaultValues: {
            id: crypto.randomUUID(),
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

    const onAdd = async (data: any) => {
        const normalRow = normalizeRow(data)
        const isUnique = !rows.find(r => r.key === normalRow.key);
        if (isUnique) {
            setRows([...rows, normalRow]);
            try {
                await writeTextFile(`projects/${projectName}/configuration/contact-summary.json`,
                    JSON.stringify([...rows, normalRow]),
                    { baseDir: BaseDirectory.AppLocalData });
            } catch (error) {
                toast.error("Could not save contact-summary.json:");
            }
        } else {
            toast.error(`A rule with the key '${normalRow.key}' already exists.`);
        }

        form.reset({
            id: crypto.randomUUID(),
            key: "",
            rule: "last_value",
            form: fieldsByForm ? Array.from(fieldsByForm.keys())[0] : "",
            fieldPath: fieldsByForm ? fieldsByForm.get(Array.from(fieldsByForm.keys())[0])?.[0]?.path || "" : "",
            type: "number",
            withinDays: 365,
            fallback: "",
            description: "",
        });
    };

    const selectedRule = watch("rule");
    const selectedForm = watch("form");
    const selectedFieldPath = watch("fieldPath");

    const removeRow = async (idx: number) => {
        const next = rows.filter((_, i) => i !== idx);
        setRows(next);
        try {
            await writeTextFile(`projects/${projectName}/configuration/contact-summary.json`,
                JSON.stringify(next),
                { baseDir: BaseDirectory.AppLocalData });
        } catch (error) {
            toast.error("Could not save contact-summary.json:");
        }
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
                            <TableHead className="w-32">Type</TableHead>
                            <TableHead className="w-20">Within</TableHead>
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
                                <Controller
                                    control={control}
                                    name="key"
                                    render={({ field }) => (
                                        <Input
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                />
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
                                        }}>
                                            <SelectTrigger><SelectValue placeholder="Form" /></SelectTrigger>
                                            <SelectContent>
                                                {fieldsByForm && Array.from(fieldsByForm.keys()).map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
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
                                            }}>
                                                <SelectTrigger><SelectValue placeholder="Field" /></SelectTrigger>
                                                <SelectContent>
                                                    {fieldsByForm && selectedForm && fieldsByForm.get(selectedForm)?.map(ff => (
                                                        <SelectItem key={ff.path} value={ff.path}>{ff.path}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.fieldPath && <p className="text-xs text-red-600">{errors.fieldPath.message}</p>}
                                </TableCell>
                            ) || (<TableCell><em>—</em></TableCell>)}

                            <TableCell>
                                <Input type="text" disabled value={selectedRule === 'days_since_last_form' ? fieldsByForm?.get(selectedForm)?.find(f => f.path === selectedFieldPath)?.type || '' : 'integer'} />
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
                                <Button type="submit" onClick={() => { handleSubmit(onAdd)(); }}><Plus /></Button>
                            </TableCell>

                            {/* <Controller
                                control={control}
                                name="jsonpath"
                                render={({ field }) => (
                                    <Input
                                        hidden
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        onBlur={field.onBlur}
                                    />
                                )}
                            /> */}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </Card >
    );
}

