export const RenderReadonly = ({ readonly }: { readonly: string }): JSX.Element => {
    return (
        <span className="text-sm w-20 border-r-1" data-cy="readonly">
            <p>ReadOnly</p>
            <p>{readonly || "N/A"}</p>
        </span>
    );
}