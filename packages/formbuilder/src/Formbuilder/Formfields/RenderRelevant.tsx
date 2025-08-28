import { countRules } from "../helpers";

export const RenderRelevant = ({ relevant }: { relevant: string }): JSX.Element => {
    console.log("Relevant:", JSON.stringify(relevant));

    const numberOfRules = countRules(relevant as any);
    return (
        <span className="text-sm flex-1 border-r-1 truncate" data-cy="relevant">
            <p className="text-sm">Relevant</p>
            <p>{relevant ? numberOfRules : "-"}</p>
        </span>
    );
}