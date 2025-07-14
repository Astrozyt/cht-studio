import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
// import { NodeFormValues } from "./types";
import { TrashIcon } from "lucide-react";
import { useReducer, useState } from "react";
import { Action, formReducer } from "./helpers/formState";
import { nanoid } from 'nanoid'
import { InsertNodeButton } from "./components/InsertNodeButton";
import { NodeFormValues, NodeType } from "./Zod/zodTypes";
import { Input } from "../components/input";
import { RenderRequired } from "./Formfields/RenderRequired";
import { RenderLabels, RenderRef } from "./Formfields";
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

export const FormEditor = ({ formModel }: { formModel: NodeFormValues[] | null }) => {
    formModel = addUidsToNodes(formModel || []); // Ensure all nodes have uids
    const [formDataRed, dispatch] = useReducer(formReducer, formModel || []);

    return (
        <div>
            <ul className=" border-2 rounded p-2">
                <h2>Form Editor (Formname)</h2>
                {renderChildren(formDataRed, null, 0, dispatch)}

            </ul>
        </div>
    );
}

const renderChildren = (children: NodeFormValues[], parentUid: string | null, level: number, dispatch: React.Dispatch<Action>) => {
    // const lastPostion = children.length;
    return children.flatMap((child, index) => [
        // InsertNodeButton({ dispatch, parentUid, index, level }),
        <InsertNodeButton dispatch={dispatch} parentUid={parentUid} index={index} level={level} />,

        renderNode(child, index, level, dispatch),
    ]).concat(<InsertNodeButton dispatch={dispatch} parentUid={parentUid} index={children.length} level={level} />); // final + button
};

const addUidsToNodes = (nodes: NodeFormValues[]): NodeFormValues[] => {
    return nodes.map((node) => {
        const newNode = { ...node, uid: node.uid || nanoid() }; // Ensure each node has a unique uid
        if (newNode.tag === "group" && newNode.children) {
            newNode.children = addUidsToNodes(newNode.children); // Recurse into children
        }
        return newNode;
    });
}

const renderNode = (node: NodeFormValues, index: number, level: number, dispatch: React.ActionDispatch<[action: Action]>): JSX.Element => {

    return (
        <>
            <Card key={index} className={`border-2 p-2 m-2 pr-0 mr-0`} style={{ marginLeft: `${level * 0.4}rem` }}>
                <CardContent className="px-2 flex justify-end w-full space-x-4">
                    {<RenderType type={node.tag} />}
                    {node.ref && <RenderRef ref={node.ref} onSave={(newValue) => { dispatch({ type: "UPDATE_NODE", uid: node.uid, changes: { ref: newValue } }) }} />}

                    {node.tag === 'input' && (<>
                        {node.appearance && <RenderAppearance appearance={node.appearance} />}
                        {node.labels && <RenderLabels labels={node.labels} />}
                        {node.bind && <RenderRequired required={node.bind.required || false} />}
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
                            {node.labels && <RenderLabels labels={node.labels} />}
                            {node.items && <RenderItems items={node.items} />}
                            {<RenderRelevant relevant={node.bind.relevant || "N/A"} />}
                        </>
                    )}
                    {node.tag === "note" && (
                        <>
                            {node.labels && <RenderLabels labels={node.labels} />}
                            {node.hints && <RenderHints hints={node.hints} />}
                        </>
                    )}


                    {renderDeleteButton(() => {
                        // console.log("Delete node", node.uid);
                        dispatch({ type: 'DELETE_NODE', uid: node.uid || '' });
                    })}
                </CardContent>

                {node.tag === "group" && (
                    <ul className="border-l-2 border-gray-300 pl-0 mt-2 space-y-2">
                        {(!node.children || node.children.length === 0) && (
                            <li>No children</li>
                        )}
                        {renderChildren(node.children ?? [], node.uid!, level + 1, dispatch)}
                    </ul>
                )}
            </Card>
        </>
    );
}







const renderDeleteButton = (onDelete: () => void): JSX.Element => {
    return (
        <span className="w-20">
            <Button className="bg-red-500" onClick={onDelete}>
                <TrashIcon />
            </Button>
        </span>
    );
}

