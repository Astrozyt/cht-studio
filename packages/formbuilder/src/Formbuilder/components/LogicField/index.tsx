import { useState } from "react";

export const LogicField = ({ rawLogic }: { rawLogic: string, allFieldsOfForm: string[] }) => {

    const [parsedLogic, setParsedLogic] = useState<logicCondition[]>([]);


    type comparison = {
        field: string;
        operator: '=' | '!=' | '<' | '>';
        value: string;
    }

    enum LogicOperator {
        AND = 'and',
        OR = 'or',
    }

    return (
        <div>
            <h2>Logic Field</h2>
            <p>This is a placeholder for the Logic Field component.</p>
            {/* Add your logic field implementation here */}
        </div>
    );
};