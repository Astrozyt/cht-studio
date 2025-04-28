import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useNavigation, useParams } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card";
import diagram from "../../assets/simple-bpmn-diagram-8354.webp";
import { Menubar } from "@/components/ui/menubar";
import File from "../../components/functional/File";
import NewFormDialog from "./components/NewFormDialog";
import FormCard from "./components/FormCard";

enum fileTypes {
  xml = "xml",
  json = "json",
  csv = "csv",
  xlsx = "xlsx",
  folder = "folder",
}



const Project = () => {

  let { projectName } = useParams();
  let navigate = useNavigate();

  return (
    <>
      <div>
        <Menubar className="">

          <h1>Overview of:  <span className="bold">{projectName}</span></h1>
          <Button className="w-fit">Play project</Button>
          <Button className="w-fit">Sync</Button>
          <Button className="w-fit">New Branch</Button>
        </Menubar>

        <FormCard updateView={() => { }} />

        <Card className="m-4">
          <Link to="tasks">
            <h1>connector</h1>
            <img className="size-xs" src={diagram} alt="Diagram" />
          </Link>
        </Card>
        {/* <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="connector">Connector</TabsTrigger>
          </TabsList>
          <TabsContent value="overview"><XmlOverview/></TabsContent>
          <TabsContent value="forms"><XmlEditor /></TabsContent>
          <TabsContent value="connector"><XmlEmulator /></TabsContent>

        </Tabs> */}
        {/* {files.map((file, index) => <p key={index}>{file}</p>)} */}
      </div >
    </>
  );
}

export default Project;