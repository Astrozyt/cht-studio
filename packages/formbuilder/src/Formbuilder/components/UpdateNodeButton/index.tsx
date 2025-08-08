import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { useFieldArray, useForm, useFormContext, useWatch } from "react-hook-form";
import { set, z } from "zod";
import { Button } from "../../../components/button";
import { Checkbox } from "../../../components/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/form";
import { Input } from "../../../components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/select";
import { Action } from "../../helpers/formState";
import { nodeSchema, NodeType } from "../../Zod/zodTypes";
import { bindTypeOptions, type NodeFormValues } from "../../Zod/zodTypes";
import { HintsFields } from "./HintsFields";
import { InsertButtonCard } from "./InsertButtonCard";
import { ItemFields } from "./Itemfields";
import { LabelFields } from "./LabelFields";
import { useState } from "react";
import { PenToolIcon } from "lucide-react";
import LogicBuilder from "../Logicbuilder/src/LogicBuilder";


// type NodeFormValues = z.infer<typeof nodeSchema>;

export const UpdateNodeButton = ({
    existingNode, dispatch, existingNodes
}: {
    dispatch: React.Dispatch<Action>,
    existingNode: NodeFormValues,
    existingNodes: NodeFormValues[]
}) => {
    const form = useForm<NodeFormValues>({
        resolver: zodResolver(nodeSchema),
        defaultValues: existingNode
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
        console.log("Submitting new node", data);
        const result = nodeSchema.safeParse(data);
        if (result.success) {
            // result.data.ref = `${parentRef}${result.data.ref}`; // prepend parentRef to the new node's ref
            console.log("Parsed data", result.data);
            // if (parentUid) {
            setOpenness(false);
            // TODO: Dispatch update action instead of adding a new node
            dispatch({ type: "UPDATE_NODE", uid: existingNode.uid, changes: { ...data } })
            // dispatch({ type: 'ADD_NODE_AT_INDEX', newNode: { ...result.data, uid: nanoid() }, parentUid, index });
            // }
        } else {
            console.error("Validation errors", result.error.errors);
            //TODO: Add Feedback via Toast
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
        <Dialog open={openness} onOpenChange={setOpenness}>
            <DialogTrigger className="bg-blue-500 hover:bg-blue-600 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3" onClick={() => setOpenness(true)}>
                {/* <InsertButtonCard dispatch={dispatch} parentUid={parentUid} index={index} level={level} /> */}
                {/* <Button onClick={() => setOpenness(true)} > */}
                <PenToolIcon />
                {/* </Button> */}
            </DialogTrigger>
            <DialogContent style={{ maxWidth: 'none', width: '90%', maxHeight: '90%', overflow: 'auto' }}>
                <>
                    <DialogHeader>
                        <DialogTitle>Update Node</DialogTitle>
                        <DialogDescription>
                            Click to update the node. You can then edit its properties in the form editor. {mytag}
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
                            <FormField
                                control={form.control}
                                name="ref"
                                render={({ field }) => (
                                    <FormItem className="mb-8">
                                        <FormLabel>Field Name (Reference)</FormLabel>
                                        {/* <FormDescription className="text-xs">The parent's reference is: <span className="italic">{parentRef}</span></FormDescription> */}
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

                            <FormField
                                control={form.control}
                                name="bind.required"
                                render={({ field }) => {
                                    // console.log("Field value", field.value);
                                    return <FormItem className={`${mytag != 'group' && mytag != 'note' && mytag != 'trigger' && mytag != 'repeat' ? '' : 'hidden'}`}>
                                        <div className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    {...field}
                                                    checked={field.value === true || field.value === "true()"}
                                                    onCheckedChange={(checked) => field.onChange(checked)}
                                                />
                                            </FormControl>
                                            <FormLabel>Field Required</FormLabel>
                                        </div>
                                        <FormDescription />
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                }} />
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


                            <LabelFields />
                            <HintsFields />
                            <ItemFields mytag={mytag} items={items} append={append} remove={remove} register={form.register} />
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
                                                value={field.value ?? ""}
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )} />
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
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                }} />
                            <FormField
                                control={form.control}
                                name="bind.relevant"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Relevant</FormLabel>
                                        {/* <textarea value={JSON.stringify(field.value, null, 2)} readOnly className="w-full h-32 p-2 border border-gray-300 rounded-md bg-gray-50" />
                                         */}
                                        {field.value == undefined || field.value.rules.length === 0 ? <span>No rule yet</span> : <span>Rule exists!</span>}
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

