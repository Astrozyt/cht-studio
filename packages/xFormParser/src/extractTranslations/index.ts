export type ITextMap = { id: string, lang: string; value: string }[];

export const extractITextTranslations = (elements: Iterable<Element>): ITextMap => {

    const result: ITextMap = []; // corrected syntax

    Array.from(elements).forEach((element) => {
        const lang = element.getAttribute("lang") ?? "";

        const texts = element.querySelectorAll("text");

        texts.forEach((textEl) => {
            const id = textEl.getAttribute("id") ?? "";
            const valueEl = textEl.querySelector("value");
            const value = valueEl ? valueEl.textContent?.trim() ?? "" : "";

            result.push(
                { id, lang, value } // corrected syntax
            ); // updated to match new structure
        });
    });
    return result;
};
