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

import { RuleGroupType } from "react-querybuilder";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const countRules = (group: RuleGroupType): number => {
    if (!group || !group.rules) {
        return 0;
    }
    const count = group.rules.reduce((count, rule) => {
        if ('rules' in rule) {
            // It's a nested group
            return count + countRules(rule);
        } else {
            // It's a single rule
            return count + 1;
        }
    }, 0);
    return count;
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}