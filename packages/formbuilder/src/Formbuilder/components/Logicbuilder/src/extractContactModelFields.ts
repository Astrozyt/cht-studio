import { type Field } from 'react-querybuilder';
import { SELECT_OPS } from './mapNodesToFields';

type CMAttr = {
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select1' | 'select' | 'boolean' | 'phone';
    saveTo?: string;           // e.g. 'sex' or 'parent._id'
    name: string;
    options?: { value: string; label?: string }[];
};

export function cmAttrsToQBFields(attrs: CMAttr[], typeId: string): Field[] {

    return attrs.map((a): Field => {
        const name = `contact.${a.saveTo}`; // our logical name (we’ll resolve to XPath later)
        const base: Field = {
            name,
            label: name || a.label || a.key,
            optGroupLabel: `Contact • ${typeId}`, // optional: visual group label
            optGroup: `Contact • ${typeId}`
        };

        if (a.type === 'select1' || a.type === 'select') {
            return {
                ...base,
                valueEditorType: 'select',
                inputType: 'select',
                operators: [...SELECT_OPS],
                values: (a.options ?? []).map(o => ({
                    label: o.label ?? o.value,
                    // name: o.label ?? o.value,
                    value: o.value
                })),
            };
        }
        if (a.type === 'date') {
            return { ...base, inputType: 'date', operators: ["before", "after", "on"] };
        }
        if (a.type === 'number') {
            return {
                ...base, inputType: 'number', operators: [
                    '=', '!=', '<', '<=', '>', '>=', 'isNull', 'isNotNull',
                ]
            };
        }
        if (a.type === 'boolean') {
            return {
                ...base,
                valueEditorType: 'select',
                operators: ["=", "!="],
                values: [{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]
            };
        }
        // text / phone default:
        return { ...base, inputType: 'text' };
    });
}
