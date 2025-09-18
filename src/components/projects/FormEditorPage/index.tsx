import { FormEditor } from "@ght/formbuilder";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { isTauri } from "@tauri-apps/api/core";
import { FullForm } from "packages/formbuilder/src/Formbuilder/Zod/zodTypes";
import { toast } from "sonner";

export const FormEditorPage = () => {

    const { projectName, formName } = useParams<{ projectName: string, formName: string }>();

    const [formData, setFormData] = useState<FullForm>({ title: "", body: [] });

    const navigate = useNavigate();

    const cancelFn = () => { navigate(`/projects/${projectName}`); };

    const loadFormData = async () => {
        // Check if running in Tauri
        if (await isTauri()) {
            //   const formData = await window.__TAURI__.invoke('load_form', { formName: 'exampleForm' });
            readTextFile(`projects/${projectName}/forms/${formName}`, { baseDir: BaseDirectory.AppLocalData }).then((content) => {
                const parsedData = JSON.parse(content);
                // console.log("Loaded form data:", parsedData);
                if (parsedData.body && Array.isArray(parsedData.body) && parsedData.title) {
                    setFormData(parsedData);
                    console.log("Form data structure is valid.");

                    // toast.success("Form data loaded successfully!");
                } else {
                    console.error("Invalid form data structure.");
                    toast.error("Invalid form data structure. Please check the file.");
                    setFormData({ title: "New Form", body: [] }); // Default value if structure is invalid
                }

            }).catch((error) => {
                console.error("Error loading form data:", error);
                toast.error("Failed to load form data. Please try again.");
            })

        } else {
            console.log("Not running in Tauri, loading from local storage or default.");
            return []; // Return an empty array or default data
        }
    };


    const saveFormData = async (data: any) => {
        console.log("Saving form data:", JSON.stringify({ title: formName, body: data }));
        writeTextFile(
            `projects/${projectName}/forms/${formName}`,
            JSON.stringify({ title: formName, body: data }),
            { baseDir: BaseDirectory.AppLocalData }
        ).then(() => {
            console.log("Form data saved successfully.");
            toast.success("Form data saved successfully!");
            navigate(`/projects/${projectName}`); // Navigate back to the forms list

        }).catch((error) => {
            console.error("Error saving form data:", error);
            toast.error("Failed to save form data. Please try again.");
        });
    };


    useEffect(() => {
        loadFormData();
    }, []);

    console.log("Form data in FormEditorPage:", formData);
    return (
        <>
            {formData && formData.body && Array.isArray(formData.body) && formData.body.length > 0 ? (
                <div>
                    <h1>Form Builderrr</h1>
                    <FormEditor cancelFn={cancelFn} onSave={saveFormData} formInput={formData} />
                </div>
            ) : (
                <div>Loading your file....</div>
            )}
        </>
    );
}