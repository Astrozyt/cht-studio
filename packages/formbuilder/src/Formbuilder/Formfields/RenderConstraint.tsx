export const RenderConstraint = ({ constraint }: { constraint: string }): JSX.Element => {
    return (
        <span className="text-sm w-20 border-r-1 flex-1 overflow-hidden truncate">
            <p>Constraint</p>
            <p>{constraint || "N/A"}</p>
        </span>
    );
}

export const RenderConstraintMessage = ({ constraintMsg }: { constraintMsg: string }): JSX.Element => {
    return (
        <span className="text-sm w-20 border-r-1 flex-1 overflow-hidden truncate">
            <p>Constraint Message</p>
            <p>{constraintMsg || "N/A"}</p>
        </span>
    );
}