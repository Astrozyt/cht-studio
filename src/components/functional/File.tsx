import { Edit, FileSpreadsheet, Folder, Play, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useState } from "react";
import { useNavigate } from "react-router";

type FileProps = {
    name: string;
    isFolder: boolean;

};

const File = ({ isFolder, name }: FileProps) => {

    const handleDelete = (fileName: string) => {
        alert("Deleted " + fileName);
    }

    let navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    return (
        <Card className="size-40 m-8 ">
            <CardHeader className="text-center">{name}</CardHeader>
            <CardContent className="flex justify-around">{isFolder ? <Folder /> : <FileSpreadsheet />}</CardContent>

            <CardFooter className="text-center px-0">
                <Button variant="ghost" className="w-1/3 border-t" onClick={() => { navigate(`${name}/emulate`) }}>
                    <Play />
                </Button>
                <Separator className="h-8" orientation="vertical" />
                <Button variant="ghost" className="w-1/3 border-t" onClick={() => { navigate(`${name}`) }}>
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
                            <AlertDialogAction onClick={() => { handleDelete(name) }}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </CardFooter>
        </Card>
    );
}

export default File;