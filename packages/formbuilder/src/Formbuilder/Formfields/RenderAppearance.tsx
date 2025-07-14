export const RenderAppearance = ({ appearance }: { appearance: string }): JSX.Element => {
    return <span className="w-48 border-r-1 flex-1"><p className="text-xs">Appearance</p><p>{appearance}</p></span>;
}