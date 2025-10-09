import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ContactModel as ModelZ, ContactTypeModel as CTZ, ContactAttrType } from "./types";
import { generateCreateForm, generateEditForm, buildContactFieldRegistry, patchBaseSettings } from "./generators";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select";
import { Plus, Trash2, Download } from "lucide-react";
import { useEffect, useState } from "react";

async function saveJSON(path: string, obj: any) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = path.split("/").pop() || "file.json"; a.click();
    URL.revokeObjectURL(url);
}

type ModelInput = z.input<typeof ModelZ>;
type ContactType = z.infer<typeof CTZ>;

export function ContactModelEditor() {
    const form = useForm<ModelInput>({
        resolver: zodResolver(ModelZ),
        shouldUnregister: false,
        mode: "onChange",
        defaultValues: {
            contact_types: [
                {
                    id: "person",
                    label: "Person",
                    icon: "icon-people-person-general@2x",
                    parents: [],
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
        const parsed = ModelZ.parse(values);

        for (const ct of parsed.contact_types) {
            await saveJSON(`forms/${ct.id}-create.json`, generateCreateForm(ct));
            await saveJSON(`forms/${ct.id}-edit.json`, generateEditForm(ct));
        }
        await saveJSON(`configuration/contact-field-registry.json`, buildContactFieldRegistry(parsed));
        const base = { contact_types: [] as any[] };
        await saveJSON(`configuration/base_settings.patched.json`, patchBaseSettings(base, parsed));
    };

    const onError = (errs: any) => {
        console.error("Model errors:", errs);
    };

    const attrPath = `contact_types.${selectedIndex}.attributes` as const;

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
                                    <Input {...form.register(`contact_types.${i}.id` as const)} placeholder="id (kebab-case)" />

                                    {/* label button to select row */}
                                    <Button
                                        type="button"
                                        variant={isSel ? "default" : "outline"}
                                        className="flex-1 text-left"
                                        onClick={() => setSelectedIndex(i)}
                                    >
                                        {form.getValues(`contact_types.${i}.label`) || "—"}
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
                                    attributes: [],
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
                            </div>

                            <AttributesEditor key={attrPath} form={form} path={attrPath} />
                        </CardContent>
                        <CardFooter className="justify-end">
                            <Button type="submit">
                                <Download className="w-4 h-4 mr-2" />
                                Generate & Download
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
    path, // e.g. "contact_types.0.attributes"
}: {
    form: ReturnType<typeof useForm<ModelInput>>;
    path: `contact_types.${number}.attributes`;
}) {
    const { control, register, watch, setValue } = form;
    const fa = useFieldArray({ control, name: path });

    console.log("Rerender AttributesEditor", fa);

    return (
        <Card className="border-dashed">
            <CardHeader><CardTitle className="text-base">Attributes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                {fa.fields.map((row, i) => (
                    <div key={row.id} className="grid md:grid-cols-6 gap-2 items-end">
                        <Input {...register(`${path}.${i}.key` as const)} placeholder="key" />
                        <Input {...register(`${path}.${i}.label` as const)} placeholder="label" />

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
                            {...register(`${path}.${i}.saveTo` as const)}
                            placeholder='saveTo (e.g. "sex" or "parent._id")'
                        />
                        <Input
                            {...register(`${path}.${i}.hint` as const)}
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
                                                {...register(`${optionsName}.${j}.label` as const)}
                                                placeholder="Label (e.g., Female)"
                                            />
                                            <Input
                                                {...register(`${optionsName}.${j}.value` as const)}
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
