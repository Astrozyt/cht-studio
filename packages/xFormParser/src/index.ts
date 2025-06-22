import { extractBinds } from "./extractBinds/extractBinds";
import { extractBody } from "./extractBody/extractBody";
import { extractInstanceTree } from "./extractInstance/extractInstance";
import { extractITextTranslations } from "./extractTranslations";
import { mergeExtractedData } from "./mergeExtractedData/mergeExtractedData";

export const parseXFormDoc = (docs: Document[]) => {

    const translations = extractITextTranslations(docs[0].querySelectorAll('translation'));
    const binds = extractBinds(docs[0].querySelectorAll('bind'));
    const rawInstance = docs[0].querySelector('instance');
    if (!rawInstance) {
        console.error("No instance element found in the document");
        return [];
    }
    const instance = extractInstanceTree(rawInstance);
    const rawBody = docs[0].querySelector('body');
    if (!rawBody) {
        console.error("No body element found in the document");
        return [];
    }
    const body = extractBody(rawBody);
    const fullNode = mergeExtractedData(body, translations, binds, instance);
    return fullNode;
};
// }