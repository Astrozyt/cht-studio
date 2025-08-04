import { nanoid } from "nanoid";
import { FullForm } from "../Zod/zodTypes";

export const addUidsToNodes = (nodes: FullForm): FullForm => {
    console.log("Adding UIDs to nodes:", nodes);
    return {
        title: nodes.title,
        body: nodes.body.map((node) => {
            const newNode = { ...node, uid: node.uid || nanoid() }; // Ensure each node has a unique uid
            if (newNode.tag === "group" && newNode.children) {
                newNode.children = addUidsToNodes(newNode.children); // Recurse into children
            }
            return newNode;
        })
    };
}