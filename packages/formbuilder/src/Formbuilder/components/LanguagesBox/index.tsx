import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import { useFormStore } from "@ght/stores";
import { useState } from "react";

export const LanguagesBox = () => {
    const formLanguages = useFormStore(state => state.languages);
    const addLang = useFormStore(state => state.addLanguage);
    const removeLang = useFormStore(state => state.removeLanguage);
    const [newLang, setNewLang] = useState({ shortform: "", language: "" });

    const handleAddLanguage = () => {
        addLang(newLang.shortform, newLang.language);
        setNewLang({ shortform: "", language: "" });
    };

    return (
        <div>
            <h3>Languages</h3>
            <ul className="border w-fit">
                {formLanguages.map(lang => <li key={lang.shortform}>{lang.shortform}: {lang.language} <Button onClick={() => removeLang(lang.shortform)}>X</Button></li>)}
                <li className="flex">
                    <Input placeholder="Shortform" value={newLang.shortform} onChange={(e) => setNewLang({ ...newLang, shortform: e.target.value })} />
                    <Input placeholder="Language" value={newLang.language} onChange={(e) => setNewLang({ ...newLang, language: e.target.value })} />
                    <Button onClick={handleAddLanguage}>Add Language</Button>
                </li>
            </ul>
        </div>
    );
}
