import { Button } from "../../../components/button";
import { FormItem, FormLabel } from "../../../components/form";
import { Input } from "../../../components/input";
import { FieldValues, UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";

export const ItemFields = ({ items = [], append, remove, mytag, register }: { register: any, items: { labels: { lang: string; value: string }[]; value: string }[], append: UseFieldArrayAppend<FieldValues, "items">, remove: UseFieldArrayRemove, mytag: string }) => {

    //TODO: Fix the language boxes to the languages of the project.

    return <div className={`space-y-2 ${mytag == 'select' || mytag == 'select1' ? '' : 'hidden'}`}>
        <div className="flex justify-between items-center">
            <FormLabel>Items</FormLabel>
            <Button
                type="button"
                variant="secondary"
                onClick={() =>
                    append({
                        labels: [{ lang: "en", value: "" }, { lang: "fr", value: "" }],
                        value: "123",
                    })
                }
            >
                Add Item
            </Button>
        </div>

        {items.map((item, index) => (
            // Label Logic

            // console.log("Field", index, field),
            // console.log("Field label", field.labels),
            <FormItem key={index} className={`flex flex-wrap gap-2 items-end ${mytag == 'select' || mytag == 'select1' ? '' : 'hidden'}`}>
                <ul className="flex flex-col gap-2 items-center">
                    {item.labels.map((label, labelIndex) => (
                        <li key={labelIndex} className="flex items-center gap-2">
                            <div className="w-[100px]">
                                <Input
                                    {...register(`items.${index}.labels.${labelIndex}.lang`)}
                                    placeholder="Lang"
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <Input
                                    {...register(`items.${index}.labels.${labelIndex}.value`)}
                                    placeholder="Label"
                                />
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex-1 min-w-[200px]">
                    <Input
                        {...register(`items.${index}.value`)}
                        placeholder="Value"
                    />
                </div>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                >
                    Remove
                </Button>
            </FormItem>
        ))}
    </div>
}