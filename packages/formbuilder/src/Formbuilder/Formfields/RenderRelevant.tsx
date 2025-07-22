export const RenderRelevant = ({ relevant }: { relevant: string }): JSX.Element => {
    return (
        <span className="text-sm flex-1 border-r-1 truncate">
            <p className="text-sm">Relevant</p>
            <p>{relevant || "N/A"}</p>
        </span>
    );
}