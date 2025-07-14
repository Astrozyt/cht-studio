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
import { NodeType } from "../../Zod/zodTypes";
import { bindTypeOptions, nodeSchema } from "../../Zod/zodTypes";
import { HintsFields } from "./HintsFields";
import { InsertButtonCard } from "./InsertButtonCard";
import { ItemFields } from "./Itemfields";
import { LabelFields } from "./LabelFields";
import { useState } from "react";


type NodeFormValues = z.infer<typeof nodeSchema>;

export const InsertNodeButton = ({
    dispatch,
    parentUid,
    index,
    level,
}: {
    dispatch: React.Dispatch<Action>,
    parentUid: string | null,
    index: number,
    level: number
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
                relevant: '',
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
        if (result.success) {
            console.log("Parsed data", result.data);
            if (parentUid) {
                setOpenness(false);
                dispatch({ type: 'ADD_NODE_AT_INDEX', newNode: { ...result.data, uid: nanoid() }, parentUid, index });
            }
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

    const bindTypes = bindTypeOptions[mytag as keyof typeof bindTypeOptions] ?? [];

    return (
        <Dialog open={openness} onOpenChange={setOpenness}>
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
                            <FormField
                                control={form.control}
                                name="ref"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Field Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Choose the tag name"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                        <FormDescription className="text-blue-600" />
                                    </FormItem>
                                )} />

                            <FormField
                                control={form.control}
                                name="bind.required"
                                render={({ field }) => {
                                    // console.log("Field value", field.value);
                                    return <FormItem className={`${mytag != 'group' && mytag != 'note' && mytag != 'trigger' && mytag != 'repeat' ? '' : 'hidden'}`}>
                                        <FormLabel>Is Field Required?</FormLabel>
                                        <FormControl>
                                            {/* <Switch
                                            // {...field}
                                            checked={field.value === "true"}
                                            onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                                        /> */}
                                            <Checkbox
                                                {...field}
                                                checked={field.value}
                                                onCheckedChange={(checked) => field.onChange(checked)}
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                }} />
                            <FormField
                                control={form.control}
                                name="bind.readonly"
                                render={({ field }) => {
                                    // console.log("Field value", field.value);
                                    return <FormItem className={`${mytag != 'group' && mytag != 'note' && mytag != 'trigger' && mytag != 'repeat' ? '' : 'hidden'}`}>

                                        <FormLabel>Is Field Readonly?</FormLabel>
                                        <FormControl>
                                            {/* <Switch
                                            // {...field}
                                            checked={field.value === "true"}
                                            onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                                        /> */}
                                            <Checkbox
                                                {...field}
                                                checked={field.value}
                                                onCheckedChange={(checked) => field.onChange(checked)}
                                            />
                                        </FormControl>
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
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
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
                                        <FormMessage />
                                    </FormItem>
                                }} />
                            <FormField
                                control={form.control}
                                name="bind.relevant"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Relevant</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Relevancy condition"
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

