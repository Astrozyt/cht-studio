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
    languages: { shortform: string; language: string }[];
    addLanguage: (shortform: string, language: string) => void;
    removeLanguage: (shortform: string) => void;
    initLanguages: (langs: { shortform: string; language: string }[]) => void;
};

export const useFormStore = create<State>()(
    devtools((set, get) => ({
        languages: [],
        initLanguages: (langs: { shortform: string; language: string }[]) => set(() => ({ languages: langs })),
        addLanguage: (shortform: string, language: string) => {
            if (get().languages.some(lang => lang.shortform === shortform)) {
                throw new Error(`Shortforms must be unique. Language with shortform "${shortform}" already exists.`);
            }
            if (!language) {
                throw new Error(`Language name cannot be empty.`);
            }
            if (!shortform || shortform.length != 2) {
                throw new Error(`Shortform must be exactly 2 characters.`);
            }
            set((state) => ({
                languages: [...state.languages, { shortform, language }]
            }));
        },
        removeLanguage: (shortform: string) => {
            set((state) => ({
                languages: state.languages.filter(lang => lang.shortform !== shortform)
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

export const useExistingNodesStore = create<{ existingNodes: Node[]; setExistingNodes: (nodes: Node[]) => void }>()(
    devtools(
        (set) => ({
            existingNodes: [],
            setExistingNodes: (nodes) => set({ existingNodes: nodes })
        })
    )
);
