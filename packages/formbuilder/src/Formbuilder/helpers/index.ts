import { nanoid } from "nanoid";
import { NodeFormValues } from "../Zod/zodTypes";

export const addUidsToNodes = (nodes: NodeFormValues[]): NodeFormValues[] => {
    return nodes.map((node) => {
        const newNode = { ...node, uid: node.uid || nanoid() }; // Ensure each node has a unique uid
        if (newNode.tag === "group" && newNode.children) {
            newNode.children = addUidsToNodes(newNode.children); // Recurse into children
        }
        return newNode;
    });
}