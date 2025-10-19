import { FormEditor } from "@ght/formbuilder";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { isTauri } from "@tauri-apps/api/core";
import { FullForm } from "packages/formbuilder/src/Formbuilder/Zod/zodTypes";
import { toast } from "sonner";
import { addFormField, getProjectFieldDb, removeAllProjectFields } from "@ght/db";

export const FormEditorPage = () => {

    const { projectName, formName } = useParams<{ projectName: string, formName: string }>();

    const [formData, setFormData] = useState<FullForm>({ title: "", body: [] });

    const navigate = useNavigate();

    const cancelFn = () => { navigate(`/projects/${projectName}`); };

    const loadFormData = async () => {
        // Check if running in Tauri
        if (await isTauri()) {
            //   const formData = await window.__TAURI__.invoke('load_form', { formName: 'exampleForm' });
            readTextFile(`projects/${projectName}/forms/app/${formName}`, { baseDir: BaseDirectory.AppLocalData }).then((content) => {
                let parsedData = JSON.parse(content);
                console.log("Loaded form data:", parsedData);
                // parsedData.body = parsedData.body.body;
                if (parsedData.body && Array.isArray(parsedData.body) && parsedData.title) {
                    setFormData(parsedData);
                    console.log("Form data structure is valid.");

                    // toast.success("Form data loaded successfully!");
                } else {
                    console.error("Invalid form data structure.", parsedData);
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


    const saveFormData = async (data: FullForm, projectName: string, logicFormNodes: any[]) => {
        // Save fields to sqlite db here
        const db = projectName && await getProjectFieldDb(projectName || "default");

        if (db) {
            const insertPromises = logicFormNodes.map(node => {
                return addFormField(projectName || "default", {
                    form: formName || "default",
                    name: node.ref || "",
                    label: JSON.stringify(node.labels) || "",
                    type: node.bind?.type || "string",
                    inputType: node.bind?.inputType || "text",
                    operators: JSON.stringify(node.bind?.operators || []),
                    valueEditorType: node.bind?.valueEditorType || "text",
                    values: JSON.stringify(node.bind?.values || []),
                    required: node.bind?.required || false,
                    jsonpath: node.jsonPath.toLowerCase() || "",
                    xformpath: node.xFormPath.toLowerCase() || ""
                });
            });
            removeAllProjectFields(db, formName || "default").then(() => {
                Promise.all(insertPromises);
            }).then(() => {
                console.log("Form fields saved to database.", insertPromises);
            });
        }

        writeTextFile(
            `projects/${projectName}/forms/app/${formName}`,
            JSON.stringify(data),
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

    const [contactModelAttributes, setContactModelAttributes] = useState<any>([]);

    const loadContactModelAttributes = async () => {
        // Load contact model attributes from the server or local storage
        const rawAttributes = await readTextFile(`projects/${projectName}/configuration/contact-model.json`, { baseDir: BaseDirectory.AppLocalData });
        const parsedAttributes = JSON.parse(rawAttributes);
        const attributes = parsedAttributes.contact_types.flatMap((ct: any) => ct.attributes);
        setContactModelAttributes(attributes);
    };

    useEffect(() => {
        loadFormData();
        loadContactModelAttributes();
    }, []);

    // console.log("Form data in FormEditorPage:", formData);
    // console.log("Contact Model Attributessss:", contactModelAttributes);
    return (
        <>
            {formData && formData.body && Array.isArray(formData.body) ? (
                <div>
                    <h1>Form Builderrr</h1>
                    <FormEditor cancelFn={cancelFn} onSave={saveFormData} formInput={formData} contactModelAttributes={contactModelAttributes} />
                </div>
            ) : (
                <div>Loading your file....</div>
            )}
        </>
    );
}