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

export const extractInstanceTree = (element: Element) => {

    return {
        [element.tagName]: parseInstanceElement(element),
    };
}