import { useState } from "react";
import { Input } from "../../components/input";

export const RenderRef = ({ ref, onSave }: { ref: string, onSave: (newValue: string) => void }): JSX.Element => {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(ref);

    const handleSave = () => {
        onSave(draft);
        setIsEditing(false);
    };

    return isEditing ? (<Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
            if (e.key === "Enter") {
                handleSave();
            }
        }}
        autoFocus
    />) : (<span onClick={() => setIsEditing(true)} className="overflow-hidden border-r-1 flex-1 truncate hover:border-2"><p className="text-xs">Reference</p><p>{ref.split("/").pop()}</p></span>);
}

export const RenderLabels = ({ labels }: { labels: { lang: string; value: string }[] }): JSX.Element => {
    return (
        <span className="flex-1">
            <p>Labels</p>
            <ul className="w-48 border-r-1">
                {labels.map((label, i) => (
                    <li className="truncate whitespace-nowrap overflow-hidden" key={i}>
                        {label.lang}: {label.value}
                    </li>
                )) || "No Labels"}
            </ul>
        </span>
    );
}