import { Link } from "react-router";
import "./App.css";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

// import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";
// import { useState } from "react";
import { appLocalDataDir } from '@tauri-apps/api/path';
import { Button } from "./components/ui/button";

function App() {
  // const [result, setResult] = useState<string>("");

  const appDataDirPath = appLocalDataDir();
  appDataDirPath.then((path) => {
    console.log("App Data Directory:", path);
  }).catch((error) => {
    console.error("Error getting App Data Directory:", error);
  });

  // const resultPromise = writeTextFile("test.txt", "Hello, world!", { baseDir: BaseDirectory.AppLocalData });
  // resultPromise.then(() => {
  //   console.log("File written successfully" + result);
  //   //TODO: Give visual feedback
  //   setResult(resultPromise.toString());
  // }).catch((error) => {
  //   console.error("Error writing file:", error);
  //   //TODO: Give visual feedback
  //   setResult(error.toString());
  // });

  const exampleXformXml = `<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa">
  <h:head>
    <h:title>Example Form</h:title>
    <model>
      <itext>
        <translation lang="de" default="true()">
          <text id="hint:brands">
            <value>
            </value>
          </text>
          <text id="hint:number_of_cigarettes">
            <value>
            </value>
          </text>
          <text id="hint:person_registration">
            <value>Dies sind Angaben zum Patienten</value>
          </text>
          <text id="hint:person_registration:birthdate">
            <value>
            </value>
          </text>
          <text id="hint:person_registration:name">
            <value>Format: &lt;Vorname&gt; &lt;Nachname&gt;</value>
          </text>
          <text id="hint:person_registration:smokestatus">
            <value>Min 5 Zigaretten pro Woche.</value>
          </text>
          <text id="item:brands:brand a">
            <value>Aa</value>
          </text>
          <text id="item:brands:brand b">
            <value>Bb</value>
          </text>
          <text id="item:brands:brand c">
            <value>Cc</value>
          </text>
          <text id="item:person_registration:smokestatus:no">
            <value>Nein</value>
          </text>
          <text id="item:person_registration:smokestatus:yes">
            <value>Ja</value>
          </text>
          <text id="lbl:brands">
            <value>Welche Marken raucht der Patient?</value>
          </text>
          <text id="lbl:number_of_cigarettes">
            <value>Wie viele Zigaretten racht der Patient?</value>
          </text>
          <text id="lbl:person_registration">
            <value>Angaben zur Person</value>
          </text>
          <text id="lbl:person_registration:birthdate">
            <value>Geburtsdatum</value>
          </text>
          <text id="lbl:person_registration:name">
            <value>Vor- und Nachname des Patienten</value>
          </text>
          <text id="lbl:person_registration:smokestatus">
            <value>Ist der Patient Raucher?</value>
          </text>
        </translation>
        <translation lang="en">
          <text id="hint:brands">
            <value>
            </value>
          </text>
          <text id="hint:number_of_cigarettes">
            <value>
            </value>
          </text>
          <text id="hint:person_registration">
            <value>These are basic informations on the patient</value>
          </text>
          <text id="hint:person_registration:birthdate">
            <value>
            </value>
          </text>
          <text id="hint:person_registration:name">
            <value>Format: &lt;Given name&gt; &lt;Familly Name&gt;</value>
          </text>
          <text id="hint:person_registration:smokestatus">
            <value>Min. 5 cigarettes per week.</value>
          </text>
          <text id="item:brands:brand a">
            <value>Aa</value>
          </text>
          <text id="item:brands:brand b">
            <value>Bb</value>
          </text>
          <text id="item:brands:brand c">
            <value>Cc</value>
          </text>
          <text id="item:person_registration:smokestatus:no">
            <value>No</value>
          </text>
          <text id="item:person_registration:smokestatus:yes">
            <value>Yes</value>
          </text>
          <text id="lbl:brands">
            <value>What brands does teh patient smoke?</value>
          </text>
          <text id="lbl:number_of_cigarettes">
            <value>How many cigarettes does the patient smoke?</value>
          </text>
          <text id="lbl:person_registration">
            <value>Personal Information</value>
          </text>
          <text id="lbl:person_registration:birthdate">
            <value>Date of birth</value>
          </text>
          <text id="lbl:person_registration:name">
            <value>Given and Family Name of Person</value>
          </text>
          <text id="lbl:person_registration:smokestatus">
            <value>Does the patient currently smoke?</value>
          </text>
        </translation>
      </itext>
      <instance>
        <data id="example_form" version="1">
          <person_registration>
            <name>
            </name>
            <birthdate>
            </birthdate>
            <smokestatus>
            </smokestatus>
          </person_registration>
          <number_of_cigarettes>
          </number_of_cigarettes>
          <brands>
          </brands>
        </data>
      </instance>
      <bind nodeset="/data/person_registration/name" type="string" required="true()"/>
      <bind nodeset="/data/person_registration/birthdate" type="date" required="true()"/>
      <bind nodeset="/data/person_registration/smokestatus" type="select1" required="true()"/>
      <bind nodeset="/data/number_of_cigarettes" type="int" required="true()" relevant="/data/person_registration/smokestatus = &apos;yes&apos;"/>
      <bind nodeset="/data/brands" type="select" relevant="/data/person_registration/smokestatus = &apos;yes&apos;"/>
    </model>
  </h:head>
  <h:body>
    <group ref="/data/person_registration">
      <label ref="jr:itext(&apos;lbl:person_registration&apos;)">
      </label>
      <hint ref="jr:itext(&apos;hint:person_registration&apos;)">
      </hint>
      <input ref="/data/person_registration/name">
        <label ref="jr:itext(&apos;lbl:person_registration:name&apos;)">
        </label>
        <hint ref="jr:itext(&apos;hint:person_registration:name&apos;)">
        </hint>
      </input>
      <input ref="/data/person_registration/birthdate">
        <label ref="jr:itext(&apos;lbl:person_registration:birthdate&apos;)">
        </label>
        <hint ref="jr:itext(&apos;hint:person_registration:birthdate&apos;)">
        </hint>
      </input>
      <select1 ref="/data/person_registration/smokestatus" appearance="minimal">
        <label ref="jr:itext(&apos;lbl:person_registration:smokestatus&apos;)">
        </label>
        <hint ref="jr:itext(&apos;hint:person_registration:smokestatus&apos;)">
        </hint>
        <item>
          <label ref="jr:itext(&apos;item:person_registration:smokestatus:yes&apos;)">
          </label>
          <value>yes</value>
        </item>
        <item>
          <label ref="jr:itext(&apos;item:person_registration:smokestatus:no&apos;)">
          </label>
          <value>no</value>
        </item>
      </select1>
    </group>
    <input ref="/data/number_of_cigarettes">
      <label ref="jr:itext(&apos;lbl:number_of_cigarettes&apos;)">
      </label>
      <hint ref="jr:itext(&apos;hint:number_of_cigarettes&apos;)">
      </hint>
    </input>
    <select ref="/data/brands" appearance="quick">
      <label ref="jr:itext(&apos;lbl:brands&apos;)">
      </label>
      <hint ref="jr:itext(&apos;hint:brands&apos;)">
      </hint>
      <item>
        <label ref="jr:itext(&apos;item:brands:brand a&apos;)">
        </label>
        <value>brand a</value>
      </item>
      <item>
        <label ref="jr:itext(&apos;item:brands:brand b&apos;)">
        </label>
        <value>brand b</value>
      </item>
      <item>
        <label ref="jr:itext(&apos;item:brands:brand c&apos;)">
        </label>
        <value>brand c</value>
      </item>
    </select>
  </h:body>
</h:html>
`;

  const RUNNER_WINDOW_LABEL = "runner";

  const onOpenRunner = () => {

    const runnerUrl = import.meta.env.DEV
      ? `${location.origin}/runner/index.html`
      : "app://localhost/runner/index.html";
    const runnerWindow = new WebviewWindow(RUNNER_WINDOW_LABEL, { url: runnerUrl, width: 1100, height: 800, title: "XForm Runner" });
    runnerWindow.once("tauri://created", () => {
      console.log("Runner window created");
    });

    runnerWindow.once("tauri://error", (e) => {
      console.error("Runner window failed to create", e);
    });

    const unlisten = runnerWindow.listen("runner:ready", () => {
      console.log("Runner window is ready");
      unlisten.then((f) => f());
      runnerWindow.emit("runner:load-xform", { id: "1234", mode: "preview", xformXml: exampleXformXml });
    });
  }

  return <>
    <Link to="/projects">Projects</Link>
    <Button onClick={onOpenRunner}>Open Runner</Button>
  </>;

}

export default App;
