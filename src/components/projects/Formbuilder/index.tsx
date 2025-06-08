import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BodyNode } from "@/routes/Project/components/FormCard/extractBody";

export const FormEditor = ({ formModel }: { formModel: BodyNode[] | null }) => {
    return (
        <div>
            <h1>Form Editor</h1>
            {/* Render form model details here */}
            {/* {formModel ? (
                <pre>{JSON.stringify(formModel, null, 2)}</pre>
            ) : (
                <p>No form model available</p>
            )} */}
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tag</TableHead>
                        <TableHead>Ref</TableHead>
                        <TableHead>Appearance</TableHead>
                        <TableHead>Labelref</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Children</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {formModel ? formModel.map((item, index) => (
                        <FormNodeEditor key={index} node={item} level={0} />
                    )) : (<p>No form model available</p>)}
                    {/* //     <TableRow key={index}>
                        //         <TableCell className="font-medium">{item.ref}</TableCell>
                        //         <TableCell>{item.labels?.en || "Unknown"}</TableCell>
                        //         <TableCell>{item.hints?.en || "N/A"}</TableCell>
                        //         <TableCell className="text-right">{item.items ? item.items.map(i => i.value).join(", ") : "N/A"}</TableCell>
                        //     </TableRow>
                        // )) : (
                        //     <TableRow>
                        //         <TableCell colSpan={4} className="text-center">No form model available</TableCell>
                        //     </TableRow>
                        // )} */}

                    {/* Example static row, can be removed */}
                    {/* <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow> */}
                </TableBody>
            </Table>
        </div>
    );
}

//This was partially written by AI, but I had to fix it up a bit
function FormNodeEditor({ node, level }: { node: BodyNode; level: number }) {
    return (
        <>
            <TableRow className="m-1 p-1 border-solid border-black" style={{ marginLeft: `${level * 1}rem` }}>
                <TableCell><strong>Tag:</strong> {node.tag}</TableCell>
                <TableCell><strong>Ref:</strong> {node.ref}</TableCell>
                <TableCell><strong>Appearance:</strong> {node.appearance}</TableCell>
                <TableCell><strong>LabelRef:</strong> {node.labelRef ?? "(no labelRef)"}</TableCell>
                <TableCell>
                    <ul>
                        {node.items && (


                            node.items.map((item, i) => (
                                <li key={i}>
                                    Value: {item.value}, LabelRef: {item.labelRef}
                                </li>
                            ))

                        )}
                    </ul>
                </TableCell>
                <TableCell><strong>Children:</strong> {node.children && node.children.length > 0 ? node.children.length : "None"}</TableCell>


            </TableRow>

            {node.children && node.children.length > 0 && (
                <>
                    {node.children.map((child, i) => (
                        <FormNodeEditor key={i} node={child} level={level + 1} />
                    ))}
                </>
            )}
        </>
    );
}