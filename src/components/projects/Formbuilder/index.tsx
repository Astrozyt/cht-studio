import { Button } from "@/components/ui/button";
import { BodyNode } from "@/routes/Project/components/FormCard/extractBody";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const FormEditor = ({ formModel }: { formModel: BodyNode[] | null }) => {
    const [formData, setFormData] = useState<BodyNode[]>(formModel || []);

    useEffect(() => {
        if (formModel) {
            setFormData(formModel);
        }
    }, [formModel]);

    return (
        <div>
            <ul className=" border-2 rounded p-2">
                <h2>Form Editor (Formname)</h2>
                <div id="form-editor-header" className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Tag</h3>
                    <p className="text-sm text-gray-500">Ref</p>
                    <p className="text-sm text-gray-500">Appearance</p>
                    <p className="text-sm text-gray-500">Labels</p>
                    <p className="text-sm text-gray-500">Items</p>
                    <p className="text-sm text-gray-500">Hints</p>
                    <p className="text-sm text-gray-500">Actions</p>
                </div>
                {formData.map((node, index) => renderNode(node, index, 0))}

            </ul>
        </div>
    );
}


const addNodeToTree = (
    tree: BodyNode[],
    targetRef: string,  // where to add
    newNode: BodyNode
): BodyNode[] => {
    return tree.map(node => {
        // If this is the target node where to add
        if (node.ref === targetRef) {
            // Only groups can have children
            if (!node.children) {
                return {
                    ...node,
                    children: [newNode],
                };
            } else {
                return {
                    ...node,
                    children: [...node.children, newNode],
                };
            }
        }

        // Otherwise → recurse into children if any
        if (node.children) {
            return {
                ...node,
                children: addNodeToTree(node.children, targetRef, newNode),
            };
        }

        // If no match, return node unchanged
        return node;
    })
};

const renderNode = (node: BodyNode, index: number, level: number): JSX.Element => {
    // console.log("Rendering binds", node);
    return (
        <li key={level + "_" + index} className={`border-2 p-2 m-2 pr-0 mr-0`} style={{ marginLeft: `${level * 0.4}rem` }}>
            <div className="flex justify-end w-full space-x-4">
                <span className="font-bold flex-1 border-r-1">{node.tag}</span>
                <span className="w-48 overflow-hidden border-r-1 truncate">{node.ref}</span>
                <span className="w-48 border-r-1">{node.appearance}</span>

                <ul className="w-48 border-r-1">{node.labels && node.labels.map((label, i) => { return <li className="truncate whitespace-nowrap overflow-hidden" key={i}>{label.lang}: {label.value}</li>; }) || "No Labels"}</ul>
                <ul className="w-48 border-r-1">
                    Items
                    {node.items ? node.items.map((item, i) => <li key={i}>Item: {item.labelRef}</li>) : null}
                </ul>
                <ul className="w-48 border-r-1">
                    {/* Hints */}
                    {node.hints ? node.hints.map((hint, i) => <li className="truncate whitespace-nowrap overflow-hidden" key={i}>{hint.lang}: {hint.value}</li>) : "No Hints"}
                </ul>
                <span className="text-sm w-20 border-r-1">Req: {node.bind.required || "N/A"}</span>
                <span className="text-sm w-20 border-r-1 overflow-hidden truncate">Rel: {node.bind.relevant || "N/A"}</span>
                <span className="text-sm w-20 border-r-1">Typ: {node.bind.type || "N/A"}</span>
                <span className="text-sm w-20 border-r-1 overflow-hidden truncate">Cont: {node.bind.constraint || "N/A"}</span>
                <span className="text-sm w-20 border-r-1 overflow-hidden truncate">ConstM: {node.bind.constraintMsg || "N/A"}</span>
                <span className="text-sm w-20 border-r-1">ReadOnly: {node.bind.readonly || "N/A"}</span>
                <span className="text-sm w-20 border-r-1">Calc: {node.bind.calculate || "N/A"}</span>
                <span className="text-sm w-20 border-r-1">Preload: {node.bind.preload || "N/A"}</span>
                <span className="text-sm w-20 border-r-1">PreloadParams: {node.bind.preloadParams || "N/A"}</span>
                <span className="w-20">
                    <Button className="bg-red-500"><TrashIcon /></Button>
                </span>
            </div>

            {node.children && node.children.length > 0 && (
                <ul className="border-l-2 border-gray-300 pl-0 mt-2 space-y-2">
                    {node.children.map((child, i) => renderNode(child, i, level + 1))}
                </ul>
            )}
        </li>
    );
}
