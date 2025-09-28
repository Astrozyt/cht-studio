import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-menubar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { Trash2, Save, PenIcon } from "lucide-react";
import { useState } from "react";
// import { RuleType, LastValueRule, CountRule, BooleanRule, AnyRule } from "..";
// import { Dialog, DialogContent } from "packages/formbuilder/src/components/dialog";
import { DialogTrigger, Dialog, DialogContent } from "@/components/ui/dialog";
import { AnyRule, RuleType, LastValueRule, CountRule, BooleanRule } from "../types";

export const CSEntryDetails = ({ r, updateRule, removeRule }: { r: AnyRule; updateRule: (id: string, data: Partial<AnyRule>) => void; removeRule: (id: string) => void; }) => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size='sm'><PenIcon className="h-4 w-4 mr-2" />See Details</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0">
                <Card key={r.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between text-base">
                            <span>{r.key || <span className="italic text-muted-foreground">(new field)</span>}</span>
                            {/* <div className="flex items-center gap-2">
                                <span className="text-xs rounded-full bg-muted px-2 py-0.5">{r.type}</span> */}
                            {/* <Button size="icon" variant="ghost" onClick={() => removeRule(r.id)} aria-label="Remove rule">
                                    <Trash2 className="w-4 h-4" />
                                </Button> */}
                            {/* </div> */}
                        </CardTitle>
                        <CardDescription>
                            Exposed as <code>context.{r.key || "<key>"}</code>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <Label htmlFor={`key-${r.id}`}>Key</Label>
                                <Input id={`key-${r.id}`} value={r.key} onChange={(e) => updateRule(r.id, { key: e.target.value })} placeholder="last_bp_systolic" />
                            </div>
                            <div>
                                <Label>Type</Label>
                                <span className="text-xs rounded-full bg-muted px-2 py-0.5">{r.type}</span>

                                {/* <Select value={r.type} onValueChange={(v) => updateRule(r.id, { type: v as RuleType })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select rule type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="last_value">last_value</SelectItem>
                                        <SelectItem value="count">count</SelectItem>
                                        <SelectItem value="boolean">boolean</SelectItem>
                                    </SelectContent>
                                </Select> */}
                            </div>
                            <div>
                                <Label htmlFor={`desc-${r.id}`}>Description (optional)</Label>
                                <Input id={`desc-${r.id}`} value={r.description || ""} onChange={(e) => updateRule(r.id, { description: e.target.value })} placeholder="Most recent systolic BP" />
                            </div>
                        </div>

                        {r.type === "last_value" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <Label htmlFor={`form-${r.id}`}>Form code</Label>
                                    <Input id={`form-${r.id}`} value={(r as LastValueRule).form} onChange={(e) => updateRule(r.id, { ...(r as LastValueRule), form: e.target.value })} placeholder="bp" />
                                </div>
                                <div>
                                    <Label htmlFor={`path-${r.id}`}>Field path</Label>
                                    <Input id={`path-${r.id}`} value={(r as LastValueRule).path} onChange={(e) => updateRule(r.id, { ...(r as LastValueRule), path: e.target.value })} placeholder="fields.systolic" />
                                </div>
                                <div>
                                    <Label htmlFor={`days-${r.id}`}>Within days</Label>
                                    <Input id={`days-${r.id}`} type="number" value={(r as LastValueRule).withinDays ?? 0} onChange={(e) => updateRule(r.id, { ...(r as LastValueRule), withinDays: Number(e.target.value) || undefined })} />
                                </div>
                            </div>
                        )}

                        {r.type === "count" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <Label htmlFor={`form-${r.id}`}>Form code</Label>
                                    <Input id={`form-${r.id}`} value={(r as CountRule).form} onChange={(e) => updateRule(r.id, { ...(r as CountRule), form: e.target.value })} placeholder="anc_visit" />
                                </div>
                                <div>
                                    <Label htmlFor={`where-${r.id}`}>Where (JS expression)</Label>
                                    <Input id={`where-${r.id}`} value={(r as CountRule).where || ""} onChange={(e) => updateRule(r.id, { ...(r as CountRule), where: e.target.value })} placeholder="r.fields.completed === true" />
                                </div>
                                <div>
                                    <Label htmlFor={`days-${r.id}`}>Within days</Label>
                                    <Input id={`days-${r.id}`} type="number" value={(r as CountRule).withinDays ?? 0} onChange={(e) => updateRule(r.id, { ...(r as CountRule), withinDays: Number(e.target.value) || undefined })} />
                                </div>
                            </div>
                        )}

                        {r.type === "boolean" && (
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <Label htmlFor={`logic-${r.id}`}>Logic (JS expression)</Label>
                                    <Textarea id={`logic-${r.id}`} rows={3} value={(r as BooleanRule).logic} onChange={(e: any) => updateRule(r.id, { ...(r as BooleanRule), logic: e.target.value })} placeholder="reports.some(r => r.form==='dx' && r.fields.dx_code==='E11')" />
                                </div>
                            </div>
                        )}

                        {/* {errs.length > 0 && (
                    <div className="text-red-600 text-sm">{errs.map((e, i) => <div key={i}>• {e}</div>)}</div>
                )} */}
                    </CardContent>
                    <CardFooter className="justify-end gap-2">
                        <Button variant="outline" size="sm"><Save className="w-4 h-4 mr-2" />Save</Button>
                        <Button size="sm" variant="outline" onClick={() => removeRule(r.id)} aria-label="Remove rule">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </Button>
                    </CardFooter>
                </Card>
            </DialogContent>
        </Dialog>
    );
}