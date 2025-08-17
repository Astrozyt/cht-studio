import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Button } from "../../../components/button";
import { Checkbox } from "../../../components/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/form";
import { Input } from "../../../components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/select";
import { Action } from "../../helpers/formState";
import { NodeType } from "../../Zod/zodTypes";
import { bindTypeOptions, type NodeFormValues, nodeSchema } from "../../Zod/zodTypes";
import { HintsFields } from "./HintsFields";
import { InsertButtonCard } from "./InsertButtonCard";
import { ItemFields } from "./Itemfields";
import { LabelFields } from "./LabelFields";
import { useState } from "react";
import LogicBuilder from "../Logicbuilder/src/LogicBuilder";
import { toast, Toaster } from "sonner";
import { countRules } from "../../helpers";
import { RadioGroup, RadioGroupItem } from "../radio-group.tsx";
import { Label } from "../Label/index.tsx";
import { Separator } from "../Separator/index.tsx";
// import { LogicBuilder } from "../Logicbuilder"


// type NodeFormValues = z.infer<typeof nodeSchema>;

export const InsertNodeButton = ({
    dispatch,
    parentUid,
    parentRef,
    index,
    level,
    existingNodes
}: {
    dispatch: React.Dispatch<Action>,
    parentUid: string | null,
    parentRef: string,
    index: number,
    level: number,
    existingNodes: NodeFormValues[]
}) => {
    const form = useForm<NodeFormValues>({
        resolver: zodResolver(nodeSchema),
        defaultValues: {
            uid: nanoid(),
            tag: NodeType.Input, // default to Input type
            labels: [],
            // items: [{ value: 'test', labels: [{ lang: 'en', value: 'Test' }, { lang: 'se', value: 'testSE' }] }], // updated items structure
            items: [],
            ref: "",
            bind: {
                // nodeset: '',
                required: false,
                type: 'string',
                constraint: '',
                constraintMsg: '',
                readonly: false,
                relevant: undefined,//{ combinator: 'and', rules: [] },
                calculate: '',
                preload: '',
                preloadParams: ''
            },
        }
    });

    const mytag = useWatch({
        control: form.control,
        name: "tag",
    });

    const items = useWatch({
        control: form.control,
        name: "items",
    }) || [];

    const { append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const [openness, setOpenness] = useState(false);

    // const { register } = useFormContext();

    const onSubmit = (data: any) => {
        // console.log("Data", data);
        // console.log("Submitting new node", data);
        const result = nodeSchema.safeParse(data);
        if (result.success) {
            // result.data.ref = `${parentRef}${result.data.ref}`; // prepend parentRef to the new node's ref
            toast.success("Node created successfully!");
            // console.log("Parsed data", result.data);
            // console.log("Parent UID", parentUid);
            if (parentUid) {
                setOpenness(false);
                dispatch({ type: 'ADD_NODE_AT_INDEX', newNode: { ...result.data, uid: nanoid() }, parentUid, index });
            }
        } else {
            console.error("Validation errors", result.error.errors);
            // <Toaster t position="top-right" richColors closeButton />
            toast.error("Validation failed. Please check the form fields.");
        }
    }

    // const { control, register } = useFormContext();
    // const { fields, append, remove } = useFieldArray({
    //     control,
    //     name: "labels"
    // });

    const [showRelevantLogicBuilder, setShowRelevantLogicBuilder] = useState(false);

    const bindTypes = bindTypeOptions[mytag as keyof typeof bindTypeOptions] ?? [];

    return (
        <Dialog key={parentUid || '' + level + index} open={openness} onOpenChange={setOpenness}>
            <DialogTrigger><InsertButtonCard dispatch={dispatch} parentUid={parentUid} index={index} level={level} /></DialogTrigger>
            <DialogContent style={{ maxWidth: 'none', width: '90%', maxHeight: '90%', overflow: 'auto' }}>
                <>
                    <DialogHeader>
                        <DialogTitle>Create new Node</DialogTitle>
                        <DialogDescription>
                            Click to create a new node. You can then edit its properties in the form editor. {mytag}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} onInvalid={() => { console.log('error!') }} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="tag"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Node Type</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Type of Node" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    {Object.values(NodeType).map((type) => (
                                                        <SelectItem className="bg-white  hover:bg-gray-400" key={type} value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <Separator className="my-16 bg-gray-500" />

                            <FormField
                                control={form.control}
                                name="ref"
                                render={({ field }) => (
                                    <FormItem className="mb-8">
                                        <FormLabel>Field Name (Reference)</FormLabel>
                                        <FormDescription className="text-xs">The parent's reference is: <span className="italic">{parentRef}</span></FormDescription>
                                        <FormControl>
                                            <Input
                                                placeholder="Choose the name"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )} />
                            <Separator className="my-16 bg-gray-500" />

                            <FormField
                                control={form.control}
                                //
                                name="bind.required"
                                render={({ field }) => {
                                    // console.log("Field value", field.value);
                                    return <FormItem className={`${mytag != 'group' && mytag != 'note' && mytag != 'trigger' && mytag != 'repeat' ? '' : 'hidden'}`}>
                                        <FormLabel>Field Required</FormLabel>
                                        <div className="flex items-center space-x-2">
                                            <FormControl>
                                                <RadioGroup
                                                    value={field.value}
                                                    onValueChange={field.onChange}>
                                                    <FormItem className="flex items-center space-x-2">
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                value="yes"
                                                                className="aria-checked:bg-blue-500 aria-checked:text-white"
                                                            />
                                                        </FormControl>
                                                        <FormLabel>Yes</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2">
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                value="no"
                                                                className="aria-checked:bg-blue-500 aria-checked:text-white"

                                                            />
                                                        </FormControl>
                                                        <FormLabel>No</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2">
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                value="logic"
                                                                checked={field.value != 'yes' && field.value != 'no'}
                                                                className="aria-checked:bg-blue-500 aria-checked:text-white"
                                                            />
                                                        </FormControl>
                                                        <Label htmlFor="logic">Logic</Label>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            {field.value != 'yes' && field.value != 'no' && (

                                                <LogicBuilder
                                                    formFields={[]}
                                                    existingQuery={typeof field.value === 'object' ? field.value : undefined}
                                                    saveFn={(query) => {
                                                        alert("Logic saved: " + JSON.stringify(query));
                                                        field.onChange(query); // Save logic JSON

                                                    }}
                                                    cancelFn={() => null}
                                                />


                                            )}
                                        </div>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                }} />
                            <Separator className="my-16 bg-gray-500" />

                            <FormField
                                control={form.control}
                                name="bind.readonly"
                                render={({ field }) => {
                                    // console.log("Field value", field.value);
                                    return <FormItem className={`${mytag != 'group' && mytag != 'note' && mytag != 'trigger' && mytag != 'repeat' ? '' : 'hidden'} mb-8`}>
                                        <div className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    {...field}
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => field.onChange(checked)}
                                                />
                                            </FormControl>
                                            <FormLabel>Field Readonly</FormLabel>
                                        </div>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                }} />
                            <Separator className="my-16 bg-gray-500" />

                            <FormField
                                control={form.control}
                                name="bind.constraint"
                                render={({ field }) => (
                                    <FormItem className={`${mytag === 'input' ? '' : 'hidden'}`}>
                                        <FormLabel>Constraint</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Type the Constraint"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )} />

                            <FormField
                                control={form.control}
                                name="bind.constraintMsg"
                                render={({ field }) => (
                                    <FormItem className={`${mytag === 'input' ? '' : 'hidden'}`}>
                                        <FormLabel>Constraint Message</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Type the Constraint"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )} />

                            <Separator className="my-16 bg-gray-500" />

                            <LabelFields />
                            <Separator className="my-16 bg-gray-500" />

                            <HintsFields />
                            <Separator className="my-16 bg-gray-500" />

                            <ItemFields mytag={mytag} items={items} append={append} remove={remove} register={form.register} />
                            <Separator className="my-16 bg-gray-500" />

                            <FormField
                                control={form.control}
                                name="appearance"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Appearance Rule</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Choose the appearance rule"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <Separator className="my-16 bg-gray-500" />

                            <FormField
                                control={form.control}
                                name="bind.type"
                                render={({ field }) => {
                                    // console.log("Field value", field);
                                    return <FormItem className={`${mytag != 'group' && mytag != 'repeat' ? '' : 'hidden'}`}>
                                        <FormLabel>Bind Type</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Type of Bind" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    {bindTypes.map((type) => {
                                                        // console.log("Type", type);
                                                        return (
                                                            <SelectItem className="bg-white  hover:bg-gray-400" key={nanoid()} value={type}>
                                                                {type}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                }} />
                            <Separator className="my-16 bg-gray-500" />

                            <FormField
                                control={form.control}
                                name="bind.relevant"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Relevant</FormLabel>

                                        {<span>{countRules(field.value)}</span>}
                                        {showRelevantLogicBuilder && (
                                            <div className="mt-4">
                                                <LogicBuilder
                                                    existingQuery={field.value}
                                                    // onChange={(value) => {
                                                    //     field.onChange(value);
                                                    // }}
                                                    formFields={existingNodes}
                                                    saveFn={(query) => {
                                                        field.onChange(query);
                                                        setShowRelevantLogicBuilder(false);
                                                    }}
                                                    cancelFn={() => setShowRelevantLogicBuilder(false)}
                                                // parentRef={parentRef}
                                                // parentUid={parentUid || ''}
                                                />
                                            </div>
                                        )}
                                        <FormControl>
                                            <>
                                                {/* <p>{JSON.stringify(field.value)}</p>{ } */}
                                                {!showRelevantLogicBuilder && <Button type="button" variant="outline" onClick={() => setShowRelevantLogicBuilder(!showRelevantLogicBuilder)}>
                                                    {showRelevantLogicBuilder ? 'Hide Logic Builder' : 'Show Logic Builder'}
                                                </Button>
                                                }
                                            </>
                                        </FormControl>

                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <Separator className="my-16 bg-gray-500" />


                            <FormField
                                control={form.control}
                                name="bind.calculate"
                                render={({ field }) => (
                                    <FormItem className={`${mytag === 'input' ? '' : 'hidden'}`}>
                                        <FormLabel>Calculate</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Calculation condition"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <Separator className="my-16 bg-gray-500" />

                            <FormField
                                control={form.control}
                                name="bind.preload"
                                render={({ field }) => (
                                    <FormItem className={`${mytag === 'input' ? '' : 'hidden'}`}>
                                        <FormLabel>Preload</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Preload"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <FormField
                                control={form.control}
                                name="bind.preloadParams"
                                render={({ field }) => (
                                    <FormItem className={`${mytag === 'input' ? '' : 'hidden'}`}>
                                        <FormLabel>Preload Parameters</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Preload parameters"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )} />


                            <DialogFooter>
                                {/* <Button type="submit" onClick={() => {
                                    const data = form.getValues();
                                    console.log("Data before dispatch", data);
                                }}> */}
                                <Button type="submit">
                                    Save
                                </Button>
                                <DialogClose asChild><Button>Cancel</Button></DialogClose>
                            </DialogFooter>
                        </form>
                    </Form>
                </>
            </DialogContent>
        </Dialog >
    );
}

