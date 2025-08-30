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
import { appearanceOptions, NodeType } from "../../Zod/zodTypes";
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
import { useFormStore } from "../../../../../stores/src/formStore.ts";
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
                required: 'no',
                type: 'string',
                constraint: {},
                constraintMsg: '',
                readonly: false,
                relevant: {},//{ combinator: 'and', rules: [] },
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
        console.log("Submitting new node", data);
        const result = nodeSchema.safeParse(data);
        console.log("Result", result);
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
    console.log("Existing nodes:", existingNodes);

    const [showRelevantLogicBuilder, setShowRelevantLogicBuilder] = useState(false);

    const bindTypes = bindTypeOptions[mytag as keyof typeof bindTypeOptions] ?? [];

    const zodEnum = appearanceOptions[mytag as keyof typeof appearanceOptions] ?? [];

    const appearanceChoices = zodEnum ? zodEnum.options as string[] : [];

    const [requiredMode, setRequiredMode] = useState<'yes' | 'no' | 'logic'>('no');

    const formLanguages = useFormStore(state => state.languages);


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
                                                <SelectTrigger data-cy="node-type-select">
                                                    <SelectValue placeholder="Type of Node" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    {Object.values(NodeType).map((type) => (
                                                        <SelectItem className="bg-white  hover:bg-gray-400" data-cy={`node-type-option-${type}`} key={type} value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage data-cy="node-type-error" />
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
                                                data-cy="field-name-input"
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
                                                    value={requiredMode}
                                                    onValueChange={(val) => {
                                                        console.log("Selected value", val);
                                                        // setRequiredMode(val);
                                                        if (val === 'yes' || val === 'no') {
                                                            setRequiredMode(val);
                                                            field.onChange(val);
                                                        } else {
                                                            field.onChange({}); // Save logic JSON
                                                            setRequiredMode('logic');
                                                        }
                                                    }}
                                                    defaultValue="no">
                                                    <FormItem className="flex items-center space-x-2">
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                value="yes"
                                                                className="aria-checked:bg-blue-500 aria-checked:text-white"
                                                                data-cy="field-required-yes"
                                                            />
                                                        </FormControl>
                                                        <FormLabel>Yes</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2">
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                value="no"
                                                                className="aria-checked:bg-blue-500 aria-checked:text-white"
                                                                data-cy="field-required-no"
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
                                                                data-cy="field-required-logic"
                                                            />
                                                        </FormControl>
                                                        <Label htmlFor="logic">Logic</Label>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            {typeof requiredMode == 'object' || requiredMode === 'logic' && (

                                                <LogicBuilder
                                                    formFields={[]}
                                                    // existingQuery={field.value}
                                                    saveFn={(query) => {
                                                        // alert("Logic saved: " + JSON.stringify(query));
                                                        // field.onChange(query); // Save logic JSON
                                                        console.log("Logic saved", query);

                                                    }}
                                                    updateFn={(query) => {
                                                        field.onChange(query); // Save logic JSON}
                                                    }}
                                                    cancelFn={() => null}
                                                />


                                            )}
                                        </div>
                                        <FormDescription />
                                        <FormMessage className="text-red-500" />
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
                                                    data-cy="field-readonly-checkbox"
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
                                        {<span>{countRules(field.value)} rules.</span>}
                                        <LogicBuilder
                                            formFields={[{ ref: 'This Field', tag: 'thisField', uid: 'th15_f13ld' }]}
                                            updateFn={(query) => {
                                                field.onChange(query); // Save logic JSON}
                                            }}
                                        />
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
                                                data-cy="field-constraint-msg-input"
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
                                    <FormItem className={`${appearanceChoices && appearanceChoices.length > 0 ? '' : 'hidden'}`}>
                                        <FormLabel>Appearance Rule</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger data-cy="appearance-trigger">
                                                    <SelectValue placeholder="Select the appearance mode" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white">
                                                {appearanceChoices && appearanceChoices.map((choice) => (
                                                    <SelectItem key={choice} value={choice} data-cy={`appearance-option-${choice}`}>
                                                        {choice}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                                <SelectTrigger data-cy="bind-type-select">
                                                    <SelectValue placeholder="Type of Bind" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    {bindTypes.map((type) => {
                                                        // console.log("Type", type);
                                                        return (
                                                            <SelectItem className="bg-white  hover:bg-gray-400" key={nanoid()} value={type} data-cy={`bind-type-option-${type}`}>
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

                                        {<span>{countRules(field.value)} rules.</span>}
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
                                            {/* <p>{JSON.stringify(field.value)}</p>{ } */}
                                            {!showRelevantLogicBuilder && <Button type="button" variant="outline" onClick={() => setShowRelevantLogicBuilder(!showRelevantLogicBuilder)} data-cy="show-logic-builder-button">
                                                {showRelevantLogicBuilder ? 'Hide Logic Builder' : 'Show Logic Builder'}
                                            </Button>}
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
                                                data-cy="field-calculate-input"
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <Separator className="my-16 bg-gray-500" />

                            {/* TODO: Add a preloadmechanism, once the implementation of datastructures is clearer. */}
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
                                                data-cy="field-preload-input"
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
                                                data-cy="field-preload-params-input"
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )} />

                            <FormItem className="mt-8">
                                <FormLabel>Validation Errors</FormLabel>
                                <FormDescription className="text-xs">Below are the validation errors detected:</FormDescription>
                                <FormControl>
                                    <ul className="text-red-600 text-sm">
                                        {form.formState.errors && Object.entries(form.formState.errors).map(([key, error]) => (
                                            <li key={key} data-cy={`validation-error-${key}`}>
                                                <strong>{key}:</strong> {`${error?.message}`}
                                            </li>
                                        ))}
                                    </ul>
                                </FormControl>
                            </FormItem>
                            <DialogFooter>
                                <Button type="submit" data-cy="save-button">
                                    Save
                                </Button>
                                <DialogClose asChild><Button data-cy="cancel-button">Cancel</Button></DialogClose>
                            </DialogFooter>
                        </form>
                    </Form>
                </>
            </DialogContent>
        </Dialog >
    );
}

