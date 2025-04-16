//Question types according to https://docs.getodk.org/form-question-types/

import { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Card } from "../ui/card";


const FormEditor = () => {
    const [elements, setElements] = useState([1, 2, 3]);

    const MoveItem = (index: number, moveSize: number) => {
        //Move element one position
        const newElements = [...elements];
        newElements[index] = elements[index + moveSize];
        newElements[index + moveSize] = elements[index];
        setElements(newElements);
    }


    return (
        <div className="grid grid-cols-[4fr_1fr] gap-1 mx-4">
            <Card>
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Movement</TableHead>
                            <TableHead className="w-[100px]">Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {elements.map((element, index) => (
                            <TableRow key={element}>
                                <TableCell>
                                    {index && <Button onClick={() => {
                                        MoveItem(index, -1)
                                    }}>UP</Button> || undefined}
                                    {index + 1 < elements.length && <Button onClick={() => { MoveItem(index, 1) }}>DOWN</Button>
                                    }</TableCell>
                                <TableCell className="font-medium">INV001</TableCell>
                                <TableCell>{element}</TableCell>
                                <TableCell>Credit Card</TableCell>
                                <TableCell className="text-right">$250.00</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
            <Card>
                <p>Hello</p>
            </Card>
        </div>
    );
}
export default FormEditor;