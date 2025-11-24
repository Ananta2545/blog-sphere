import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface EditorState {
  editingPostId: number | null;
  title: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED';
  selectedCategoryIds: number[];
  readingTimeMins: number;
  setEditingPost: (postId: number | null) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setStatus: (status: 'DRAFT' | 'PUBLISHED') => void;
  setSelectedCategories: (categoryIds: number[]) => void;
  setReadingTimeMins: (mins: number) => void;
  resetEditor: () => void;
}

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isCategoryModalOpen: boolean;
  setIsCategoryModalOpen: (isOpen: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

interface FilterState {
  searchQuery: string;
  selectedCategorySlug: string | null;
  statusFilter: 'all' | 'DRAFT' | 'PUBLISHED';
  currentPage: number;
  setSearchQuery: (query: string) => void;
  setSelectedCategorySlug: (slug: string | null) => void;
  setStatusFilter: (status: 'all' | 'DRAFT' | 'PUBLISHED') => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
}

interface AppStore extends EditorState, UIState, FilterState {}

export const useAppStore = create<AppStore>()(
  devtools((set) => ({
    editingPostId: null,
    title: '',
    content: '',
    status: 'DRAFT',
    selectedCategoryIds: [],
    readingTimeMins: 5,
    setEditingPost: (postId) => set({ editingPostId: postId }),
    setTitle: (title) => set({ title }),
    setContent: (content) => set({ content }),
    setStatus: (status) => set({ status }),
    setSelectedCategories: (categoryIds) => set({ selectedCategoryIds: categoryIds }),
    setReadingTimeMins: (mins) => set({ readingTimeMins: mins }),
    resetEditor: () => set({
      editingPostId: null,
      title: '',
      content: '',
      status: 'DRAFT',
      selectedCategoryIds: [],
      readingTimeMins: 5,
    }),
    isSidebarOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    isCategoryModalOpen: false,
    setIsCategoryModalOpen: (isOpen) => set({ isCategoryModalOpen: isOpen }),
    theme: 'light',
    toggleTheme: () => set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(newTheme);
      }
      return { theme: newTheme };
    }),
    setTheme: (theme: 'light' | 'dark') => set(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
      }
      return { theme };
    }),
    searchQuery: '',
    selectedCategorySlug: null,
    statusFilter: 'PUBLISHED',
    currentPage: 1,
    setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
    setSelectedCategorySlug: (slug) => set({ selectedCategorySlug: slug, currentPage: 1 }),
    setStatusFilter: (status) => set({ statusFilter: status, currentPage: 1 }),
    setCurrentPage: (page) => set({ currentPage: page }),
    resetFilters: () => set({
      searchQuery: '',
      selectedCategorySlug: null,
      statusFilter: 'PUBLISHED',
      currentPage: 1,
    }),
  }))
);

import { useShallow } from 'zustand/react/shallow';
export const useEditorState = () => useAppStore(
  useShallow((state) => ({
    editingPostId: state.editingPostId,
    title: state.title,
    content: state.content,
    status: state.status,
    selectedCategoryIds: state.selectedCategoryIds,
    readingTimeMins: state.readingTimeMins,
    setEditingPost: state.setEditingPost,
    setTitle: state.setTitle,
    setContent: state.setContent,
    setStatus: state.setStatus,
    setSelectedCategories: state.setSelectedCategories,
    setReadingTimeMins: state.setReadingTimeMins,
    resetEditor: state.resetEditor,
  }))
);

export const useFilterState = () => useAppStore(
  useShallow((state) => ({
    searchQuery: state.searchQuery,
    selectedCategorySlug: state.selectedCategorySlug,
    statusFilter: state.statusFilter,
    currentPage: state.currentPage,
    setSearchQuery: state.setSearchQuery,
    setSelectedCategorySlug: state.setSelectedCategorySlug,
    setStatusFilter: state.setStatusFilter,
    setCurrentPage: state.setCurrentPage,
    resetFilters: state.resetFilters,
  }))
);

export const useUIState = () => useAppStore(
  useShallow((state) => ({
    isSidebarOpen: state.isSidebarOpen,
    toggleSidebar: state.toggleSidebar,
    isCategoryModalOpen: state.isCategoryModalOpen,
    setIsCategoryModalOpen: state.setIsCategoryModalOpen,
    theme: state.theme,
    toggleTheme: state.toggleTheme,
    setTheme: state.setTheme,
  }))
);

export const useTheme = () => useAppStore(
  useShallow((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme,
    setTheme: state.setTheme,
  }))
);
