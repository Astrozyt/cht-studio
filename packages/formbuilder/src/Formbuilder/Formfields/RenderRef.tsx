import { useState } from "react";
import { Input } from "../../components/input";

export const RenderRef = ({ nodeRef, onSave }: { nodeRef: string, onSave: (newValue: string) => void }): JSX.Element => {
    const [isEditing, setIsEditing] = useState(false);
    // split ref at last slash, reetrieving both parts
    // const [baseRef, refPart] = ref.split("/"); // split ref and retrieve both parts
    const lastSlashIndex = nodeRef.lastIndexOf("/");
    const baseRef = nodeRef.substring(0, lastSlashIndex + 1);
    const suffix = nodeRef.substring(lastSlashIndex + 1);
    const [draft, setDraft] = useState(suffix); // update draft to use refPart

    const handleSave = () => {
        onSave(`${baseRef}${draft}`);
        setIsEditing(false);
    };

    return isEditing ? (
        <span className="flex flex-col"><p className="text-xs ">{baseRef}</p>
            <Input
                // className=" block"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSave();
                    }
                }}
                autoFocus
            /></span>) : (<span onClick={() => setIsEditing(true)} className="overflow-hidden border-r-1 flex-1 truncate hover:border-2"><p className="text-xs">Reference</p><p>{suffix}</p></span>);
}