export const RenderTypeSelect = ({ type }: { type: string }): JSX.Element => {
    return (
        <span className="text-sm flex-1 w-20 border-r-1" data-cy="type">
            <p>Type</p>
            <p>{type}</p>
        </span>
    );
}