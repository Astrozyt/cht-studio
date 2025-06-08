type binds = {
    nodeset: string;
    type?: string;
    required?: string;
    relevant?: string;
    constraint?: string;
    jrConstraintMsg?: string;
}[];

export const extractBinds = (xmlString: string): binds => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    const binds = xmlDoc.querySelectorAll("bind");

    const result: binds = [];
    binds.forEach((bind) => {
        const nodeset = bind.getAttribute("nodeset") ?? "";
        const type = bind.getAttribute("type") ?? undefined;
        const required = bind.getAttribute("required") ?? undefined;
        const relevant = bind.getAttribute("relevant") ?? undefined;
        const constraint = bind.getAttribute("constraint") ?? undefined;
        const jrConstraintMsg = bind.getAttribute("jr:constraintMsg") ?? undefined;

        result.push({
            nodeset,
            type,
            required,
            relevant,
            constraint,
            jrConstraintMsg
        });
    }
    );
    return result;

}