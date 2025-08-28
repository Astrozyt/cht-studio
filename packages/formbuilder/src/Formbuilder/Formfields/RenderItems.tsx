export const RenderItems = ({ items }: { items: { value: string; labels: { lang: string; value: string; }[]; }[]; }): JSX.Element => {
    return (
        <span className="flex-1" data-cy="items">
            <p className="text-xs">Items</p>
            <ul className="w-48 border-r-1" data-cy="items-list">
                {items.map((item, i) => <li key={i} data-cy={`item-${i}`}>{item.labels.map(label => `${label.lang}: ${label.value}`).join(', ')}</li>)}
            </ul>
        </span>
    );
}