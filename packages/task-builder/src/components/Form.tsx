import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

// TaskForm.tsx
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray } from "react-hook-form";
import { Button } from "./ui/button";
import { Card, CardDescription, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form, FormDescription } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { makeTaskSchema, type TaskSchema as TaskValues } from "../types";
import type zod from "zod";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
// import { DialogTitle } from "@radix-ui/react-dialog";


export default function TaskForm({
    contactTypes,
    formIds,
    onSubmit,
    existingTask,
    isDialogOpen,
    setIsDialogOpen
}: {
    contactTypes: string[];
    formIds: string[];
    onSubmit: (v: TaskValues) => void;
    existingTask: TaskValues | null;
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
}) {
    const schema = useMemo(() => makeTaskSchema({ contactTypes, formIds }), [contactTypes, formIds]);

    // keep ONE schema instance

    // use INPUT type for RHF
    type TaskInput = zod.input<typeof schema>;
    type TaskOutput = zod.output<typeof schema>;

    const form = useForm<TaskInput>({
        resolver: zodResolver(schema),
        mode: "onChange",
        shouldUnregister: true,
        defaultValues: existingTask ? (existingTask as TaskInput) : {
            name: "",
            title: "",
            icon: "icon-calendar",
            appliesTo: "contacts",
            appliesToType: contactTypes.length ? [contactTypes[0]] : [],
            appliesIf: "",
            events: [{ id: crypto.randomUUID(), start: 0, end: 14, days: 0 } as any],
            actions: [{ type: "report", form: formIds[0], label: "" }],
            priority: { level: 10 },
        },
    });

    const onError = (errs: any) => console.error("RHF errors:", errs);

    const { control, handleSubmit, watch, setValue } = form;
    const appliesTo = watch("appliesTo");

    const eventsFA = useFieldArray({ control, name: "events" });
    const actionsFA = useFieldArray({ control, name: "actions" });

    useEffect(() => {
        if (appliesTo === "contacts") {
            if (contactTypes.length) setValue("appliesToType", [contactTypes[0]], { shouldValidate: true });
        } else {
            if (formIds.length) setValue("appliesToType", [formIds[0]], { shouldValidate: true });
        }
    }, [appliesTo, contactTypes, formIds, setValue]);

    const onValid: SubmitHandler<TaskInput> = (values) => onSubmit(schema.parse(values));

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-1/1 max-h-screen m-4 overflow-y-auto">
                <DialogTitle>{existingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onValid, (e) => console.error(e))} className="space-y-6 grid grid-cols-2">
                        {/* BASICS */}
                        <Card className="w-full grid-cols-2">
                            <CardHeader>
                                <CardTitle>Basics</CardTitle>
                                <CardDescription>General task info</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-3">
                                <FormField
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name (kebab-case)</FormLabel>
                                            <FormControl><Input placeholder="bp-follow-up" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField

                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl><Input placeholder="Follow-up blood pressure" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField

                                    name="icon"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Icon</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger><SelectValue placeholder="Pick icon" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="icon-calendar">icon-calendar</SelectItem>
                                                        <SelectItem value="icon-follow-up">icon-follow-up</SelectItem>
                                                        <SelectItem value="icon-death-general">icon-death-general</SelectItem>
                                                        <SelectItem value="icon-people-person-general@2x">icon-people-person-general@2x</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormDescription>Extend this list with all supported icons.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* TARGET */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Target</CardTitle>
                                <CardDescription>Where tasks are generated</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <FormField

                                    name="appliesTo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Applies to</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="contacts">contacts</SelectItem>
                                                        <SelectItem value="reports">reports</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField

                                    name="appliesToType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{appliesTo === "contacts" ? "Contact types" : "Form IDs"}</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(v) => field.onChange([v])}
                                                    value={Array.isArray(field.value) ? field.value[0] : ""}
                                                >
                                                    <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
                                                    <SelectContent>
                                                        {(appliesTo === "contacts" ? contactTypes : formIds).map(x => (
                                                            <SelectItem key={x} value={x}>{x}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormDescription>First version uses single-select; switch to multiselect later.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField

                                    name="appliesIf"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>appliesIf (optional)</FormLabel>
                                            <FormControl><Textarea rows={3} placeholder="ctx.contactSummary.last_bp_systolic > 140" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField

                                    name="contactLabel"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Contact label (optional)</FormLabel>
                                            <FormControl><Input placeholder="Patient: ${contact.name}" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField

                                    name="priority.level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Priority (0–10)</FormLabel>
                                            <FormControl><Input
                                                type="number"
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    field.onChange(v === "" ? undefined : Number(v));
                                                }}
                                                onBlur={field.onBlur}
                                            /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* EVENTS */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Events</CardTitle>
                                <CardDescription>Due/expiry windows</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">

                                {eventsFA?.fields && eventsFA.fields.map((row, i) => {
                                    console.log("Event row:", row);
                                    const ev = form.watch(`events.${i}`) ?? {};
                                    // const hasDays = "days" in (form.getValues(`events.${i}`) as any);
                                    // const hasDays = true;
                                    const hasDays =
                                        ev && typeof ev === 'object' && !Array.isArray(ev) && 'days' in ev;

                                    return (
                                        <Card key={row.id} className="border-dashed">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base">Event {i + 1}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="grid gap-4 md:grid-cols-3">
                                                <FormField
                                                    name={`events.${i}.start` as const}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>start</FormLabel>
                                                            <FormControl><Input
                                                                type="number"
                                                                value={field.value ?? ""}
                                                                onChange={(e) => {
                                                                    const v = e.target.value;
                                                                    field.onChange(v === "" ? undefined : Number(v));
                                                                }}
                                                                onBlur={field.onBlur}
                                                            /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField

                                                    name={`events.${i}.end` as const}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>end</FormLabel>
                                                            <FormControl><Input
                                                                type="number"
                                                                value={field.value ?? ""}
                                                                onChange={(e) => {
                                                                    const v = e.target.value;
                                                                    field.onChange(v === "" ? undefined : Number(v));
                                                                }}
                                                                onBlur={field.onBlur}
                                                            /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />




                                                <FormField
                                                    name={`events.${i}.days` as const}
                                                    render={({ field }) => (
                                                        <FormItem className="md:col-span-3">
                                                            <FormLabel>days</FormLabel>
                                                            <FormControl><Input
                                                                type="number"
                                                                value={field.value ?? ""}
                                                                onChange={(e) => {
                                                                    const v = e.target.value;
                                                                    field.onChange(v === "" ? undefined : Number(v));
                                                                }}
                                                                onBlur={field.onBlur}
                                                            /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                            </CardContent>
                                            <CardFooter className="justify-end">
                                                <Button variant="ghost" type="button" onClick={() => eventsFA.remove(i)}>
                                                    <Trash2 className="w-4 h-4 mr-2" />Remove
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                                {form.formState.errors.events && (
                                    <p className="text-sm text-red-500">
                                        {(form.formState.errors.events as any).message ?? "Add at least one event"}
                                    </p>
                                )}
                                <Button type="button" variant="secondary" onClick={() => eventsFA.append({ id: crypto.randomUUID(), start: 0, end: 14, days: 0 } as any)}>
                                    <Plus className="w-4 h-4 mr-2" />Add event
                                </Button>
                            </CardContent>
                        </Card>

                        {/* ACTIONS */}
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                                <CardDescription>What happens when the task is opened</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {actionsFA.fields.map((row, i) => {
                                    const type = form.watch(`actions.${i}.type` as const);
                                    return (
                                        <Card key={row.id} className="border-dashed">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base">Action {i + 1}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="grid gap-4 md:grid-cols-2">
                                                <FormField

                                                    name={`actions.${i}.type` as const}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Type</FormLabel>
                                                            <FormControl>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="report">report</SelectItem>
                                                                        <SelectItem value="contact">contact</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {type === "report" && (
                                                    <FormField

                                                        name={`actions.${i}.form` as const}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Form</FormLabel>
                                                                <FormControl>
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                                        <SelectContent>
                                                                            {formIds.map(fid => <SelectItem key={fid} value={fid}>{fid}</SelectItem>)}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                )}

                                                <FormField

                                                    name={`actions.${i}.label` as const}
                                                    render={({ field }) => (
                                                        <FormItem className="md:col-span-2">
                                                            <FormLabel>Label (optional)</FormLabel>
                                                            <FormControl><Input {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField

                                                    name={`actions.${i}.modifyContent` as const}
                                                    render={({ field }) => (
                                                        <FormItem className="md:col-span-2">
                                                            <FormLabel>modifyContent (string for now)</FormLabel>
                                                            <FormControl><Textarea rows={3} placeholder="content.person_id = contact._id;" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </CardContent>
                                            <CardFooter className="justify-end">
                                                <Button variant="ghost" type="button" onClick={() => actionsFA.remove(i)}>
                                                    <Trash2 className="w-4 h-4 mr-2" />Remove
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}

                                <Button type="button" variant="secondary" onClick={() => actionsFA.append({ type: "report", form: formIds[0], label: "" })}>
                                    <Plus className="w-4 h-4 mr-2" />Add action
                                </Button>
                            </CardContent>
                        </Card>

                        {form.formState.errors.actions && (
                            <p className="text-sm text-red-500">
                                {(form.formState.errors.actions as any).message ?? "Add at least one action"}
                            </p>
                        )}

                        <DialogFooter className="col-span-2">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save Task</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    );
}

// const onClose = () => {
//     // Implement dialog close logic here
//     setIsDialogOpen(false);
// };