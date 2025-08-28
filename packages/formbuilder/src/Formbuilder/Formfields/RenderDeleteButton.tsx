import { TrashIcon } from "lucide-react";
import { Button } from "../../components/button";

export const RenderDeleteButton = ({ onDelete }: { onDelete: () => void }): JSX.Element => {
    return (
        <span className="">
            <Button className="bg-red-500" data-cy="delete-button" onClick={onDelete}>
                <TrashIcon />
            </Button>
        </span>
    );
}