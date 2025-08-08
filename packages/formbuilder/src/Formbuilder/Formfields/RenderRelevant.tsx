export const RenderRelevant = ({ relevant }: { relevant: string }): JSX.Element => {
    return (
        <span className="text-sm flex-1 border-r-1 truncate">
            <p className="text-sm">Relevant</p>
            {/* TODO: Show number of rules in JSON */}
            <p>{relevant ? 'Yes' : "N/A"}</p>
        </span>
    );
}