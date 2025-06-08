// This code was initially written by ChatGPT on the 7th of June 2025.

const parseInstanceElement = (element: Element): any => {
    const obj: any = {};
    const children = Array.from(element.children);

    if (children.length === 0) {
        obj._value = element.textContent?.trim() ?? "";
    } else {
        children.forEach((child) => {
            obj[child.tagName] = parseInstanceElement(child);
        });
    }

    return obj;
}

export const extractInstanceTree = (xmlString: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    const instance = xmlDoc.querySelector("instance > *"); // first child of <instance>
    if (!instance) return {};

    return {
        [instance.tagName]: parseInstanceElement(instance),
    };
}