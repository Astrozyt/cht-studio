import { addLanguage, getLanguages, removeLanguage, setDefaultLanguage } from "@ght/db";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card } from "../../../../components/ui/card";
import { Badge } from "@/components/ui/badge";
import NewLanguageDialog from "../NewLanguageDialog";
import { StarIcon } from "lucide-react";


const LanguageCard = () => {
    const [languages, setLanguages] = useState<{ short: string, long: string, is_default: number }[]>([]);
    let { projectName } = useParams();

    if (!projectName) return <div>Loading...</div>;

    useEffect(() => {
        if (!projectName) return; // wait until it's available

        let cancelled = false;

        (async () => {
            try {
                const langs = await getLanguages(projectName);
                if (!cancelled) {
                    console.log("Languages from DB:", langs);
                    setLanguages(langs);
                }
            } catch (e) {
                console.error("Failed to load languages:", e);
                if (!cancelled) setLanguages([]); // fallback
            }
        })();

        return () => {
            cancelled = true; // avoid setting state after unmount
        };
    }, [projectName]);

    const onSaveFn = async (shortform: string, longform: string) => {
        addLanguage(projectName || "default", shortform, longform).then(() => {
            setLanguages([...languages, { short: shortform, long: longform, is_default: 0 }]);
        }).catch((error) => {
            console.error("Error adding language to database:", error);
        });
    }

    const onLanguageRemove = (shortform: string) => {
        // Delete in DB
        removeLanguage(projectName || "default", shortform).then(() => {
            console.log(`Language with short code '${shortform}' removed from DB.`);
        }).catch((err) => {
            console.error("Error removing language:", err);
        });
        // Remove from state
        setLanguages(languages.filter(lang => lang.short !== shortform));
    }

    return <Card className="m-4 pl-8">
        <div>
            <h2>Project Languages</h2>
            {languages.map(lang => (
                <Badge key={lang.short} variant="outline" className="me-6 py-2 pr-4">
                    <div onClick={() => { console.log("Setting default language:", lang.short); console.log('languages: ', languages); setDefaultLanguage(projectName || "default", lang.short).then(() => { setLanguages(languages.map(l => l.short === lang.short ? { ...l, is_default: 1 } : { ...l, is_default: 0 })) }) }}>
                        <StarIcon fill={lang.is_default === 0 ? "gray" : "yellow"} />
                    </div> ({lang.short}) {lang.long}
                    <span className="ml-4" onClick={() => onLanguageRemove(lang.short)}>X</span>
                </Badge>
            ))}
            <NewLanguageDialog languages={languages} onSaveFn={onSaveFn} />
        </div>
    </Card>;
};

export default LanguageCard;