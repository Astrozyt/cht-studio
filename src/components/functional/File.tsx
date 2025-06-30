import { Edit, FileSpreadsheet, Folder, Play, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useState } from "react";
import { useNavigate } from "react-router";
import { BaseDirectory, remove } from "@tauri-apps/plugin-fs";

type FileProps = {
    name: string;
    isFolder: boolean;
    isForm?: boolean;
    projectName?: string; // Optional, used for forms
    updateFn?: (path: string) => void; // Optional, used to refresh the file list after deletion
};

const File = ({ projectName, isFolder, name, isForm, updateFn }: FileProps) => {
    console.log("projectName", projectName);
    const handleDelete = async (fileName: string) => {
        const result = await remove(`projects/${projectName}/forms/${fileName}`, { baseDir: BaseDirectory.AppLocalData })
        //TODO: Feedback with toast or similar
        console.log("Deleted " + fileName + " result", result);
        updateFn && updateFn(`projects/${projectName}/forms`);
    }

    let navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    return (
        <Card className="size-40 m-8 ">
            <CardHeader className="text-center">{name}</CardHeader>
            <CardContent className="flex justify-around">{isFolder ? <Folder /> : <FileSpreadsheet />}</CardContent>

            <CardFooter className="text-center px-0">
                <Button variant="ghost" className="w-1/3 border-t" onClick={() => { navigate(`${isForm ? 'forms/' : ''}${name}/emulate`) }}>
                    <Play />
                </Button>
                <Separator className="h-8" orientation="vertical" />
                <Button variant="ghost" className="w-1/3 border-t" onClick={() => { navigate(`${isForm ? 'forms/' : ''}${name}`) }}>
                    <Edit />
                </Button>
                <Separator className="h-8" orientation="vertical" />
                <Button variant="ghost" onClick={() => setIsOpen(true)} className="w-1/3 border-t">
                    <Trash />
                </Button>

                <AlertDialog open={isOpen}>
                    {/* <AlertDialogTrigger className="w-1/3 border-t justify-items-center h-full" variant="ghost"> <Trash /></AlertDialogTrigger> */}
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete that project and cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => { setIsOpen(false) }}>Back</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { handleDelete(name); setIsOpen(false); }}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </CardFooter>
        </Card>
    );
}

export default File;