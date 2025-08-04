import { Link } from "react-router";
import "./App.css";
import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";
import { useState } from "react";
import { appLocalDataDir } from '@tauri-apps/api/path';

function App() {
  const [result, setResult] = useState<string>("");

  const appDataDirPath = appLocalDataDir();
  appDataDirPath.then((path) => {
    console.log("App Data Directory:", path);
  }).catch((error) => {
    console.error("Error getting App Data Directory:", error);
  });

  const resultPromise = writeTextFile("test.txt", "Hello, world!", { baseDir: BaseDirectory.AppLocalData });
  resultPromise.then(() => {
    console.log("File written successfully" + result);
    //TODO: Give visual feedback
    setResult(resultPromise.toString());
  }).catch((error) => {
    console.error("Error writing file:", error);
    //TODO: Give visual feedback
    setResult(error.toString());
  });

  return <><Link to="/projects">Projects</Link>

  </>;

}

export default App;
