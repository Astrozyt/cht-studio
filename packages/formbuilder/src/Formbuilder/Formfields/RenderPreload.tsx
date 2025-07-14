export const RenderPreload = ({ preload }: { preload: string }): JSX.Element => {
    return (
        <span className="text-sm w-20 border-r-1">
            <p>Preload</p>
            <p>{preload || "N/A"}</p>
        </span>
    );
}

export const RenderPreloadParams = ({ preloadParams }: { preloadParams: string }): JSX.Element => {
    return (
        <span className="text-sm w-20 flex-1 border-r-1">
            <p>Preload Params</p>
            <p>{preloadParams || "N/A"}</p>
        </span>
    );
}