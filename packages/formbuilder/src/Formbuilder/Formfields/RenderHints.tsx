export const RenderHints = ({ hints }: { hints: { lang: string; value: string }[] }): JSX.Element => {
    return (<span className="flex-1">
        <p className="text-xs">Hints</p>
        <ul className="w-48 border-r-1">
            {hints.length > 0 ? hints.map((hint, i) => (
                <li className="truncate whitespace-nowrap overflow-hidden" key={i}>
                    {hint.lang}: {hint.value}
                </li>
            )) : <li className="text-gray-500">No Hints</li>}
        </ul>
    </span>);
}