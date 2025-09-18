import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Language = { short: string; long: string };

type State = {
    languages: Language[];
    setLanguages: (langs: Language[]) => void;
    removeLanguage: (short: string) => void;
    reset: () => void;
};

export const useLanguageStore = create<State>()(
    devtools((set) => ({
        languages: [],
        setLanguages: (langs: Language[]) => {
            set(() => ({ languages: langs }));
            //Save to local storage
        },
        removeLanguage: (short: string) => {
            set((state) => ({
                languages: state.languages.filter(lang => lang.short !== short)
            }));
        },
        reset: () => set(() => ({ languages: [] }))
    }))
);