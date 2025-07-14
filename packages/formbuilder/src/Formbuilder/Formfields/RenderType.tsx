import { NodeType } from "../Zod/zodTypes";

export const RenderType = ({ type }: { type: NodeType }): JSX.Element => {

    return <span className="font-bold flex-1 border-r-1 px-1"><p className="text-xs">Type</p><p>{type}</p></span>;
}