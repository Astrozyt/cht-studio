import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-menubar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { Trash2, Save, PenIcon } from "lucide-react";
import { useState } from "react";
import { DialogTrigger, Dialog, DialogContent } from "@/components/ui/dialog";
import { AnyRule, RuleType, LastValueRule, CountRule, BooleanRule } from "../types";
import { updateContactSummaryRule } from "@ght/db";
import { useParams } from "react-router";
import { uid } from "../helpers";

export const CSEntryDetails = ({ r, removeRule, refreshList }: { r: AnyRule; removeRule: (id: number) => void; refreshList: (number: number) => void; }) => {
    const [rule, setRule] = useState<AnyRule>(r);

    const { projectId } = useParams<{ projectId: string }>();

    const returnSpecificCardContent = (type: AnyRule["type"]) => {
        console.log("Rendering specific card content for type:", type, rule);
        switch (rule.type) {
            case "last_value":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <Label>Form code</Label>
                            <Input id={`form-${r.id}`} value={(rule.form)} onChange={(e) => {
                                setRule({ ...rule, form: e.target.value });
                            }} placeholder="bp" />
                        </div>
                        <div>
                            <Label>Field path</Label>
                            <Input id={`path-${r.id}`} value={(rule.path)} onChange={(e) => {
                                setRule({ ...rule, path: e.target.value });
                            }} placeholder="fields.systolic" />
                        </div>
                        <div>
                            <Label>Within days</Label>
                            <Input id={`days-${r.id}`} type="number" value={(rule.withinDays ?? 0)} onChange={(e) => {
                                setRule({ ...rule, withinDays: Number(e.target.value) || undefined });
                            }} />
                        </div>
                    </div>

                );
            case "count":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            {/* TODO: Implement form code input from global form fields */}
                            <Label>Form code</Label>
                            <Input id={`form-${r.id}`} value={(rule).form} onChange={(e) => {
                                setRule({ ...rule, form: e.target.value });
                            }} placeholder="anc_visit" />
                        </div>
                        <div>
                            <Label>Where (JS expression)</Label>
                            <Input id={`where-${r.id}`} value={(rule).where || ""} onChange={(e) => {
                                setRule({ ...rule, where: e.target.value });
                            }} placeholder="r.fields.completed === true" />
                        </div>
                        <div>
                            <Label>Within days</Label>
                            <Input id={`days-${r.id}`} type="number" value={(rule).withinDays ?? 0} onChange={(e) => {
                                setRule({ ...rule, withinDays: Number(e.target.value) || undefined });
                            }} />
                        </div>
                    </div>
                );
            case "boolean":
                return (
                    <div className="grid grid-cols-1 gap-3">
                        <div>
                            <Label>Logic (JS expression)</Label>
                            <Textarea id={`logic-${r.id}`} rows={3} value={(rule.logic)} onChange={(e: any) => {
                                setRule({ ...rule, logic: e.target.value });
                            }} placeholder="reports.some(r => r.form==='dx' && r.fields.dx_code==='E11')" />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    const [open, setOpen] = useState(false);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size='sm'><PenIcon className="h-4 w-4 mr-2" />See Details</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0">
                <Card key={r.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between text-base">
                            <span>{r.key || <span className="italic text-muted-foreground">(new field)</span>}</span>
                        </CardTitle>
                        <CardDescription>
                            Exposed as <code>context.{r.key || "<key>"}</code>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <Label>Key</Label>
                                <Input id={`key-${r.id}`} value={rule.key} onChange={(e) => {
                                    setRule({ ...rule, key: e.target.value });
                                }} placeholder="key_of_this_field" />
                            </div>
                            <div>
                                <Label>Type</Label>
                                <span className="text-xs rounded-full bg-muted px-2 py-0.5">{rule.type}</span>
                            </div>
                            <div>
                                <Label>Description (optional)</Label>
                                <Input id={`desc-${r.id}`} value={rule.description || ""} onChange={(e) => {
                                    setRule({ ...rule, description: e.target.value });
                                }} placeholder="Description of this field" />
                            </div>
                        </div>
                        {returnSpecificCardContent(rule.type)}
                    </CardContent>
                    <CardFooter className="justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => updateContactSummaryRule(projectId!, r.id, rule).then(() => { console.log("Rule updated:", rule); refreshList(Math.floor(Math.random() * 5000)); setOpen(false); }).catch((error) => console.error("Error updating rule:", error))}><Save className="w-4 h-4 mr-2" />Save</Button>
                        <Button size="sm" variant="outline" onClick={() => removeRule(r.id)} aria-label="Remove rule">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </Button>
                    </CardFooter>
                </Card>
            </DialogContent>
        </Dialog>
    );
};


