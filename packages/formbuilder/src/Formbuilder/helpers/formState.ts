import { produce } from "immer";
import { NodeFormValues } from "../Zod/zodTypes";

export type Action =
    | { type: 'UPDATE_NODE'; uid: string; changes: Partial<NodeFormValues> }
    | { type: 'ADD_NODE'; parentUid: string; newNode: NodeFormValues }
    | { type: 'DELETE_NODE'; uid: string }
    | { type: 'ADD_NODE_AT_INDEX'; parentUid: string | null; index: number; newNode: NodeFormValues }

function visit(tree: NodeFormValues[], fn: (node: NodeFormValues) => void) {
    for (const node of tree) {
        fn(node);
        if (node.children) {
            visit(node.children, fn);
        }
    }
}

const formReducer = (state: NodeFormValues[], action: Action): NodeFormValues[] => {
    return produce(state, draft => {
        switch (action.type) {
            case 'UPDATE_NODE':
                visit(draft, n => {
                    if (n.uid === action.uid) { Object.assign(n, action.changes); }
                });
                break;
            case 'ADD_NODE':
                visit(draft, n => {
                    if (n.uid === action.parentUid) {
                        (n.children ??= []).push(action.newNode);
                    }
                });
                break;
            case 'DELETE_NODE':
                removeById(draft, action.uid);
                break;
            case 'ADD_NODE_AT_INDEX': {
                const { parentUid, index, newNode } = action;
                if (parentUid === null) {
                    draft.splice(index, 0, newNode); // top-level insert
                } else {
                    const parent = findNodeByUid(draft, parentUid);
                    if (parent) {
                        if (!parent.children) parent.children = [];
                        parent.children.splice(index, 0, newNode);
                    }
                }
                break;
            }
        }
    });
};

function findNodeByUid(tree: NodeFormValues[], uid: string): NodeFormValues | undefined {
    for (const node of tree) {
        if (node.uid === uid) return node;
        if (node.children) {
            const result = findNodeByUid(node.children, uid);
            if (result) return result;
        }
    }
    return undefined;
}

function removeById(tree: NodeFormValues[], targetId: string): NodeFormValues[] {
    return tree
        .map(node => {
            if (node.children) {
                node.children = removeById(node.children, targetId);
            }
            return node;
        })
        .filter(node => node.uid !== targetId);
}
export { formReducer, visit, removeById };