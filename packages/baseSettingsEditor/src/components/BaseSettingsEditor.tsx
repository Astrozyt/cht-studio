import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ContactModel as ModelZ, ContactTypeModel as CTZ, ContactAttrType } from "./types";
import { generateCreateForm, generateEditForm, buildContactFieldRegistry, patchBaseSettings } from "./generators";

// shadcn
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select";
import { Plus, Trash2, Download } from "lucide-react";
import { useEffect, useState } from "react";

// quick file save helper (replace with your FS/Tauri IPC)
async function saveJSON(path: string, obj: any) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = path.split("/").pop() || "file.json"; a.click();
    URL.revokeObjectURL(url);
}

type ModelInput = z.input<typeof ModelZ>;

export default function ContactModelEditor() {



    const form = useForm<ModelInput>({
        resolver: zodResolver(ModelZ),
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
        mode: "onChange",
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

    const attrsFA = useFieldArray({ control: form.control, name: `contact_types.${selectedIndex}.attributes` as const });

    // Actions
    const exportArtifacts = async (values: ModelInput) => {
        const parsed = ModelZ.parse(values);
        // 1) forms
        for (const ct of parsed.contact_types) {
            await saveJSON(`forms/${ct.id}-create.json`, generateCreateForm(ct));
            await saveJSON(`forms/${ct.id}-edit.json`, generateEditForm(ct));
        }
        // 2) registry
        await saveJSON(`configuration/contact-field-registry.json`, buildContactFieldRegistry(parsed));
        // 3) base_settings patch (you’ll load existing base_settings.json in real app)
        const base = { contact_types: [] as any[] };
        await saveJSON(`configuration/base_settings.patched.json`, patchBaseSettings(base, parsed));
    };

    return (
        <Form {...form}>
            <form className="grid gap-4 lg:grid-cols-[1fr_2fr]">
                {/* Contact types list (v1 just single) */}
                <Card>
                    <CardHeader><CardTitle>Contact types</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {ctFA.fields.map((ct, i) => (
                            <div key={ct.id} className="flex items-center gap-2">
                                <Input {...form.register(`contact_types.${i}.id` as const)} placeholder="id (kebab-case)" />
                                <Button variant="ghost" onClick={() => ctFA.remove(i)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        ))}
                        <Button type="button" variant="secondary" onClick={() => ctFA.append({ id: "new-type", label: "New", icon: "icon-places-clinic@2x", parents: [], attributes: [] })}>
                            <Plus className="w-4 h-4 mr-2" />Add type
                        </Button>
                    </CardContent>
                    <CardFooter />
                </Card>

                {/* Editor for selected type (simplified to first) */}
                <Card>
                    <CardHeader><CardTitle>Edit: {form.watch(`contact_types.${selectedIndex}.label`) || "—"}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-3">
                            <FormField
                                name={`contact_types.${selectedIndex}.label` as const}
                                render={({ field }) => (
                                    <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}
                            />
                            <FormField
                                name={`contact_types.${selectedIndex}.icon` as const}
                                render={({ field }) => (
                                    <FormItem><FormLabel>Icon</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}
                            />
                            <FormField
                                name={`contact_types.${selectedIndex}.parents` as const}
                                render={({ field }) => (
                                    <FormItem><FormLabel>Parents (comma-separated ids)</FormLabel>
                                        <FormControl>
                                            <Input
                                                value={(field.value as string[] | undefined)?.join(",") || ""}
                                                onChange={e => field.onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Card className="border-dashed">
                            <CardHeader><CardTitle className="text-base">Attributes</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                {attrsFA.fields.map((row, i) => (
                                    <div key={row.id} className="grid md:grid-cols-6 gap-2 items-end">
                                        <Input {...form.register(`contact_types.${selectedIndex}.attributes.${i}.key`)} placeholder="key" />
                                        <Input {...form.register(`contact_types.${selectedIndex}.attributes.${i}.label`)} placeholder="label" />
                                        <Select
                                            onValueChange={val => form.setValue(`contact_types.${selectedIndex}.attributes.${i}.type` as const, val as z.infer<typeof ContactAttrType>)}
                                            defaultValue={form.getValues(`contact_types.${selectedIndex}.attributes.${i}.type` as const) as any}
                                        >
                                            <SelectTrigger><SelectValue placeholder="type" /></SelectTrigger>
                                            <SelectContent>
                                                {ContactAttrType.options.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Input {...form.register(`contact_types.${selectedIndex}.attributes.${i}.saveTo`)} placeholder='saveTo (e.g. "sex" or "parent._id")' />
                                        <Input {...form.register(`contact_types.${selectedIndex}.attributes.${i}.hint`)} placeholder="hint (optional)" />
                                        <div className="flex gap-2">
                                            <Button type="button" variant="ghost" onClick={() => attrsFA.remove(i)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" variant="secondary" onClick={() => attrsFA.append({ key: "haircolor", label: "Hair color", type: "text", saveTo: "haircolor" } as any)}>
                                    <Plus className="w-4 h-4 mr-2" />Add attribute
                                </Button>
                            </CardContent>
                        </Card>
                    </CardContent>
                    <CardFooter className="justify-end">
                        <Button type="button" onClick={form.handleSubmit(exportArtifacts)}>
                            <Download className="w-4 h-4 mr-2" />Generate & Download
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
