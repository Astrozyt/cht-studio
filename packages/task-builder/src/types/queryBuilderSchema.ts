import * as z from 'zod';

/** Operators you allow in the UI */
export const QbOperator = z.enum([
    '=', '!=', '>', '>=', '<', '<=',
    'contains', 'beginsWith', 'endsWith',
    'in', 'notIn',
    'is_null', 'is_not_null', 'is_empty', 'is_not_empty'
]);

/** Values allowed on the right-hand side */
const QbValue = z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.union([z.string(), z.number(), z.boolean()])),
    z.null()
]);

/** A single rule/leaf */
export const QbRule = z.object({
    id: z.string().optional(),
    field: z.string().min(1),
    operator: QbOperator,
    value: QbValue.optional(),
    valueSource: z.enum(['value', 'field']).optional(),
    disabled: z.boolean().optional(),
});

/** Forward declaration for recursion */
type _QbGroup = z.infer<typeof QbGroup>;
export type QbNode = z.infer<typeof QbNode>;

/** A group (AND/OR) of rules or other groups */
export const QbGroup: z.ZodTypeAny = z.lazy(() =>
    z.object({
        id: z.string().optional(),
        combinator: z.enum(['and', 'or']),
        rules: z.array(QbNode),
        not: z.boolean().optional(),
    })
);

/** A node is either a rule or a group */
export const QbNode: z.ZodTypeAny = z.union([QbRule, QbGroup]);

/** The root query is always a group */
export const QbQuery = QbGroup.superRefine((g, ctx) => {
    // No empty groups
    if (!g.rules.length) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Group must contain at least one rule or subgroup' });
    }

    // Enforce value presence for non-unary operators
    const unary = new Set(['is_null', 'is_not_null', 'is_empty', 'is_not_empty']);
    const check = (node: z.infer<typeof QbNode>) => {
        if ('rules' in node) {
            if (!node.rules.length) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Empty subgroup', path: ['rules'] });
            }
            node.rules.forEach(check);
        } else {
            if (!unary.has(node.operator)) {
                if (typeof node.value === 'undefined') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Operator "${node.operator}" requires a value`,
                        path: ['value'],
                    });
                }
                if ((node.operator === 'in' || node.operator === 'notIn') && !Array.isArray(node.value)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `"${node.operator}" expects an array value`,
                        path: ['value'],
                    });
                }
            }
        }
    };

    g.rules.forEach(check);
});
