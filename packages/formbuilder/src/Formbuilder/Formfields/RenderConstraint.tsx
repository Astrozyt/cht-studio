import { RuleGroupType } from "react-querybuilder";
import { countRules } from "../helpers";

export const RenderConstraint = ({ constraint }: { constraint: RuleGroupType }): JSX.Element => {
    const ruleNum = countRules(constraint);
    return (
        <span className="text-sm w-20 border-r-1 flex-1 overflow-hidden truncate">
            <p>Constraint</p>
            <p>{ruleNum} rules</p>
        </span>
    );
}

export const RenderConstraintMessage = ({ constraintMsg }: { constraintMsg: string }): JSX.Element => {
    return (
        <span className="text-sm w-20 border-r-1 flex-1 overflow-hidden truncate">
            <p>Constraint Message</p>
            <p>{constraintMsg || "-"}</p>
        </span>
    );
}