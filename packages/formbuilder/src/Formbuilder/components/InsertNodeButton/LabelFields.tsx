import { Button } from "../../../components/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "../../../components/form";
import { Input } from "../../../components/input";
import { useFieldArray, useFormContext } from "react-hook-form";

export const LabelFields = () => {
    const { control, register } = useFormContext();
    const { fields } = useFieldArray({
        control,
        name: "labels"
    });
    //TODO: Instead of offering an add label button, prepopulate with options for each project language (Zustand).
    return (
        <div data-cy="label-fields" className="space-y-4">
            <FormLabel className="text-base">Labels</FormLabel>
            {fields.map((field, index) => (
                <FormItem key={field.id} className="flex gap-2 items-center">
                    <FormControl>
                        <Input
                            {...register(`labels.${index}.lang`)}
                            placeholder="Lang (e.g. en)"
                            className="w-1/4 focus-visible:ring-0"
                            data-cy={`label-lang-input-${index}`}
                            readOnly={true}
                            tabIndex={-1}
                        />
                    </FormControl>
                    <FormControl>
                        <Input
                            {...register(`labels.${index}.value`)}
                            placeholder="Label text"
                            className="w-3/4"
                            data-cy={`label-value-input-${index}`}
                        />
                    </FormControl>
                    <FormMessage className="text-red-600" data-cy={`label-error-${index}`} />
                </FormItem>
            ))}

        </div>
    );
};