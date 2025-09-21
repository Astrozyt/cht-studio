import { Link } from "react-router";
import "./App.css";
// import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

// import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";
// import { useState } from "react";
import { appLocalDataDir } from '@tauri-apps/api/path';
// import { Button } from "./components/ui/button";

function App() {
  // const [result, setResult] = useState<string>("");

  const appDataDirPath = appLocalDataDir();
  appDataDirPath.then((path) => {
    console.log("App Data Directory:", path);
  }).catch((error) => {
    console.error("Error getting App Data Directory:", error);
  });



  return <>
    <Link to="/projects">Projects</Link>
    {/* <Button onClick={onOpenRunner}>Open Runner</Button> */}
  </>;

}

export default App;
