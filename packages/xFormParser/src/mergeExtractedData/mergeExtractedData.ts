import { type Bind } from "../extractBinds/extractBinds";
import { type BodyNode } from "../extractBody/extractBody";
import { type ITextMap } from "../extractTranslations";

export const mergeExtractedData = (bodyTree: BodyNode[],
    iTextMap: ITextMap,
    binds: Bind[],
    instanceMap: Record<string, string>
): BodyNode[] => {
    return bodyTree.map(node => {
        const iTextKey = node.ref || "";
        // If the node has no labelRef, we can skip merging labels
        if (!iTextKey && !node.hintRef && !node.items) {
            return node; // No need to merge, return as is
        }
        const labels = iTextMap.filter(item => item.id === iTextKey + ":label");
        const hints = node.hintRef ? iTextMap.filter(item => item.id === node.hintRef) : [];
        const bindsForNode = binds.find(bind => bind.nodeset === node.ref) || {
            nodeset: node.ref || "",
            type: undefined,
            required: undefined,
            relevant: undefined,
            constraint: undefined,
            constraintMsg: undefined,
            readonly: undefined, // added readonly attribute
            calculate: undefined, // added calculate attribute
            preload: undefined, // added preload attribute
            preloadParams: undefined // added preloadParams attribute
        };
        if (bindsForNode.calculate) {
            console.log("Found calculate bind for node", node.ref, bindsForNode.calculate);
        }
        // console.log("Binds for node", node.ref, bindsForNode);
        const mergedNode: BodyNode = {
            ...node,
            labels: labels,
            hints,
            items: node.items
                ? node.items.map(item => ({
                    ...item,
                    labels: iTextMap.filter(iText => iText.id === item.labelRef)
                }))
                : undefined,

            // Merge bind
            bind: bindsForNode, // updated to null
        };

        // Recursively merge children
        if (node.children && node.children.length > 0) {
            mergedNode.children = mergeExtractedData(
                node.children,
                iTextMap,
                binds,
                instanceMap
            );
        }

        return mergedNode;
    });
}