import { DialogHeader, DialogTitle, DialogDescription } from "../../../../components/dialog";

export const FormHeader = ({ update, insert, mytag }: { update?: boolean, insert?: boolean, mytag?: string }) => {
    return insert ? <DialogHeader>
        <DialogTitle>Create new Node</DialogTitle>
        <DialogDescription>
            Click to create a new node. You can then edit its properties in the form editor. {mytag}
        </DialogDescription>
    </DialogHeader> : update ? <DialogHeader>
        <DialogTitle>Update Node</DialogTitle>
        <DialogDescription>
            Click to update the node. You can then edit its properties in the form editor. {mytag}
        </DialogDescription>
    </DialogHeader> : <p>Formheader</p>
}