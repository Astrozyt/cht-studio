import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const NewLanguageDialog = ({ languages, setLanguages }: { languages: { short: string, long: string }[], setLanguages: React.Dispatch<React.SetStateAction<{ short: string, long: string }[]>> }) => {
    const [shortName, setShortName] = useState("");
    const [longName, setLongName] = useState("");
    const [longError, setLongError] = useState(false);
    const [shortError, setShortError] = useState(false);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Badge>Add language</Badge>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a New Language</DialogTitle>
                    <DialogDescription>
                        <Label className="mt-8">Short Name (e.g. "en")</Label>
                        <Input className={`mb-4 ${shortError ? "border-red-500" : ""}`} maxLength={2} minLength={2} placeholder="Short name" value={shortName} onChange={(e) => setShortName(e.target.value)} />
                        <Label>Long Name (e.g. "English")</Label>
                        <Input className={`mb-4 ${longError ? "border-red-500" : ""}`} minLength={3} placeholder="Long name" value={longName} onChange={(e) => setLongName(e.target.value)} />
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-8">
                    {/* <DialogClose asChild> */}
                    <Button type="submit" onClick={() => {
                        if (languages.find(l => l.short === shortName || shortName.length !== 2)) {
                            setShortError(true);

                        }
                        if (languages.find(l => l.long === longName || longName.length < 3)) {
                            setLongError(true);
                            // return;
                        }
                        if (!shortError && !longError && shortName && longName) {
                            setLanguages([...languages, { short: shortName, long: longName }]);
                            setShortName("");
                            setLongName("");
                            setShortError(false);
                            setLongError(false);
                            //Close dialog
                            document.querySelector("body")?.click();
                        }
                    }}>Add Language</Button>
                    {/* </DialogClose> */}
                    <DialogClose asChild>
                        <Button type="button" variant="outline" onClick={() => { setShortName(""); setLongName(""); setShortError(false); setLongError(false); }}>Close Window</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewLanguageDialog;
