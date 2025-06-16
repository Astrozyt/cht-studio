import { Bind } from "./extractBinds";
import { BodyNode } from "./extractBody";
import { ITextMap } from "./extractTranslations";

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
        // Find the corresponding iText entry for the labelRef
        // console.log("--->iTextMap", iTextMap, "Node labelRef", node.labelRef, "iTextKey", iTextKey);
        const labels = iTextMap.filter(item => item.id === iTextKey + ":label");
        const hints = node.hintRef ? iTextMap.filter(item => item.id === node.hintRef) : [];
        // console.log("Hints", node.hintRef, hints);
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

            // Merge label
            // labels: node.labelRef ? iTextMap.find(item => item[node.labelRef])?.[node.labelRef]?.lang ?? null : null,
            labels: labels,
            hints,

            // Merge items (select/select1)
            items: node.items
                ? node.items.map(item => ({
                    ...item,
                    labels: iTextMap.filter(iText => iText.id === item.labelRef)
                }))
                : undefined,

            // Merge bind
            bind: bindsForNode, // updated to null

            // Merge instance
            // instanceValue: node.ref ? instanceMap[node.ref] ?? null : null,
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