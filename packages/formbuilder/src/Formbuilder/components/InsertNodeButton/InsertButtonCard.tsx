import { Card } from "../../../components/card";
import { Action } from "../../helpers/formState";
import { bindTypeSchema } from "../../Zod/zodTypes";
import { nanoid } from "nanoid";
import { NodeType } from "../../types";

export const InsertButtonCard = ({
    dispatch,
    parentUid,
    index,
    level,
}: {
    dispatch: React.Dispatch<Action>,
    parentUid: string | null,
    index: number,
    level: number
}) => {
    return (
        <Card
            key={`insert-${parentUid ?? "root"}-${index}`}
            style={{ marginLeft: `${level * 0.4}rem`, width: `calc(100% - ${level * 0.4}rem)` }}
            onClick={() => { console.log("Insert button clicked") }}
            // dispatch({
            //     type: 'ADD_NODE_AT_INDEX',
            //     parentUid,
            //     index,
            //     newNode: {
            //         uid: nanoid(),
            //         tag: NodeType.Input,
            //         ref: 'NEW NODE!',
            //         appearance: '',
            //         labels: [],
            //         items: [{ value: '', labels: [{ lang: 'en', value: '' }] }],
            //         hints: [],
            //         bind: {
            //             nodeset: '',
            //             required: 'false',
            //             type: bindTypeSchema.options[0], // default to the first type
            //             constraint: '',
            //             constraintMsg: '',
            //             readonly: '',
            //             relevant: '',
            //             calculate: '',
            //             preload: '',
            //             preloadParams: ''
            //         },
            //         children: []
            //     }
            // })

            className="py-0 flex justify-center w-full space-x-4 bg-green-200 hover:bg-green-400 cursor-pointer"
        >
            <span className="pl-3" data-cy={`insert-button-${level}-${index}`}>➕ Insert Here</span>
        </Card>
    );
};