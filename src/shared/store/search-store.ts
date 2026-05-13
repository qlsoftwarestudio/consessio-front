import { create } from "zustand";

interface SearchState {
  query: string;
  setQuery: (q: string) => void;
  clear: () => void;
}

/**
 * Estado del buscador global del header.
 * Cada página puede leerlo (useGlobalSearch) y aplicarlo a sus filtros.
 */
export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  setQuery: (q) => set({ query: q }),
  clear: () => set({ query: "" }),
}));
