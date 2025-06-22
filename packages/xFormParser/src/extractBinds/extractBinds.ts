export type Bind = {
    nodeset: string;
    type?: string;
    required?: string;
    requiredMsg?: string
    relevant?: string;
    constraint?: string;
    constraintMsg?: string;
    readonly?: string; // added readonly attribute
    calculate?: string; // added calculate attribute
    preload?: string; // added preload attribute
    preloadParams?: string; // added preloadParams attribute
};

export const extractBinds = (binds: Iterable<Element>): Bind[] => {
    const result: Bind[] = Array.from(binds).map((bind) => {
        const nodeset = bind.getAttribute("nodeset") ?? "";
        const type = bind.getAttribute("type") ?? undefined;
        const required = bind.getAttribute("required") ?? undefined;
        const relevant = bind.getAttribute("relevant") ?? undefined;
        const constraint = bind.getAttribute("constraint") ?? undefined;
        const constraintMsg = bind.getAttribute("jr:constraintMsg") ?? undefined;
        const readonly = bind.getAttribute("readonly") ?? undefined; // added readonly attribute
        const calculate = bind.getAttribute("calculate") ?? undefined; // added calculate attribute
        const preload = bind.getAttribute("jr:preload") ?? undefined; // added preload attribute
        const preloadParams = bind.getAttribute("jr:preloadParams") ?? undefined; // added preloadParams attribute

        return {
            nodeset,
            type,
            required,
            relevant,
            constraint,
            constraintMsg,
            readonly, // added readonly attribute
            calculate, // added calculate attribute
            preload, // added preload attribute
            preloadParams // added preloadParams attribute
        };
    });
    return result;

}