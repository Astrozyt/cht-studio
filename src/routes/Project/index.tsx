import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useNavigation, useParams } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card";
import diagram from "../../assets/simple-bpmn-diagram-8354.webp";
import { Menubar } from "@/components/ui/menubar";
import File from "../../components/functional/File";

enum fileTypes {
  xml = "xml",
  json = "json",
  csv = "csv",
  xlsx = "xlsx",
  folder = "folder",
}



const Project = () => {

  let { projectName } = useParams();
  const [files, setFiles] = useState<string[]>([]);
  let navigate = useNavigate();

  // const [fileNames, setFileNames] = useState<string[]>([]);

  const readForms = async (path: string) => {
    console.log("Filesread started!");
    const files: string[] = await invoke(`list_xml_files`, { path });
    console.log("Files: ", files);
    const formFileNames = files.map((fileName) => fileName.split("/").pop());
    //Remove undefined values
    const filteredFormFileNames = formFileNames.filter((name) => name !== undefined);
    setFiles(filteredFormFileNames);
    return files;
  }

  useEffect(() => {
    readForms(`./projects/${projectName}/forms`);
  }, []);

  return (
    <>
      <div>
        <Menubar className="">

          <h1>Overview of:  <span className="bold">{projectName}</span></h1>
          <Button className="w-fit">Play project</Button>
          <Button className="w-fit">Sync</Button>
          <Button className="w-fit">New Branch</Button>
        </Menubar>

        <Card className="m-4">
          <CardHeader>
            <h1>Forms</h1>
            <Button className="w-fit">New Form</Button>
            <Button onClick={() => readForms(`./projects/${projectName}/forms`)} className="w-fit">Refresh</Button>

          </CardHeader>
          <CardContent>
            <ul>
              {/*TODO: Add state to these Links! */}
              {/* <li>Form 1<Link to="forms/form1">Open this form</Link></li>
              <li>Form 2<Link to="forms/form2">Open this form</Link></li> */}
              <File name="Form 3" isFolder={false} />
            </ul>
            {files.map((form, index) => (
              <div key={index}>

                <p>{form}</p>
              </div>
            ))}
          </CardContent>
          <CardFooter>

          </CardFooter>
        </Card>

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
        {files.map((file, index) => <p key={index}>{file}</p>)}
      </div >
    </>
  );
}

export default Project;