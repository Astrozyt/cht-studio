export const RenderLabels = ({ labels }: { labels: { lang: string; value: string }[] }): JSX.Element => {
    return (
        <span className="flex-1" data-cy="labels">
            <p>Labels</p>
            <ul className="w-48 border-r-1">
                {labels.map((label, i) => (
                    <li className="truncate whitespace-nowrap overflow-hidden" key={i}>
                        {label.lang}: {label.value}
                    </li>
                )) || "No Labels"}
            </ul>
        </span>
    );
}