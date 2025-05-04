import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Question, questionSchema } from "../types";
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type editQuestionFnType = (question: Question, questionId?: number) => void;


const AddQuestionDialog = ({ editQuestionFn, questionData, questionId }: { editQuestionFn: editQuestionFnType; questionData?: Question; questionId?: number }) => {

    const form = useForm<z.infer<typeof questionSchema>>({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            type: undefined,
            name: "",
            label: "",
            hint: undefined,
            required: false,
            relevant: null,
            appearance: null,
            default: null,
            constraint: null,
            constraint_message: "",
            calculation: null,
            trigger: null,
            choice_filter: null,
            parameters: null,
            repeat_count: null,
            image: null,
            audio: null,
            video: null
        }
    })

    const onSubmit = (data: z.infer<typeof questionSchema>) => {
        console.log("Data", data);
        if (questionId) {
            editQuestionFn(data, questionId);
        } else {
            editQuestionFn(data);
        }
    }

    return (<Dialog>
        <DialogTrigger asChild>
            <Button variant="outline">Add Question</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>New Question</DialogTitle>
                <DialogDescription>
                    <h1 className="mb-12 text-center">Name of new Form</h1>
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} onInvalid={() => { console.log('error!') }} className="space-y-4">
                    {/* <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel> Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Name"
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
                        )} /> */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Question Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Name"
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
                        name="label"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Question Label</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Label"
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
                        name="hint"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Question Hint</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Hint"
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
                        name="required"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Is Question Required</FormLabel>
                                <FormControl>
                                    <Switch
                                        onCheckedChange={(e) => {
                                            field.onChange(e);
                                        }}
                                        checked={field.value}
                                    />
                                </FormControl>
                                <FormDescription >{field.value ? 'Yes' : 'No'}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Question Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select the type of the question" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {questionSchema.shape.type.options.map((type) => {
                                            return <SelectItem key={type} value={type}>{type}</SelectItem>
                                        })}

                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    You can manage email addresses in your account settings.
                                </FormDescription>
                                <FormMessage>This is the form message</FormMessage>
                            </FormItem>
                        )} />
                    {/* <Button type="submit" variant="default">Add</Button> */}
                    {form.watch("type") === 'select_one_list_name' && <FormField
                        control={form.control}
                        name="options_list"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Options List</FormLabel>
                                <ul>
                                    {form.watch("options_list")?.map((option: any, index: number) => {
                                        return <li key={index}>{option.name}</li>
                                    })}
                                </ul>
                                {/* <FormControl>
                                <Input
                                        placeholder="New Option"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                        }}
                                        value={field.value}
                                    />
                                </FormControl> */}
                                <FormDescription>

                                </FormDescription>
                                <FormMessage>This is the form message</FormMessage>
                            </FormItem>
                        )} />}




                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={() => { }}>Cancel</Button>
                        </DialogClose>
                        {/* <DialogClose asChild> */}
                        <Button type="submit" variant="default">Add</Button>
                        {/* </DialogClose> */}
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>)
}
export default AddQuestionDialog;