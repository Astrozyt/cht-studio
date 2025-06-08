import { useState } from "react";
import { Question } from "./types";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox"

const AppearanceSchema = z.object({
    map: z.boolean().default(false),
    fieldList: z.boolean().default(false),
    label: z.boolean().default(false),
    listNolabel: z.boolean().default(false),
    list: z.boolean().default(false),
    tableList: z.boolean().default(false),
    hiddenAnswer: z.boolean().default(false),
    printer: z.boolean().default(false),
    masked: z.boolean().default(false),
    counter: z.boolean().default(false),
});

type AppearanceSchemaType = z.infer<typeof AppearanceSchema>;

export const appearancesList = (inputType: Question["type"], inputState: AppearanceSchemaType, updateState: (state: AppearanceSchemaType) => void) => {
    // const [appearance, setAppearance] = useState(inputState);

    const handleChange = (name: keyof AppearanceSchemaType) => {
        let newState = { ...inputState };
        newState[name] = !inputState[name];
        updateState(newState);
    };

    return (
        <>
            {inputType === "select_one_list_name" || inputType === "select_multiple_list_name" ? (
                <>
                    <label htmlFor="map" className="text-lg font-bold">Map</label>
                    <Checkbox id="map" onChange={() => handleChange(AppearanceNames.map)} />
                </>
            ) : null}
            {inputType === "begin_group" || inputType === "begin_repeat" ? (
                <>
                    <label htmlFor="fieldList" className="text-lg font-bold">Field List</label>
                    <Checkbox id="fieldList" onChange={() => handleChange(AppearanceNames.fieldList)} />
                </>
            ) : null}
            {/* TODO: Complete list of selects */}
            {inputType === "select_one_list_name" || inputType === "select_multiple_list_name" ? (
                <>
                    <label htmlFor="label" className="text-lg font-bold">Label</label>
                    <Checkbox id="label" onChange={() => handleChange(AppearanceNames.label)} />
                    <label htmlFor="listNolabel" className="text-lg font-bold">List No Label</label>
                    <Checkbox id="listNolabel" onChange={() => handleChange(AppearanceNames.listNolabel)} />
                    <label htmlFor="list" className="text-lg font-bold">List</label>
                    <Checkbox id="list" onChange={() => handleChange(AppearanceNames.list)} />
                </>
            ) : null}
            {inputType === "begin_group" ? (
                <>
                    <label htmlFor="tableList" className="text-lg font-bold">Table List</label>
                    <Checkbox id="tableList" onChange={() => handleChange(AppearanceNames.tableList)} />
                </>
            ) : null}
            {inputType === "barcode" ? (
                <>
                    <label htmlFor="hidden-answer" className="text-lg font-bold">Hidden answer</label>
                    <Checkbox id="hidden-answer" onChange={() => handleChange(AppearanceNames.hiddenAnswer)} />
                </>
            ) : null}
            {inputType === "text" ? (
                <>
                    <label htmlFor="masked" className="text-lg font-bold">Masked</label>
                    <Checkbox id="masked" onChange={() => handleChange(AppearanceNames.masked)} />
                    <label htmlFor="printer" className="text-lg font-bold">Printer</label>
                    <Checkbox id="printer" onChange={() => handleChange(AppearanceNames.printer)} />
                </>
            ) : null}
            {inputType === "integer" ? (
                <>
                    <label htmlFor="counter" className="text-lg font-bold">Counter</label>
                    <Checkbox id="counter" onChange={() => handleChange(AppearanceNames.counter)} />
                </>
            ) : null}
        </>
    );

}

enum AppearanceNames {
    map = "map",
    fieldList = "fieldList",
    label = "label",
    listNolabel = "listNolabel",
    list = "list",
    tableList = "tableList",
    hiddenAnswer = "hiddenAnswer",
    printer = "printer",
    masked = "masked",
    counter = "counter"
}