export const RenderRequired = ({ required }: { required: boolean }): JSX.Element => {
    return <span className="text-sm flex-1 border-r-1" data-cy="required"><p>Required</p><p>{required ? "Yes" : "No"}</p></span>;
}