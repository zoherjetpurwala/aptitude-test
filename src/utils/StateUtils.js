import { create } from "zustand"

export const useCentralStore = create((set, get) => ({
  activePage: "DASHBOARD",
  setActivePage: page => set({ activePage: page }),

  isSidebarOpen: false,
  toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),
  setIsSidebarOpen: isOpen => set({ isSidebarOpen: isOpen })
}))
