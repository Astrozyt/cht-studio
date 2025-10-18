import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ContactModel as ModelZ, ContactTypeModel as CTZ, ContactAttrType } from "./types";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select";
import { Plus, Trash2, Download, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";

type ModelInput = z.input<typeof ModelZ>;
type ContactType = z.infer<typeof CTZ>;

export function ContactModelEditor({ saveFn, loadFn, feedbackFn }: { saveFn: (data: any) => Promise<void>, loadFn: () => Promise<string>, feedbackFn: (message: string, error: string) => void }) {


    const form = useForm<ModelInput>({
        resolver: zodResolver(ModelZ.deepPartial()),
        shouldUnregister: false,
        mode: "onChange",
        defaultValues: {
            contact_types: [
                {
                    id: "personId",
                    label: "Person",
                    icon: "icon-people-person-general@2x",
                    parents: [],
                    isPrimaryContact: false,
                    attributes: [
                        { key: "name", label: "Name", type: "text", saveTo: "name", required: true },
                        { key: "sex", label: "Sex", type: "select1", options: [{ value: "female", label: "Female" }, { value: "male", label: "Male" }], saveTo: "sex" },
                        { key: "date_of_birth", label: "Date of birth", type: "date", saveTo: "date_of_birth" },
                        { key: "external_id", label: "External ID", type: "text", saveTo: "external_id" },
                        { key: "household", label: "Household", type: "text", saveTo: "parent._id", required: true },
                    ],
                },
            ],
        },
    });

    const [isLoading, setIsLoading] = useState(true);
    const [existingModel, setExistingModel] = useState<ModelInput | null>(null);
    useEffect(() => {
        loadFn().then((content) => {
            const parsed = JSON.parse(content);
            console.log("Loaded existing contact model config:", parsed);
            setExistingModel(parsed);
            form.reset(parsed);
        }).catch((error) => {
            console.warn("No existing contact model config found, starting fresh.", error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);


    // form.reset()

    const [selectedIndex, setSelectedIndex] = useState(0);

    const ctFA = useFieldArray({ control: form.control, name: "contact_types" });

    useEffect(() => {
        if (ctFA.fields.length === 0) {
            setSelectedIndex(0);
            return;
        }
        if (selectedIndex >= ctFA.fields.length) {
            setSelectedIndex(ctFA.fields.length - 1);
        }
    }, [ctFA.fields.length, selectedIndex]);

    // submit
    const exportArtifacts = async (values: ModelInput) => {
        console.log("Exporting", values);
        const fixed = applyFixups(values);
        console.log("After fixups", fixed);
        const parsed = ModelZ.parse(fixed);
        if (!parsed.contact_types.length) {
            feedbackFn("", "Define at least one contact type.");
            return;
        }
        await saveFn(parsed);
        console.log("Contact model artifacts generated and saved.", parsed);

    };

    const onError = (errs: any) => {
        feedbackFn("", "Please fix validation errors before proceeding.");
        console.error("Model errors:", errs);
    };

    const attrPath = `contact_types.${selectedIndex}.attributes` as const;

    if (isLoading) return <div>Loading...</div>;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(exportArtifacts, onError)} className="grid gap-4 lg:grid-cols-[1fr_2fr]">
                {/* Contact types list */}
                <Card>
                    <CardHeader><CardTitle>Contact types</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {ctFA.fields.map((ct, i) => {
                            const isSel = i === selectedIndex;
                            return (
                                <div key={ct.id} className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const next =
                                                i < selectedIndex ? selectedIndex - 1
                                                    : i === selectedIndex ? Math.min(selectedIndex, ctFA.fields.length - 2)
                                                        : selectedIndex;
                                            ctFA.remove(i);
                                            setSelectedIndex(Math.max(0, next));
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>

                                    {/* id inline edit */}
                                    <Input
                                        value={form.watch(`contact_types.${i}.id`) || ''}
                                        onChange={(e) => {
                                            const value = e.target.value.trim().toLowerCase().replace(/\s+/g, "-");
                                            form.setValue(`contact_types.${i}.id` as const, value, { shouldValidate: true });
                                        }}
                                        placeholder="id (kebab-case)"
                                    />

                                    {/* label button to select row */}
                                    <Button
                                        type="button"
                                        variant={isSel ? "default" : "outline"}
                                        className="flex-1 text-left"
                                        onClick={() => setSelectedIndex(i)}
                                    >
                                        Edit <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            );
                        })}
                        {ctFA.fields.length === 0 && (
                            <p className="text-sm text-muted-foreground">No contact types defined.</p>
                        )}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                const newType: ContactType = {
                                    id: `new-type-${Date.now()}`,
                                    label: "New Type",
                                    icon: "icon-places-clinic@2x",
                                    parents: [],
                                    isPrimaryContact: false,
                                    personOrPlace: "place",
                                    attributes: [{ key: "name", label: "Name", type: "text", saveTo: "name", required: true, options: [] }],
                                };
                                const newIdx = ctFA.fields.length;
                                ctFA.append(newType);
                                setSelectedIndex(newIdx);
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" />Add type
                        </Button>
                    </CardContent>
                    <CardFooter />
                </Card>

                {/* Editor for selected type */}
                {ctFA.fields.length > 0 ? (
                    <Card key={selectedIndex}>
                        <CardHeader>
                            <CardTitle>
                                Edit: {form.watch(`contact_types.${selectedIndex}.label`) || "—"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-3 gap-3">
                                <FormField
                                    name={`contact_types.${selectedIndex}.label` as const}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Label</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name={`contact_types.${selectedIndex}.icon` as const}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Icon</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name={`contact_types.${selectedIndex}.parents` as const}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Parents (comma-separated ids)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    value={(field.value as string[] | undefined)?.join(",") || ""}
                                                    onChange={e =>
                                                        field.onChange(
                                                            e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* //Radiobutton to toggle personsOrPlace */}
                                <FormField
                                    name={`contact_types.${selectedIndex}.personOrPlace` as const}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact Type: </FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="person">Person</SelectItem>
                                                        <SelectItem value="place">Place</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name={`contact_types.${selectedIndex}.isPrimaryContact` as const}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Primary Contact</FormLabel>
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <AttributesEditor key={attrPath} form={form} path={attrPath} />
                        </CardContent>
                        <CardFooter className="justify-end">
                            <Button type="submit">
                                {/* <Download className="w-4 h-4 mr-2" />
                                Generate & Download */}
                                Save Contact Model
                            </Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Add a contact type to edit its details.
                        </CardContent>
                    </Card>
                )}
            </form>
        </Form>
    );
}

function AttributesEditor({
    form,
    path,
}: {
    form: ReturnType<typeof useForm<ModelInput>>;
    path: `contact_types.${number}.attributes`;
}) {
    const { control, watch, setValue } = form;
    const fa = useFieldArray({ control, name: path });

    return (
        <Card className="border-dashed">
            <CardHeader><CardTitle className="text-base">Attributes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                {fa.fields.map((row, i) => (
                    <div key={row.id} className="grid md:grid-cols-6 gap-2 items-end">
                        <Input
                            value={watch(`${path}.${i}.key` as const) || ''}
                            onChange={(e) => setValue(`${path}.${i}.key` as const, e.target.value.trim(), { shouldValidate: true })}
                            placeholder="key"
                            onBlur={(e) => {
                                const k = e.currentTarget.value.trim();
                                const s = watch(`${path}.${i}.saveTo` as const) as string | undefined;
                                if (!s) setValue(`${path}.${i}.saveTo` as const, k, { shouldValidate: true });
                            }} />

                        <Input
                            value={watch(`${path}.${i}.label` as const) || ''}
                            onChange={(e) => setValue(`${path}.${i}.label` as const, e.target.value.trim(), { shouldValidate: true })}
                            placeholder="label" />

                        <Select
                            value={watch(`${path}.${i}.type` as const) as any}
                            onValueChange={(val) => {
                                setValue(`${path}.${i}.type` as const, val as any, { shouldValidate: true });
                                // if switching to select/select1 and options missing, seed one row
                                if ((val === "select" || val === "select1") && !watch(`${path}.${i}.options` as const)?.length) {
                                    setValue(`${path}.${i}.options` as const, [{ value: "opt1", label: "Option 1" }], { shouldValidate: true });
                                }
                            }}
                        >
                            <SelectTrigger><SelectValue placeholder="type" /></SelectTrigger>
                            <SelectContent>
                                {ContactAttrType.options.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>


                        <Input
                            value={watch(`${path}.${i}.saveTo` as const) || ''}
                            onChange={(e) => setValue(`${path}.${i}.saveTo` as const, e.target.value.trim(), { shouldValidate: true })}
                            placeholder='saveTo (e.g. "sex" or "parent._id")'
                        />
                        <Input
                            value={watch(`${path}.${i}.hint` as const) || ''}
                            onChange={(e) => setValue(`${path}.${i}.hint` as const, e.target.value, { shouldValidate: true })}
                            placeholder="hint (optional)"
                        />

                        <div className="flex gap-2">
                            <Button type="button" variant="ghost" onClick={() => fa.remove(i)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        {(() => {
                            const t = watch(`${path}.${i}.type` as const);
                            if (t !== "select" && t !== "select1") return null;

                            const optionsName = `${path}.${i}.options` as const;
                            const opts = watch(optionsName) as { value: string; label: string }[] | undefined;

                            return (
                                <div className="md:col-span-6 rounded border p-3 space-y-2 ml-auto mr-auto w-4/5">
                                    <div className="text-sm font-medium">Options</div>

                                    {(opts ?? []).map((_, j) => (
                                        <div key={j} className="grid md:grid-cols-4 gap-2 items-end">
                                            <Input
                                                value={watch(`${optionsName}.${j}.label` as const) || ''}
                                                onChange={(e) => setValue(`${optionsName}.${j}.label` as const, e.target.value, { shouldValidate: true })}
                                                placeholder="Label (e.g., Female)"
                                            />
                                            <Input
                                                value={watch(`${optionsName}.${j}.value` as const) || ''}
                                                onChange={(e) => setValue(`${optionsName}.${j}.value` as const, e.target.value, { shouldValidate: true })}
                                                placeholder="Value (e.g., female)"
                                            />
                                            <div className="col-span-2 flex justify-end">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        const next = (opts ?? []).filter((__, idx) => idx !== j);
                                                        setValue(optionsName, next, { shouldValidate: true });
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                const next = [...(opts ?? []), { label: "Option", value: "option" }];
                                                setValue(optionsName, next, { shouldValidate: true });
                                            }}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />Add option
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                // convenience: generate values from labels (slugify)
                                                const normalized = (opts ?? []).map(o => ({
                                                    ...o,
                                                    value: (o.value?.trim() || o.label || "")
                                                        .toLowerCase()
                                                        .replace(/[^a-z0-9]+/g, "-")
                                                        .replace(/^-+|-+$/g, "") || "option",
                                                }));
                                                setValue(optionsName, normalized, { shouldValidate: true });
                                            }}
                                        >
                                            Auto-fill values
                                        </Button>
                                    </div>
                                </div>
                            );
                        })()}



                    </div>
                ))}

                <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                        fa.append({ key: "haircolor", label: "Hair color", type: "text", saveTo: "haircolor" } as any)
                    }
                >
                    <Plus className="w-4 h-4 mr-2" />Add attribute
                </Button>
            </CardContent>
        </Card>
    );
}

function slugId(id: string) {
    return (id ?? "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function applyFixups(values: any) {
    const v = structuredClone(values);

    v.contact_types = (v.contact_types ?? []).map((ct: any) => {
        const id = slugId(ct.id || ct.label || "contact");
        const label = ct.label || id;

        const attributes = (ct.attributes ?? []).map((a: any) => {
            console.info("Fixing up attr", a);
            const key = (a.key ?? "").trim() || "field";
            const label = a.label ?? key;
            // If saveTo empty, default to key
            const saveTo = (a.saveTo ?? "").trim() || key;

            // Ensure select/select1 has options array
            let options = a.options ?? [];
            if ((a.type === "select" || a.type === "select1") && options.length === 0) {
                options = [{ value: "option", label: "Option" }];
            }
            return { ...a, key, label, saveTo, options };
        });

        return { ...ct, id, label, attributes };
    });

    return v;
}