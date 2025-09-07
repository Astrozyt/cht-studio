export const RenderRef = ({ nodeRef, onSave }: { nodeRef: string, onSave: (newValue: string) => void }): JSX.Element => {
    const lastSlashIndex = nodeRef.lastIndexOf("/");
    const suffix = nodeRef.substring(lastSlashIndex + 1);

    return <span className="overflow-hidden border-r-1 flex-1 truncate"><p className="text-xs">Reference</p><p>{suffix}</p></span>;
}