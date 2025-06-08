//Question types according to https://docs.getodk.org/form-question-types/

import { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Question, questionSchema, QuestionTypes } from "./types";
import { Form, useParams } from "react-router";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import AddQuestionDialog from "./components/AddQuestionDialog";
import ChoicesDialog from "./components/ChoicesDialog";
import { Separator } from "@/components/ui/separator";


const FormEditor = () => {
    // const [elements, setElements] = useState([1, 2, 3]);


    const [questions, setQuestions] = useState<Question[]>([]);

    const MoveItem = (index: number, moveSize: number) => {
        //Move element one position
        const newQuestions = [...questions];
        newQuestions[index] = questions[index + moveSize];
        newQuestions[index + moveSize] = questions[index];
        setQuestions(newQuestions);
    }

    const editQuestionFn = (question: Question, questionId?: number) => {
        questionId ?
            setQuestions(questions.map((q, index) => {
                if (index === questionId) {
                    return question;
                }
                return q;
            })) :
            setQuestions([...questions, question]);
    }

    const setChoicesFn = (questionId: number, choices: { name: string }[]) => {
        setQuestions(questions.map((q, index) => {
            if (index === questionId) {
                return { ...q, options_list: choices };
            }
            return q;
        }));
    };

    return (
        <div className="grid grid-cols-[4fr_1fr] gap-1 mx-4">
            <Card>
                <Table>
                    {/* <TableCaption>Edit form {formName} of project {projectName}</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="w-[100px]">Name</TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead>Calculation</TableHead>
                            <TableHead className="text-right">Trigger</TableHead>
                            <TableHead>Choice filter</TableHead>
                            <TableHead>Parameters</TableHead>
                            <TableHead>Repeat count</TableHead>
                            <TableHead>Hint</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Audio</TableHead>
                            <TableHead>Video</TableHead>
                            <TableHead>Choices</TableHead>

                            {/* {questionSchema.shape.type.options.map(column => (
                                <TableHead key={column}>{column}</TableHead>
                            ))} */}
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {questions.map((question: Question, index) => (
                            //TODO: Implement correctly
                            <TableRow key={question.name}>
                                <TableCell>
                                    {index && <Button onClick={() => {
                                        MoveItem(index, -1)
                                    }}>{<ArrowUp />}</Button> || undefined}
                                    {index + 1 < questions.length && <Button onClick={() => { MoveItem(index, 1) }}><ArrowDown /></Button>
                                    }</TableCell>
                                <TableCell className="font-medium">{question.type}</TableCell>
                                <TableCell>{question.name}</TableCell>
                                <TableCell>{question.label}</TableCell>
                                <TableCell className="text-right">{question.calculation}</TableCell>
                                <TableCell className="text-right">{question.trigger}</TableCell>
                                <TableCell className="text-right">{question.choice_filter}</TableCell>
                                <TableCell className="text-right">{question.parameters}</TableCell>
                                <TableCell className="text-right">{question.repeat_count}</TableCell>
                                <TableCell className="text-right">{question.hint}</TableCell>
                                <TableCell className="text-right">{question.image || 'Path'}</TableCell>
                                <TableCell className="text-right">{question.audio || 'Path'}</TableCell>
                                <TableCell className="text-right">{question.video || 'Path'}</TableCell>
                                <TableCell className="text-right">{<ChoicesDialog questionId={index} question={question.label} existingChoices={question.options_list || []} setChoicesFn={setChoicesFn} />}</TableCell>




                            </TableRow>
                        ))}
                        <Separator className="my-2" dir="horizontal" />
                        <TableRow>
                            <TableCell colSpan={12} className="text-center">
                                <AddQuestionDialog editQuestionFn={editQuestionFn} questionData={undefined} questionId={undefined} />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>
            <Card id="questionChoices">
                Infos
            </Card>
        </div>
    );
}
export default FormEditor;