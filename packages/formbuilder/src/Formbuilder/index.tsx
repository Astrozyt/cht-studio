import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
// import { NodeFormValues } from "./types";
import { TrashIcon } from "lucide-react";
import { useReducer, useState } from "react";
import { Action, formReducer } from "./helpers/formState";
import { nanoid } from 'nanoid'
import { InsertNodeButton } from "./components/InsertNodeButton";
import { FullForm, NodeFormValues, NodeType } from "./Zod/zodTypes";
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
import { addUidsToNodes } from "./helpers";

// Add Tauri to the global scope
declare global {
    interface Window {
        __TAURI__?: {
            invoke: (command: string, args?: Record<string, any>) => Promise<any>;
        };
    }
}


export const FormEditor = ({ formInput, onSave }: { formInput: FullForm, onSave: (data: NodeFormValues[]) => Promise<void> }) => {
    // console.log("FormEditor initialized with model:", formInput);
    // if (!formInput) {
    //     console.error("Form input is null or undefined");
    //     const formInput = { title: "New Form", body: [] } as FullForm; // Default value if formInput is null
    // }
    // const formModel = addUidsToNodes(formInput || { title: "New Form", body: [] } as FullForm); // Ensure all nodes have uids
    const [formDataRed, dispatch] = useReducer(formReducer, formInput.body || []);

    const rootRef = formDataRed.length > 0 ? formDataRed[0].ref.split('/')[1] + '/' : 'root'; // Default root reference

    // const onSave = (data: NodeFormValues[]) => {
    //     console.log("Saved data:", data);
    //     // Check if running in Tauri
    //     if (formDataRed.length > 0) {
    //         if (window.__TAURI__) {
    //             window.__TAURI__.invoke('save_form', { formData: data });
    //         } else {
    //             console.log("Not running in Tauri, saving to browser.");
    //         }
    //     }
    // }

    const onCancel = () => {
        console.log("Cancelled editing.");
        // TODO: Reset the form or navigate away
        // This could be a state reset or a navigation action
    };

    console.log("FormRed data after reducer:", formDataRed);

    return (
        <div>
            <ul className=" border-2 rounded p-2">
                <h2>Form Editor ({formInput.title})</h2>
                <RenderChildren children={formDataRed} parentUid={'root'} parentRef={rootRef} level={0} dispatch={dispatch} />
                <div className="w-full flex justify-items-center">
                    <Button variant="outline" className="bg-green-300 hover:bg-green-400" disabled={formDataRed.length === 0} onClick={() => { onSave(formDataRed); }}>
                        Save
                    </Button>
                    <Button onClick={onCancel} variant="default" className="bg-red-300 hover:bg-red-400">
                        Cancel
                    </Button>
                </div>
            </ul>
        </div>
    );
}

const RenderChildren = ({ children, parentUid, level, dispatch, parentRef }: { children: NodeFormValues[], parentRef: string, parentUid: string | null, level: number, dispatch: React.Dispatch<Action> }) => {
    // const lastPostion = children.length;
    return children.flatMap((child, index) => [
        // InsertNodeButton({ dispatch, parentUid, index, level }),
        <InsertNodeButton key={`insert-${parentUid}-${index}`} dispatch={dispatch} parentUid={parentUid} parentRef={parentRef} index={index} level={level} />,

        <RenderNode key={`node-${parentUid}-${index}`} node={child} index={index} level={level} dispatch={dispatch} />,
    ]).concat(<InsertNodeButton key={`insert2-${parentUid}-${children.length}`} dispatch={dispatch} parentUid={parentUid} parentRef={parentRef} index={children.length} level={level} />); // final + button
};



const RenderNode = ({ node, index, level, dispatch }: { node: NodeFormValues, index: number, level: number, dispatch: React.Dispatch<Action> }) => {

    return (

        <Card key={index} className={`border-2 p-2 m-2 pr-0 mr-0`} style={{ marginLeft: `${level * 0.4}rem` }}>
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
                    <UpdateNodeButton existingNode={node} dispatch={dispatch} />
                </span>
                <RenderDeleteButton onDelete={() => {
                    // console.log("Delete node", node.uid);
                    dispatch({ type: 'DELETE_NODE', uid: node.uid || '' });
                }} />
            </CardContent>

            {node.tag === "group" && (
                <ul className="border-l-2 border-gray-300 pl-0 mt-2 space-y-2">
                    {(!node.children || node.children.length === 0) && (
                        <li>No children</li>
                    )}
                    {<RenderChildren children={node.children ?? []} parentRef={node.ref} parentUid={node.uid!} level={level + 1} dispatch={dispatch} />}
                </ul>
            )}
        </Card>

    );
}

