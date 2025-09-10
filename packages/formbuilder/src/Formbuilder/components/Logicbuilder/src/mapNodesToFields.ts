import type { Field } from 'react-querybuilder';
import type { Node } from '../../../../../../stores/src/formStore.ts';


// querybuilder/operators.ts
export const TEXT_OPS = [
    '=', '!=', 'contains', 'beginsWith', 'endsWith', 'in', 'notIn', 'isNull', 'isNotNull',
] as const;

export const NUMBER_OPS = [
    '=', '!=', '<', '<=', '>', '>=', 'between', 'notBetween', 'in', 'notIn', 'isNull', 'isNotNull',
] as const;

export const BOOLEAN_OPS = [
    '=', '!=', 'isNull', 'isNotNull',
] as const;

export const SELECT_OPS = [
    '=', '!=', 'in', 'notIn', 'isNull', 'isNotNull',
] as const;

// map your nodes to RQB fields
export const mapNodesToFields = (nodes: Node[], defaultLang = 'en'): Field[] =>
    nodes.map((n): Field => {
        const label =
            n.labels?.find(l => l.lang === defaultLang)?.value || n.ref;

        // INPUTS
        if (n.tag === 'input') {
            const bindType = n.bind?.type;
            const isNumber =
                bindType === 'int' ||
                bindType === 'integer' ||
                bindType === 'decimal' ||
                bindType === 'number';

            return {
                name: n.ref,
                label,
                // For numbers: use a number HTML input but keep valueEditorType 'text'
                inputType: isNumber ? 'number' : 'text',
                operators: isNumber ? [...NUMBER_OPS] : [...TEXT_OPS],
                valueEditorType: 'text',
            };
        }

        // SELECTS
        if (n.tag === 'select' || n.tag === 'select1') {
            return {
                name: n.ref,
                label,
                valueEditorType: 'select',
                operators: [...SELECT_OPS],
                values: (n.items ?? []).map(it => ({
                    name: it.value,
                    label:
                        it.labels?.find(l => l.lang === defaultLang)?.value ?? it.value,
                })),
            };
        }

        // // BOOLEAN
        // if (n.tag === 'boolean') {
        //     return {
        //         name: n.ref,
        //         label,
        //         valueEditorType: 'select',
        //         values: [
        //             { name: 'true', label: 'True' },
        //             { name: 'false', label: 'False' },
        //         ],
        //     };
        // }

        // FALLBACK
        return {
            name: n.ref,
            label,
            valueEditorType: 'text',
            inputType: 'text',
        };
    });
