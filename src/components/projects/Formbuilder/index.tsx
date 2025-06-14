import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BodyNode } from "@/routes/Project/components/FormCard/extractBody";
import { Icon, TrashIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const FormEditor = ({ formModel }: { formModel: BodyNode[] | null }) => {
    const [formData, setFormData] = useState<BodyNode[]>(formModel || []);
    // console.log("Form Model Loaded:", formModel);
    // console.log("Form Data Loaded:", formData);

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
            {/* <h1>Form Editor</h1>
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tag</TableHead>
                        <TableHead>Ref</TableHead>
                        <TableHead>Appearance</TableHead>
                        <TableHead>Labelref</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Children</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {formData ? formData.map((item, index) => (
                        <FormNodeEditor key={index} node={item} level={0} updateFn={setFormData} prevTree={formData} />
                    )) : (<p>No form model available</p>)}
                </TableBody>
            </Table> */}
        </div>
    );
}

//This was partially written by AI, but I had to fix it up a bit
// const FormNodeEditor = ({ node, level, updateFn, prevTree }: { node: BodyNode; level: number; updateFn: Dispatch<SetStateAction<BodyNode[]>>; prevTree: BodyNode[] }) => {

//     return (
//         <>
//             <TableRow className="m-1 p-1 border-solid border-black" style={{ marginLeft: `${level * 1}rem` }}>
//                 <TableCell><strong>Tag:</strong> {node.tag}</TableCell>
//                 <TableCell><strong>Ref:</strong> {node.ref}</TableCell>
//                 <TableCell><strong>Appearance:</strong> {node.appearance}</TableCell>
//                 <TableCell><strong>LabelRef:</strong> {node.labelRef ?? "(no labelRef)"}</TableCell>
//                 <TableCell>
//                     <ul>
//                         {node.items && (


//                             node.items.map((item, i) => (
//                                 <li key={i}>
//                                     Value: {item.itemLabels?.length ?? 0}, LabelRef: {item.labelRef}
//                                 </li>
//                             ))

//                         )}
//                     </ul>
//                 </TableCell>
//                 <TableCell><strong>Children:</strong> {node.children && node.children.length > 0 ? node.children.length : "None"}</TableCell>


//             </TableRow>

//             {node.children && node.children.length > 0 && (
//                 <>
//                     {node.children.map((child, i) => (
//                         <FormNodeEditor key={i} node={child} level={level + 1} updateFn={updateFn} prevTree={prevTree} />
//                     ))}
//                 </>
//             )}
//             <Button onClick={() => {
//                 // Add new node to the tree at the current node
//                 const updatedTree = addNodeToTree(prevTree, node.ref || '', testNewNode);
//                 // console.log("Updated Tree:", updatedTree);

//                 updateFn(updatedTree);
//             }}>Add New Node</Button>

//         </>
//     );
// }


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
    // console.log("Rendering Node:", node, "Labels:", node.labels);
    console.log("Node Hints:", node.hints);
    return (
        <li key={level + "_" + index} className={`border-2 p-2 m-2`} style={{ marginLeft: `${level * 1}rem` }}>
            <div className="flex space-x-4">
                <span className="font-bold flex-2">{node.tag}</span>
                <span className="flex-3">{node.ref}</span>
                <span className="flex-3">{node.appearance}</span>

                <ul className="flex-2">{node.labels && node.labels.map((label, i) => { return <li key={i}>***{label.lang}: {label.value}</li>; }) || "No Labels"}</ul>
                <ul className="flex-2">
                    Items
                    {node.items ? node.items.map((item, i) => <li key={i}>Item: {item.labelRef}</li>) : null}
                </ul>
                <ul className="flex-2">
                    Hints
                    {node.hints ? node.hints.map((hint, i) => <li key={i}>{hint.lang}: {hint.value}</li>) : "No Hints"}
                </ul>
                <Button className="bg-red-500"><TrashIcon /></Button>
            </div>

            {node.children && node.children.length > 0 && (
                <ul className="ml-4 border-l-2 border-gray-300 pl-2 mt-2 space-y-2">
                    {node.children.map((child, i) => renderNode(child, i, level + 1))}
                </ul>
            )}
        </li>
    );
}
