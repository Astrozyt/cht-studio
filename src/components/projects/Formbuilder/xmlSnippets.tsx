import FormEditor from "@/components/projects/Formbuilder";
// import FormBuilder from "../../FormBuilder";


const XmlOverview = () => {
  //Get projectName from URL
  // const { projectName } = useParams();

  //TODO: Load XMLs from the project's xml folder
  return (
    <div>
      <h1>XML Overview</h1>


    </div>
  );
}

const XmlEmulator = () => {

  //TODO: Parse file
  //Open Emulator in new window
  return (
    <div>
      <h1>XML Emulator</h1>
      <p>
        The XML Emulator allows you to test and validate your XML files. You can upload an XML file, and the emulator will parse it and display its structure.
      </p>
    </div>
  );
}

const XmlEditor = () => {

  // const editor = new FormeoEditor();

  //TODO: Display file in Formeditor, make saveable.

  return (
    <>
      <FormEditor />
      <h1>XML Editor</h1>
    </>
  );
}

const XmlConnector = () => {
  return (
    <div>
      <h1>XML Connector</h1>
      <p>
        The XML Connector allows you to connect to external XML data sources and import or export XML data.
      </p>
    </div>
  );
}

export { XmlOverview, XmlEmulator, XmlEditor, XmlConnector };