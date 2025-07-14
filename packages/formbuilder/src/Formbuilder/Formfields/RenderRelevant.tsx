export const RenderRelevant = ({ relevant }: { relevant: string }): JSX.Element => {
    return (
        <span className="text-sm flex-1 w-20 border-r-1 overflow-hidden truncate">
            <p>Relevant</p>
            <p>{relevant || "N/A"}</p>
        </span>
    );
}