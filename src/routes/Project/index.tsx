import { Menubar } from "@/components/ui/menubar";
import { Link, useParams } from "react-router";
import diagram from "../../assets/simple-bpmn-diagram-8354.webp";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import FormCard from "./components/FormCard";
import { Badge } from "@/components/ui/badge";
import NewLanguageDialog from "./components/NewLanguageDialog";
import { useEffect, useState } from "react";
import { addLanguage, getProjectFieldDb, getLanguageDb, getLanguages, removeLanguage } from "@ght/db";
import ContactSummaryEditorCard from "./components/ContactSummaryEditorCard";

const Project = () => {
  let { projectName } = useParams();

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


  const formFieldDB = projectName && getProjectFieldDb(projectName);


  const [languages, setLanguages] = useState<{ short: string, long: string }[]>([]);

  const onSaveFn = async (shortform: string, longform: string) => {
    addLanguage(projectName || "default", shortform, longform).then(() => {
      setLanguages([...languages, { short: shortform, long: longform }]);
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

  return (
    <>
      <div>
        <Menubar className="">

          <h1>Overview of:  <span className="bold">{projectName}</span></h1>
          <Button className="w-fit" disabled>Play project</Button>
          <Button className="w-fit" disabled>Sync</Button>
          <Button className="w-fit" disabled>New Branch</Button>
          <div>
            {languages.map(lang => (
              <Badge key={lang.short} variant="outline">{lang.long} <span onClick={() => onLanguageRemove(lang.short)}>X</span></Badge>
            ))}
            <NewLanguageDialog languages={languages} onSaveFn={onSaveFn} />
          </div>
        </Menubar>

        <ContactSummaryEditorCard />

        <FormCard updateView={() => { }} />

        <Card className="m-4">
          <Link to="tasks">
            <h1>connector</h1>
            <img className="size-xs" src={diagram} alt="Diagram" />
          </Link>
        </Card>
      </div >
    </>
  );
}

export default Project;