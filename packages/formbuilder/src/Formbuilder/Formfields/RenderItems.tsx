export const RenderItems = ({ items }: { items: { value: string; labels: { lang: string; value: string; }[]; }[]; }): JSX.Element => {
    return (
        <span className="flex-1">
            <p className="text-xs">Items</p>
            <ul className="w-48 border-r-1">
                {items.map((item, i) => <li key={i}>{item.labels.map(label => `${label.lang}: ${label.value}`).join(', ')}</li>)}
            </ul>
        </span>
    );
}