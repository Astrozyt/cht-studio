import { Menubar } from "@/components/ui/menubar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { getProjectFieldDb } from "@ght/db";
import { Link, useParams } from "react-router";
import diagram from "../../assets/simple-bpmn-diagram-8354.webp";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { ContactSummaryEditorCard } from "./components/ContactSummaryEditorCard";
import FormCard from "./components/FormCard";
import LanguageCard from "./components/LanguageCard";
import { ContactModelEditor, buildContactFieldRegistry, generateCreateForm, generateEditForm, patchBaseSettings } from "@ght/contactmodeleditor";
import { BaseDirectory, mkdir, readTextFile, remove, writeTextFile } from "@tauri-apps/plugin-fs";
import { toast } from "sonner";



const Project = () => {
  let { projectName } = useParams();

  // const formFieldDB = projectName && getProjectFieldDb(projectName);
  const contactSaveFn = async (data: any) => {
    console.log("Contact model saved:", data);
    let mutations = [];
    //Save generated config to be able to open it again
    mutations.push(writeTextFile(
      `projects/${projectName}/configuration/contact-model.json`,
      JSON.stringify(data),
      { baseDir: BaseDirectory.AppLocalData }
    ));

    //Delete existing generated forms
    //This is a simple approach, in the future we might want to be more surgical
    //and only delete forms that are no longer needed
    //For now, we assume that all forms are generated and can be safely deleted
    mutations.push(remove(`projects/${projectName}/forms/contact`, { baseDir: BaseDirectory.AppLocalData, recursive: true }));
    mutations.push(mkdir(`projects/${projectName}/forms/contact`, { baseDir: BaseDirectory.AppLocalData, recursive: true }));

    //Generate forms for each contact type
    for (const ct of data.contact_types) {
      const generatedCreateForm = generateCreateForm(ct);
      const generatedEditForm = generateEditForm(ct);
      console.log(`Generated create form for ${ct.id}:`, generatedCreateForm);
      console.log(`Generated edit form for ${ct.id}:`, generatedEditForm);


      mutations.push(writeTextFile(
        `projects/${projectName}/forms/contact/${ct.label}-create.json`,
        JSON.stringify(generatedCreateForm),
        { baseDir: BaseDirectory.AppLocalData }
      ));
      mutations.push(writeTextFile(
        `projects/${projectName}/forms/contact/${ct.label}-edit.json`,
        JSON.stringify(generatedEditForm),
        { baseDir: BaseDirectory.AppLocalData }
      ));
      //Load and patch base settings
      const base = { contact_types: [] as any[] };
      const patchedBaseSettings = patchBaseSettings(base, data);
      mutations.push(writeTextFile(
        `projects/${projectName}/configuration/base_settings.patched.json`,
        JSON.stringify(patchedBaseSettings),
        { baseDir: BaseDirectory.AppLocalData }
      ));
      const contactFieldRegistry = buildContactFieldRegistry(data);
      mutations.push(writeTextFile(
        `projects/${projectName}/configuration/contact-field-registry.json`,
        JSON.stringify(contactFieldRegistry),
        { baseDir: BaseDirectory.AppLocalData }
      ));
    }
    await Promise.all(mutations).then((files) => {
      console.log(`${files.length} files written successfully:`, files);
      toast.success("Contact model and forms saved successfully");
    }).catch((error) => {
      console.error("Error writing files:", error);
      toast.error("Error saving contact model and/or forms");
    });
  }

  const loadFromFile = () => readTextFile(`projects/${projectName}/configuration/contact-model.json`, { baseDir: BaseDirectory.AppLocalData })
  const feedbackFn = (message: string, error: string) => {
    if (error) {
      toast.error(`Error: ${error}`);
    } else {
      toast.success(message);
    }
  };

  return (
    <>

      <div>
        <Menubar className="">

          <h1>Overview of:  <span className="bold">{projectName}</span></h1>
          <Button className="w-fit" disabled>Play project</Button>
          <Button className="w-fit" disabled>Sync</Button>
          <Button className="w-fit" disabled>New Branch</Button>
        </Menubar>

        <Tabs defaultValue="general" className="w-full mt-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contact-model">Contact Model</TabsTrigger>
            <TabsTrigger value="contact-summary">Contact-Summary</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <LanguageCard />
          </TabsContent>
          <TabsContent value="contact-model">
            <Card className="m-4 p-4">
              <ContactModelEditor saveFn={contactSaveFn} loadFn={loadFromFile} feedbackFn={feedbackFn} />
            </Card>
          </TabsContent>
          <TabsContent value="forms">
            <FormCard updateView={() => { }} />
          </TabsContent>
          <TabsContent value="contact-summary">
            <ContactSummaryEditorCard />
          </TabsContent>
          <TabsContent value="tasks">
            <h1>Tasks</h1>
          </TabsContent>
          <TabsContent value="settings">
            <h1>Settings of:  <span className="bold">{projectName}</span></h1>
            <Card className="m-4">
              <Link to="tasks">
                <h1>connector</h1>
                <img className="size-xs" src={diagram} alt="Diagram" />
              </Link>
            </Card>
          </TabsContent>
        </Tabs>

      </div >
    </>
  );
}

export default Project;