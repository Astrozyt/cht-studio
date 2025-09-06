import { emptyLocalized, useFormStore } from "@ght/stores";
import { Button } from "../../../components/button";
import { FormItem, FormLabel } from "../../../components/form";
import { Input } from "../../../components/input";
import { FieldValues, UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";

export const ItemFields = ({ items = [], append, remove, mytag, register }: { register: any, items: { labels: { lang: string; value: string }[]; value: string }[], append: UseFieldArrayAppend<FieldValues, "items">, remove: UseFieldArrayRemove, mytag: string }) => {

    //TODO: Fix the language boxes to the languages of the project.

    // const formLanguages = useFormStore(state => state.languages);
    console.log("ITEMS: ", items)

    const formLanguages = useFormStore(state => state.languages);

    const allowedLangs = (formLanguages ?? []).map(lang => lang.shortform);

    return <div className={`space-y-2 ${mytag == 'select' || mytag == 'select1' ? '' : 'hidden'}`}>
        <div className="flex justify-between items-center">
            <FormLabel>Items</FormLabel>
            <Button
                type="button"
                variant="secondary"
                onClick={() =>
                    append({
                        labels: emptyLocalized(allowedLangs),
                        value: "",
                    })
                }
                data-cy="item-add-button"
            >
                Add Item
            </Button>
        </div>

        {items.map((item, index) => (
            <FormItem key={index} className={`flex flex-wrap gap-2 items-end ${mytag == 'select' || mytag == 'select1' ? '' : 'hidden'}`}>
                <ul className="flex flex-col gap-2 items-center">
                    {item.labels.map((label, labelIndex) => (
                        <li key={labelIndex} className="flex items-center gap-2">
                            <div className="w-[100px]">
                                <Input
                                    {...register(`items.${index}.labels.${labelIndex}.lang`)}
                                    placeholder="Lang"
                                    data-cy={`item-label-lang-input-${index}-${labelIndex}`}
                                    className="w-1/4 focus-visible:ring-0"
                                    readOnly={true}
                                    tabIndex={-1}
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <Input
                                    {...register(`items.${index}.labels.${labelIndex}.value`)}
                                    placeholder="Label"
                                    data-cy={`item-label-value-input-${index}-${labelIndex}`}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex-1 min-w-[200px]">
                    <Input
                        {...register(`items.${index}.value`)}
                        placeholder="Value"
                        data-cy={`item-value-input-${index}`}
                    />
                </div>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    data-cy={`item-remove-button-${index}`}
                >
                    Remove
                </Button>
            </FormItem>
        ))}
    </div>
}