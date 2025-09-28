import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Download, Play, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { CSEntryDetails } from "./components/CSEntryDetails";
import { AnyRule, BaseRule, BooleanRule, CountRule, LastValueRule, RuleType, SummaryConfig } from "./types";
import { uid } from "./helpers";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * CHT Contact-Summary Editor (MVP)
 * - Lets users define rules that become fields under instance('contact-summary')/context/*
 * - Generates configuration/contact-summary.templated.js
 *
 * Drop this file into your Studio app (e.g., packages/studio/src/components/summary/ContactSummaryEditor.tsx)
 * and wire it into your routing. Uses shadcn/ui + Tailwind classes.
 */
export default function ContactSummaryEditor() {
    const [rules, setRules] = useState<AnyRule[]>([
        {
            id: uid(),
            key: "last_bp_systolic",
            type: "last_value",
            form: "bp",
            path: "fields.systolic",
            withinDays: 365,
            description: "Most recent systolic BP"
        }
    ]);

    const [newRuleKey, setNewRuleKey] = useState<string>("");
    const [newRuleType, setNewRuleType] = useState<RuleType | undefined>(undefined);

    const config: SummaryConfig = useMemo(() => ({ fields: rules }), [rules]);
    // const js = useMemo(() => generateContactSummaryJS(config), [config]);

    function addRule() {
        const base: BaseRule = { id: uid(), key: newRuleKey, type: newRuleType } as any;
        let r: AnyRule;
        switch (newRuleType) {
            case "last_value":
                r = { ...base, type: "last_value", form: "", path: "fields.", withinDays: 365 } as LastValueRule;
                break;
            case "count":
                r = { ...base, type: "count", form: "", where: "", withinDays: 90 } as CountRule;
                break;
            case "boolean":
                r = { ...base, type: "boolean", logic: "reports.some(r => r.form==='dx')" } as BooleanRule;
                break;
        }
        setRules((rs) => [...rs, r!]);
        setNewRuleKey("");
        setNewRuleType(undefined);
    }

    function updateRule(id: string, patch: Partial<AnyRule>) {
        setRules((rs) => rs.map((r) => (r.id === id ? ({ ...r, ...patch } as AnyRule) : r)));
    }

    function removeRule(id: string) {
        setRules((rs) => rs.filter((r) => r.id !== id));
    }

    // function downloadJS() {
    //     const blob = new Blob([js], { type: "application/javascript;charset=utf-8" });
    //     const url = URL.createObjectURL(blob);
    //     const a = document.createElement("a");
    //     a.href = url;
    //     a.download = "contact-summary.templated.js";
    //     a.click();
    //     URL.revokeObjectURL(url);
    // }

    return (
        <Card className="m-4">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">

                    <h1 className="text-2xl font-semibold">Contact-Summary Editor</h1>
                    <p className="text-sm text-muted-foreground">Define fields exposed under <code>instance('contact-summary')/context/*</code></p>


                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Key</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rules.map((r) => {
                                    // const errs = validateRule(r);
                                    // return (<CSEntryDetails key={r.id} r={r} updateRule={updateRule} removeRule={removeRule} />);
                                    return (<TableRow key={r.id} className="hover:bg-accent/50">
                                        <TableCell>{r.key}</TableCell>
                                        {/* <TableCell>{r}</TableCell> */}

                                        <TableCell>{r.type}</TableCell>
                                        <TableCell>{r.description}</TableCell>
                                        <TableCell>{<CSEntryDetails key={r.id} r={r} updateRule={updateRule} removeRule={removeRule} />}</TableCell>
                                    </TableRow>);
                                })}
                            </TableBody>
                        </Table>
                        <div className="flex gap-2 border-t-2 pt-4">
                            <Input className="w-48" placeholder="New field key" value={newRuleKey} onChange={(e) => setNewRuleKey(e.target.value)} />
                            <Select value={newRuleType} onValueChange={(v) => setNewRuleType(v as RuleType)}>
                                <SelectTrigger className="w-half">
                                    <SelectValue placeholder="Select rule type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="last_value">Last Value</SelectItem>
                                    <SelectItem value="count">Count</SelectItem>
                                    <SelectItem value="boolean">Boolean</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={addRule} disabled={!newRuleKey || !newRuleType} variant="secondary"><Plus className="w-4 h-4 mr-2" />Add Rule</Button>
                        </div>
                    </div>

                    {/* <Tabs defaultValue="js" className="sticky top-4 h-fit">
                        <TabsList className="grid grid-cols-2 w-full">
                            <TabsTrigger value="js">Generated JS</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>
                        <TabsContent value="js">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Generated JS</CardTitle>
                                    <CardDescription>Place as <code>configuration/contact-summary.templated.js</code></CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Textarea className="font-mono text-xs" rows={28} readOnly value={js} />
                                </CardContent>
                                <CardFooter className="justify-between">
                                    <div className="text-xs text-muted-foreground">Fields: {rules.length}</div>
                                    <Button onClick={downloadJS}><Download className="w-4 h-4 mr-2" />Download</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="preview">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mock Preview</CardTitle>
                                    <CardDescription>Run the generated summary against sample contact & reports</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ContactSummaryPreview js={js} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs> */}
                </div>
            </div>
        </Card>
    );
}
