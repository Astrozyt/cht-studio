import { Button } from "../../../components/button";
import { FormControl, FormItem, FormLabel } from "../../../components//form";
import { Input } from "../../../components//input";
import { useFieldArray, useFormContext } from "react-hook-form";

export const HintsFields = () => {
    const { control, register } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "hints"
    });

    return (
        <div className="space-y-4">
            <FormLabel className="text-base">Hints</FormLabel>
            {fields.map((field, index) => (
                <FormItem key={field.id} className="flex gap-2 items-center">
                    <FormControl>
                        <Input
                            {...register(`hints.${index}.lang`)}
                            placeholder="Lang (e.g. en)"
                            className="w-1/4"
                        />
                    </FormControl>
                    <FormControl>
                        <Input
                            {...register(`hints.${index}.value`)}
                            placeholder="Label text"
                            className="w-3/4"
                        />
                    </FormControl>
                    <Button type="button" variant="ghost" onClick={() => remove(index)}>
                        ✕
                    </Button>
                </FormItem>
            ))}

            <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => append({ lang: "", value: "" })}
            >
                ➕ Add Label
            </Button>
        </div>
    );
};