import { FormEditor } from "@ght/formbuilder";
import { BaseDirectory, readFile, readTextFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { isTauri } from "@tauri-apps/api/core";
import { FullForm } from "packages/formbuilder/src/Formbuilder/Zod/zodTypes";

export const FormEditorPage = () => {



    const { projectName, formName } = useParams<{ projectName: string, formName: string }>();

    const [formData, setFormData] = useState<FullForm>({ title: "", body: [] });

    {/* TODO: Load the form data from disk here (tauri-fs) */ }
    const loadFormData = async () => {
        // Check if running in Tauri
        if (await isTauri()) {
            //   const formData = await window.__TAURI__.invoke('load_form', { formName: 'exampleForm' });
            readTextFile(`projects/${projectName}/forms/${formName}`, { baseDir: BaseDirectory.AppLocalData }).then((content) => {
                const parsedData = JSON.parse(content);
                console.log("Loaded form data:", parsedData);
                if (parsedData.body && Array.isArray(parsedData.body) && parsedData.title) {
                    setFormData(parsedData);
                } else {
                    console.error("Invalid form data structure.");
                    setFormData({ title: "New Form", body: [] }); // Default value if structure is invalid
                }

            }).catch((error) => {
                //TODO: Implement proper error handling
                console.error("Error loading form data:", error);
            })

        } else {
            console.log("Not running in Tauri, loading from local storage or default.");
            return []; // Return an empty array or default data
        }
    };


    {/* TODO: Add a save to disk function, which is passed to the formeditor */ }
    const saveFormData = async (data: any) => {
        console.log("Saving form data:", data);
        //TODO: Redirect to Forms overview
    };


    useEffect(() => {
        loadFormData();
    }, []);

    return (
        <div>
            <h1>Form Builderrr</h1>
            <FormEditor onSave={saveFormData} formInput={formData} />
            {/* <FormEditor /> */}
        </div>
    );
}