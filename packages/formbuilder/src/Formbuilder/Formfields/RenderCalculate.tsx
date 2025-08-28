export const RenderCalculate = ({ calculate }: { calculate: string }): JSX.Element => {
    return (
        <span className="text-sm w-20 border-r-1" data-cy="calculate">
            <p>Calculate</p>
            <p>{calculate || "N/A"}</p>
        </span>
    );
}