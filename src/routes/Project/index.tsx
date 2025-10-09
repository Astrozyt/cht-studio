import { Menubar } from "@/components/ui/menubar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { getProjectFieldDb } from "@ght/db";
import { Link, useParams } from "react-router";
import diagram from "../../assets/simple-bpmn-diagram-8354.webp";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import ContactSummaryEditorCard from "./components/ContactSummaryEditorCard";
import FormCard from "./components/FormCard";
import LanguageCard from "./components/LanguageCard";
import { ContactModelEditor } from "@ght/contactmodeleditor";

const Project = () => {
  let { projectName } = useParams();

  // const formFieldDB = projectName && getProjectFieldDb(projectName);

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
              <ContactModelEditor />
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