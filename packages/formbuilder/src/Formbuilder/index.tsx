import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import { useEffect, useReducer, useState } from "react";
import { Action, formReducer } from "./helpers/formState";
import { InsertNodeButton } from "./components/InsertNodeButton";
import { FullForm, NodeFormValues } from "./Zod/zodTypes";
import { RenderRequired } from "./Formfields/RenderRequired";
import { RenderLabels } from "./Formfields/RenderLabels";
import { RenderRef } from "./Formfields/RenderRef";
import { RenderType } from "./Formfields/RenderType";
import { RenderAppearance } from "./Formfields/RenderAppearance";
import { RenderRelevant } from "./Formfields/RenderRelevant";
import { RenderTypeSelect } from "./Formfields/RenderTypeSelect";
import { RenderItems } from "./Formfields/RenderItems";
import { RenderHints } from "./Formfields/RenderHints";
import { RenderConstraint, RenderConstraintMessage } from "./Formfields/RenderConstraint";
import { RenderReadonly } from "./Formfields/RenderReadonly";
import { RenderCalculate } from "./Formfields/RenderCalculate";
import { RenderPreload, RenderPreloadParams } from "./Formfields/RenderPreload";
import { RenderDeleteButton } from "./Formfields/RenderDeleteButton";
import { UpdateNodeButton } from "./components/UpdateNodeButton";
import { Toaster } from "sonner";
import { addUidsToNodes } from "./helpers";
import { useFormStore } from "@ght/stores";
import { LanguagesBox } from "./components/LanguagesBox";
import { use } from "chai";


// Add Tauri to the global scope
declare global {
    interface Window {
        __TAURI__?: {
            invoke: (command: string, args?: Record<string, any>) => Promise<any>;
        };
    }
}


export const FormEditor = ({ formInput, onSave, cancelFn }: { formInput: FullForm, onSave: (data: FullForm) => Promise<void>, cancelFn: () => void }) => {
    if (!formInput || !formInput.body || !Array.isArray(formInput.body)) {
        console.error("Invalid form input structure:", formInput);
        return <div>Error: Invalid form input structure.</div>;
    }
    const [formDataRed, dispatch] = useReducer(formReducer, []/*formModel.body*/);
    const [existingFormFields, setExistingFormFields] = useState<NodeFormValues[]>([]); // Initialize formFields state
    const formLanguages = useFormStore(state => state.languages);
    const initLanguages = useFormStore(state => state.initLanguages);
    const removeLang = useFormStore(state => state.removeLanguage);

    useEffect(() => {
        dispatch({ type: 'INIT_STATE', nodes: addUidsToNodes(formInput).body });
        initLanguages(formInput.languages || []);
    }, []);

    console.log('formDataRed:', formDataRed);

    useEffect(() => {
        const fields = formDataRed.filter((node) => {
            return ["input", "select", "select1"].includes(node.tag) && node.bind?.type !== 'none';
        });
        //Set initial languages to formLanguages
        initLanguages(formInput.languages || []);
    }, []);

    useEffect(() => {
        const fields = formDataRed.filter((node) => {
            return ["input", "select", "select1"].includes(node.tag) && node.bind?.type !== 'none';
        });
        setExistingFormFields(fields);
    }, [formDataRed]);

    const rootRef = 'root'; // Default root reference


    const onCancel = () => {
        console.log("Cancelled editing.");
        cancelFn(); // Call the provided cancel function
    };


    return (
        <div>
            <Card className="flex">
                <h2>Form Editor ({formInput.title})</h2>
                <LanguagesBox />
            </Card>
            <ul className=" border-2 rounded p-2">
                <RenderChildren existingFormFields={existingFormFields} children={formDataRed} parentUid={'root'} parentRef={rootRef} level={0} dispatch={dispatch} />
                <div className="w-full flex justify-items-center">
                    <Button variant="outline" data-cy="save-button" className="bg-green-300 hover:bg-green-400" disabled={formDataRed.length === 0} onClick={() => { onSave({ title: formInput.title, root: formInput.root || 'root', body: formDataRed }); }}>
                        Save
                    </Button>
                    <Button onClick={() => { onCancel(); }} data-cy="cancel-button" variant="default" className="bg-red-300 hover:bg-red-400">
                        Cancel
                    </Button>
                </div>
            </ul>
            <Toaster />
        </div>
    );
}

const RenderChildren = ({ children, parentUid, level, dispatch, parentRef, existingFormFields }: { existingFormFields: NodeFormValues[], children: NodeFormValues[], parentRef: string, parentUid: string | null, level: number, dispatch: React.Dispatch<Action> }) => {
    return children.flatMap((child, index) => [
        <InsertNodeButton existingNodes={existingFormFields} key={`insert-${parentUid}-${index}`} dispatch={dispatch} parentUid={parentUid} parentRef={parentRef} index={index} level={level} />,

        <RenderNode key={`node-${parentUid}-${index}`} node={child} index={index} level={level} dispatch={dispatch} existingFormFields={existingFormFields} />,
    ]).concat(<InsertNodeButton existingNodes={existingFormFields} key={`insert2-${parentUid}-${children.length}`} dispatch={dispatch} parentUid={parentUid} parentRef={parentRef} index={children.length} level={level} />); // final + button
};



const RenderNode = ({ node, index, level, dispatch, existingFormFields }: { node: NodeFormValues, index: number, level: number, dispatch: React.Dispatch<Action>, existingFormFields: NodeFormValues[] }) => {
    if (["input", "select", "select1"].includes(node.tag)) {
        console.log("Field to be listed: ", node.ref, node.tag, node.bind?.type);
    }
    console.log("Rendering node:", node, "at level:", level, "with index:", index);
    return (

        <Card key={index} data-cy={`formnode-${index}.${node.ref}`} className={`border-2 p-2 m-2 pr-0 mr-0`} style={{ marginLeft: `${level * 0.4}rem` }}>
            <CardContent className="px-2 flex justify-end w-full space-x-4">
                {<RenderType type={node.tag} />}
                {<RenderRef nodeRef={node.ref} onSave={(newValue) => { dispatch({ type: "UPDATE_NODE", uid: node.uid, changes: { ref: newValue } }) }} />}

                {node.tag === "group" && (
                    <>
                        <RenderLabels labels={node.labels} />
                        <RenderHints hints={node.hints} />
                        <RenderRelevant relevant={node.bind?.relevant || "N/A"} />
                    </>
                )}

                {node.tag === 'input' && (<>
                    {<RenderAppearance appearance={node.appearance} />}
                    {<RenderLabels labels={node.labels} />}
                    {<RenderRequired required={node.bind.required || false} />}
                    {<RenderRelevant relevant={node.bind.relevant || "N/A"} />}
                    {<RenderTypeSelect type={node.bind.type || 'none'} />}
                    {<RenderConstraint constraint={node.bind.constraint || "N/A"} />}
                    {<RenderConstraintMessage constraintMsg={node.bind.constraintMsg || "N/A"} />}
                    {<RenderReadonly readonly={node.bind.readonly || "N/A"} />}
                    {<RenderCalculate calculate={(node.bind.calculate || "N/A")} />}
                    {<RenderPreload preload={node.bind.preload || "N/A"} />}
                    {<RenderPreloadParams preloadParams={node.bind.preloadParams || "N/A"} />}
                </>)}

                {["select", "select1"].includes(node.tag) && (
                    <>
                        {<RenderLabels labels={node.labels} />}
                        {<RenderItems items={node.items} />}
                        {<RenderRelevant relevant={node.bind.relevant || "N/A"} />}
                    </>
                )}
                {node.tag === "note" && (
                    <>
                        {<RenderLabels labels={node.labels} />}
                        {<RenderHints hints={node.hints} />}
                    </>
                )}

                {/* TODO: Add the other types, like trigger, image, ... */}
                <span className="">
                    <UpdateNodeButton existingNode={node} dispatch={dispatch} existingNodes={existingFormFields} />
                </span>
                <RenderDeleteButton onDelete={() => {
                    console.log('DELETE: ', node.uid);
                    dispatch({ type: 'DELETE_NODE', uid: node.uid || '' });
                }} />
            </CardContent>

            {node.tag === "group" && (
                <ul className="border-l-2 border-gray-300 pl-0 mt-2 space-y-2">
                    {(!node.children || node.children.length === 0) && (
                        <li>No children</li>
                    )}
                    {<RenderChildren existingFormFields={existingFormFields} children={node.children ?? []} parentRef={node.ref} parentUid={node.uid!} level={level + 1} dispatch={dispatch} />}
                </ul>
            )}
        </Card>

    );
}

