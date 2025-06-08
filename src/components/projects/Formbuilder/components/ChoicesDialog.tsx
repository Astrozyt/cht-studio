import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const ChoicesDialog = ({ questionId, question, existingChoices, setChoicesFn }: { questionId: number, question: string, existingChoices: { name: string }[], setChoicesFn: (questionId: number, choices: { name: string }[]) => void }) => {
    const [choices, setChoices] = useState<{ name: string }[]>(existingChoices);
    const [newChoiceText, setNewChoiceText] = useState<string>("");

    const handleAddChoice = () => {
        console.log("Adding choice:", newChoiceText);
        setChoices([...choices, { name: newChoiceText }]);
        console.log("Updated choices:", choices);
        setNewChoiceText("");
    };

    const handleDeleteChoice = (index: number) => {
        const newChoices = choices.filter((_, i) => i !== index);
        setChoices(newChoices);
    };

    return <Dialog>
        <DialogTrigger asChild>
            <Badge variant="default" className="w-full">{`${choices.length} choices`}</Badge>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>New Question</DialogTitle>
                <DialogDescription>
                    <h1 className="mb-12 text-center">Choices for question: {question}</h1>
                </DialogDescription>
            </DialogHeader>
            <ul>
                {choices.map((choice, index) => (
                    <li key={index} className="flex items-center justify-between">
                        <p className="w-full">{choice.name}</p>
                        <Button variant="destructive" className="ml-2" onClick={() => handleDeleteChoice(index)}>Delete</Button>
                    </li>
                ))}
                <Separator className="my-2" dir="horizontal" />
                <li className="flex items-center justify-between">
                    <input type="text" value={newChoiceText} onChange={e => setNewChoiceText(e.target.value)} className="w-full" />
                    <Button variant="outline" className="ml-2" onClick={() => handleAddChoice()}>Add</Button>
                </li>
            </ul>
            <DialogFooter>
                <DialogClose asChild>
                    <Button onClick={() => setChoicesFn(questionId, choices)}>Save changes</Button>
                </DialogClose>
                <DialogClose asChild>

                    <Button variant="outline">
                        Cancel
                    </Button>
                </DialogClose>

            </DialogFooter>
        </DialogContent>
    </Dialog>
}
export default ChoicesDialog