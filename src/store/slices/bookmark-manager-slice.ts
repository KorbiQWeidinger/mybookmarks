import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { ViewType } from '@/lib/Bookmark';

// Load manager state from localStorage if available
const loadManagerStateFromStorage = (): BookmarkManagerState => {
  try {
    const storedState = localStorage.getItem('bookmarkManager');
    if (storedState) {
      return JSON.parse(storedState);
    }
  } catch (error) {
    console.error('Failed to load bookmark manager state from localStorage:', error);
  }
  // Return default state if nothing in localStorage
  return {
    viewType: 'domain',
    searchQuery: '',
    selectedTags: [],
    selectedDomain: null,
    isSettingsOpen: false,
  };
};

// Save manager state to localStorage
const saveManagerStateToStorage = (state: BookmarkManagerState) => {
  try {
    localStorage.setItem('bookmarkManager', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save bookmark manager state to localStorage:', error);
  }
};

interface BookmarkManagerState {
  viewType: ViewType;
  searchQuery: string;
  selectedTags: string[];
  selectedDomain: string | null;
  isSettingsOpen: boolean;
}

const initialState: BookmarkManagerState = loadManagerStateFromStorage();

export const { actions, reducer } = createSlice({
  name: 'bookmarkManager',
  initialState,
  reducers: {
    setViewType: (state, action: PayloadAction<ViewType>) => {
      state.viewType = action.payload;
      // Reset selections when changing views
      if (action.payload === 'domain') {
        state.selectedTags = [];
      } else {
        state.selectedDomain = null;
      }
      saveManagerStateToStorage(state);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      saveManagerStateToStorage(state);
    },
    toggleTag: (state, action: PayloadAction<string>) => {
      const tagId = action.payload;
      state.selectedTags = state.selectedTags.includes(tagId)
        ? state.selectedTags.filter((t) => t !== tagId)
        : [...state.selectedTags, tagId];
      saveManagerStateToStorage(state);
    },
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload;
      saveManagerStateToStorage(state);
    },
    toggleDomain: (state, action: PayloadAction<string>) => {
      state.selectedDomain = state.selectedDomain === action.payload ? null : action.payload;
      saveManagerStateToStorage(state);
    },
    setSelectedDomain: (state, action: PayloadAction<string | null>) => {
      state.selectedDomain = action.payload;
      saveManagerStateToStorage(state);
    },
    toggleSettingsModal: (state) => {
      state.isSettingsOpen = !state.isSettingsOpen;
      saveManagerStateToStorage(state);
    },
    setSettingsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSettingsOpen = action.payload;
      saveManagerStateToStorage(state);
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedTags = [];
      state.selectedDomain = null;
      saveManagerStateToStorage(state);
    },
  },
});

export const selectors = {
  selectViewType: (state: RootState) => state.bookmarkManager.viewType,
  selectSearchQuery: (state: RootState) => state.bookmarkManager.searchQuery,
  selectSelectedTags: (state: RootState) => state.bookmarkManager.selectedTags,
  selectSelectedDomain: (state: RootState) => state.bookmarkManager.selectedDomain,
  selectIsSettingsOpen: (state: RootState) => state.bookmarkManager.isSettingsOpen,
};
