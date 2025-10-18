import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import { useEffect, useMemo, useReducer } from "react";
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
import { Toaster } from "sonner";
import { addUidsToNodes } from "./helpers";
import { Node, useExistingContactFieldStore, useExistingNodesStore, useFormStore } from "@ght/stores";
import { useParams } from "react-router";
import { getLanguages } from "@ght/db";
import { cmAttrsToQBFields } from "./components/Logicbuilder/src/extractContactModelFields";

// Add Tauri type to the global scope
declare global {
    interface Window {
        __TAURI__?: {
            invoke: (command: string, args?: Record<string, any>) => Promise<any>;
        };
    }
}

const initFromForm = (formInput: FullForm) => addUidsToNodes(formInput).body;


export const FormEditor = ({ formInput, onSave, cancelFn, contactModelAttributes }: { contactModelAttributes: any, formInput: FullForm, onSave: (data: FullForm, projectName: string, logicFormNodes: Node[]) => Promise<void>, cancelFn: () => void }) => {
    if (!formInput || !formInput.body || !Array.isArray(formInput.body)) {
        console.error("Invalid form input structure:", formInput);
        return <div>Error: Invalid form input structure.</div>;
    }
    const [formDataRed, dispatch] = useReducer(formReducer, formInput, initFromForm);
    console.log("Input: ", formInput, "vs state:", formDataRed);
    const { projectName } = useParams<{ projectName: string }>();
    const initLanguages = useFormStore(state => state.initLanguages);
    const setExistingNodes = useExistingNodesStore(state => state.setExistingNodes);
    const setExistingContactFields = useExistingContactFieldStore(state => state.setExistingContactFields);

    // const storeLanguages = useLanguageStore(state => state.languages);
    useEffect(() => {
        getLanguages(projectName || "default").then((langs) => {
            initLanguages(langs);
        }).catch((err) => {
            console.error("Failed to fetch languages:", err);
            initLanguages([]); // Fallback to empty array on error
        });
    }, [projectName, initLanguages]);

    // Reinitialize reducer state when formInput changes so state stays in sync
    useEffect(() => {
        dispatch({ type: 'INIT_STATE', nodes: initFromForm(formInput) });
    }, [formInput]);

    const filtered = useMemo(() => {
        const result: NodeFormValues[] = [];
        const visit = (nodes: NodeFormValues[]) => {
            for (const n of nodes) {
                if (["input", "select", "select1"].includes(n.tag) && n.bind?.type !== "none") {
                    result.push(n);
                }
                if (n.tag === "group" && Array.isArray(n.children) && n.children.length) {
                    visit(n.children);
                }
            }
        };
        visit(formDataRed);
        return result;
    }, [formDataRed]);

    useEffect(() => {
        setExistingNodes(filtered);
    }, [filtered, setExistingNodes]);

    useEffect(() => {
        const qbFields = cmAttrsToQBFields(contactModelAttributes, "default");
        setExistingContactFields(qbFields);
    }, [contactModelAttributes, setExistingContactFields]);

    const rootRef = 'root'; // Default root reference

    const onCancel = () => {
        console.log("Cancelled editing.");
        cancelFn(); // Call the provided cancel function
    };

    console.log("Filtered nodes for existing fields:", filtered);
    console.log("Form data in FormEditor:", formDataRed);
    return (
        <div>
            <Card className="flex">
                <h2>Form Editor ({formInput.title.replace(".json", "")})</h2>
            </Card>
            <ul className=" border-2 rounded p-2">
                <RenderChildren children={formDataRed} parentUid={'root'} parentRef={rootRef} level={0} dispatch={dispatch} />
                <div className="w-full flex justify-items-center">
                    <Button variant="outline" data-cy="save-button" className="bg-green-300 hover:bg-green-400" disabled={formDataRed.length === 0} onClick={() => { onSave({ title: formInput.title, root: formInput.root || 'root', body: formDataRed }, projectName || "default", filtered); }}>
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

const RenderChildren = ({ children, parentUid, level, dispatch, parentRef }: { children: NodeFormValues[], parentRef: string, parentUid: string | null, level: number, dispatch: React.Dispatch<Action> }) => {
    return children.flatMap((child, index) => [
        <InsertNodeButton key={`insert-${parentUid}-${index}`} dispatch={dispatch} parentUid={parentUid} parentRef={parentRef} index={index} level={level} />,

        <RenderNode key={`node-${parentUid}-${index}`} node={child} index={index} level={level} dispatch={dispatch} />,
    ]).concat(<InsertNodeButton key={`insert2-${parentUid}-${children.length}`} dispatch={dispatch} parentUid={parentUid} parentRef={parentRef} index={children.length} level={level} />); // final + button
};



const RenderNode = ({ node, index, level, dispatch, }: { node: NodeFormValues, index: number, level: number, dispatch: React.Dispatch<Action> }) => {
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
                    <InsertNodeButton existingNode={node} dispatch={dispatch} parentUid={node.uid || null} parentRef={node.ref} index={0} level={level + 1} />
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
                    {<RenderChildren children={node.children ?? []} parentRef={node.ref} parentUid={node.uid!} level={level + 1} dispatch={dispatch} />}
                </ul>
            )}
        </Card>

    );
}

