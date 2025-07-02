import { extractBinds } from "./extractBinds/extractBinds";
import { extractBody, type BodyNode } from "./extractBody/extractBody";
import { extractInstanceTree } from "./extractInstance/extractInstance";
import { extractITextTranslations } from "./extractTranslations";
import { mergeExtractedData } from "./mergeExtractedData/mergeExtractedData";

type JSONXFormDoc = {
    title: string;
    body: BodyNode[];
}

// TODO: Make ready for multiple files.
export const parseXFormDoc = (docs: Document[]): JSONXFormDoc => {

    const title = docs[0].querySelector('h\\:head > h\\:title')?.textContent || `Form from: ${Date.now().toString()}`;

    const translations = extractITextTranslations(docs[0].querySelectorAll('translation'));
    const binds = extractBinds(docs[0].querySelectorAll('bind'));
    const rawInstance = docs[0].querySelector('instance');
    if (!rawInstance) {
        console.error("No instance element found in the document");
        throw new Error("No instance element found in the document");
    }
    const instance = extractInstanceTree(rawInstance);
    const rawBody = docs[0].querySelector('body');
    if (!rawBody) {
        console.error("No body element found in the document");
        throw new Error("No body element found in the document");
    }
    const body = extractBody(rawBody);
    const fullNode = mergeExtractedData(body, translations, binds, instance);
    const fullNodeWithTitle: JSONXFormDoc = {
        title: title,
        body: fullNode
    };
    return fullNodeWithTitle;
};
// }