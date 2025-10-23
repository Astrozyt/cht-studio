import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export type NodeType = 'group' | 'input' | 'select' | 'select1' | 'repeat' | 'note' | 'trigger' | 'upload' | 'image' | 'audio';

export type Bind = {
    type?: string;
    required?: unknown;
    relevant?: unknown;
    constraint?: unknown;
    constraintMsg?: string;
    readonly?: boolean;
    calculate?: string;
    preload?: string;
    preloadParams?: string;
};

export type Node = {
    uid: string;
    tag: NodeType;
    ref: string;
    appearance?: string;
    labels?: { lang: string; value: string }[];
    hints?: { lang: string; value: string }[];
    items?: { value: string; labels: { lang: string; value: string }[] }[];
    bind: Bind;
    children?: Node[];
};

type State = {
    languages: { short: string; long: string }[];
    addLanguage: (short: string, long: string) => void;
    removeLanguage: (short: string) => void;
    initLanguages: (langs: { short: string; long: string }[]) => void;
};

export const useFormStore = create<State>()(
    devtools((set, get) => ({
        languages: [],
        initLanguages: (langs: { short: string; long: string }[]) => set(() => ({ languages: langs })),
        addLanguage: (short: string, long: string) => {
            if (get().languages.some(lang => lang.short === short)) {
                throw new Error(`Shortforms must be unique. Language with shortform "${short}" already exists.`);
            }
            if (!long) {
                throw new Error(`Language name cannot be empty.`);
            }
            if (!short || short.length != 2) {
                throw new Error(`Shortform must be exactly 2 characters.`);
            }
            set((state) => ({
                languages: [...state.languages, { short, long }]
            }));
        },
        removeLanguage: (short: string) => {
            set((state) => ({
                languages: state.languages.filter(lang => lang.short !== short)
            }));
        }
    }))
);

export type LocalizedKV = { lang: string; value: string };

export const emptyLocalized = (langs: string[]): LocalizedKV[] =>
    langs.map(l => ({ lang: l, value: "" }));

export const reconcileLocalized = (curr: LocalizedKV[] | undefined, langs: string[]): LocalizedKV[] => {
    const map = new Map((curr ?? []).map(x => [x.lang, x.value]));
    return langs.map(l => ({ lang: l, value: map.get(l) ?? "" }));
};

export const useExistingNodesStore = create<{ existingNodes: Node[]; setExistingNodes: (nodes: Node[]) => void; addExistingNode: (node: Node) => void }>()(
    devtools(
        (set) => ({
            existingNodes: [],
            setExistingNodes: (nodes) => set({ existingNodes: nodes }),
            addExistingNode: (node) => set((state) => ({ existingNodes: [...state.existingNodes, node] })),
        })
    )
);

export const useExistingContactFieldStore = create<{ existingContactFields: any[]; setExistingContactFields: (fields: any[]) => void }>()(
    devtools(
        (set) => ({
            existingContactFields: [],
            setExistingContactFields: (fields) => set({ existingContactFields: fields }),
        })
    )
);

export const useExistingContactSummaryFieldStore = create<{ existingContactSummaryFields: any[]; setExistingContactSummaryFields: (fields: any[]) => void }>()(
    devtools(
        (set) => ({
            existingContactSummaryFields: [],
            setExistingContactSummaryFields: (fields) => set({ existingContactSummaryFields: fields }),
        })
    )
);
