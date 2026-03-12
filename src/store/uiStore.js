import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set) => ({
      isDark: true,
      sidebarOpen: true,
      aiDrawerOpen: false,
      activeTab: 'canvas', // 'canvas' | 'pdf' | 'split'
      selectedTool: 'pen', // 'pen' | 'highlighter' | 'eraser' | 'select' | 'text' | 'rect' | 'circle' | 'arrow'
      penColor: '#e0e0e0',
      penSize: 3,
      highlighterColor: '#eab308',
      highlighterOpacity: 0.4,
      eraserSize: 20,
      showTemplateSelector: false,

      toggleTheme: () => set(state => {
        const isDark = !state.isDark;
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDark };
      }),

      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
      toggleAIDrawer: () => set(state => ({ aiDrawerOpen: !state.aiDrawerOpen })),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedTool: (tool) => set({ selectedTool: tool }),
      setPenColor: (color) => set({ penColor: color }),
      setPenSize: (size) => set({ penSize: size }),
      setHighlighterColor: (color) => set({ highlighterColor: color }),
      setEraserSize: (size) => set({ eraserSize: size }),
      setShowTemplateSelector: (show) => set({ showTemplateSelector: show }),
    }),
    {
      name: 'studypad-ui',
      partialize: (state) => ({
        isDark: state.isDark,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
