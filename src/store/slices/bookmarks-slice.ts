import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Bookmark } from '@/lib/types';

// Load bookmarks from localStorage if available
const loadBookmarksFromStorage = (): Bookmark[] => {
  try {
    const storedBookmarks = localStorage.getItem('bookmarks');
    if (storedBookmarks) {
      const parsedBookmarks = JSON.parse(storedBookmarks);
      // Convert string dates back to Date objects
      return parsedBookmarks.map((bookmark: Bookmark) => ({
        ...bookmark,
        createdAt: new Date(bookmark.createdAt),
      }));
    }
  } catch (error) {
    console.error('Failed to load bookmarks from localStorage:', error);
  }
  // Return empty array if no bookmarks are found in localStorage
  return [];
};

// Save bookmarks to localStorage
const saveBookmarksToStorage = (bookmarks: Bookmark[]) => {
  try {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Failed to save bookmarks to localStorage:', error);
  }
};

interface BookmarksState {
  bookmarks: Bookmark[];
}

const initialState: BookmarksState = {
  bookmarks: loadBookmarksFromStorage(),
};

export const { actions, reducer } = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    addBookmark: (state, action: PayloadAction<Omit<Bookmark, 'id'>>) => {
      const newBookmark: Bookmark = {
        ...action.payload,
        id: crypto.randomUUID(),
      };
      state.bookmarks.push(newBookmark);
      saveBookmarksToStorage(state.bookmarks);
    },
    updateBookmark: (state, action: PayloadAction<Bookmark>) => {
      const index = state.bookmarks.findIndex((bookmark) => bookmark.id === action.payload.id);
      if (index !== -1) {
        state.bookmarks[index] = action.payload;
        saveBookmarksToStorage(state.bookmarks);
      }
    },
    deleteBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarks = state.bookmarks.filter((bookmark) => bookmark.id !== action.payload);
      saveBookmarksToStorage(state.bookmarks);
    },
    removeTagFromBookmark: (state, action: PayloadAction<{ bookmarkId: string; tag: string }>) => {
      const { bookmarkId, tag } = action.payload;
      const bookmarkIndex = state.bookmarks.findIndex((bookmark) => bookmark.id === bookmarkId);

      if (bookmarkIndex !== -1) {
        state.bookmarks[bookmarkIndex].tags = state.bookmarks[bookmarkIndex].tags.filter(
          (t) => t !== tag
        );
        saveBookmarksToStorage(state.bookmarks);
      }
    },
    deleteTagFromAllBookmarks: (state, action: PayloadAction<string>) => {
      const tagToDelete = action.payload;
      state.bookmarks = state.bookmarks.map((bookmark) => ({
        ...bookmark,
        tags: bookmark.tags.filter((tag) => tag !== tagToDelete),
      }));
      saveBookmarksToStorage(state.bookmarks);
    },
    clearAllBookmarks: (state) => {
      state.bookmarks = [];
      saveBookmarksToStorage(state.bookmarks);
    },
  },
});

export const selectors = {
  selectAllBookmarks: (state: RootState) => state.bookmarks.bookmarks,
  selectBookmarkById: (state: RootState, id: string) =>
    state.bookmarks.bookmarks.find((bookmark) => bookmark.id === id),
  selectBookmarksByTags: (state: RootState, tags: string[]) =>
    state.bookmarks.bookmarks.filter((bookmark) =>
      tags.every((tag) => bookmark.tags.includes(tag))
    ),
  selectBookmarksByDomain: (state: RootState, domain: string) =>
    state.bookmarks.bookmarks.filter((bookmark) => bookmark.domain === domain),
  selectAllTags: (state: RootState) => {
    const tagsMap = new Map<string, number>();
    state.bookmarks.bookmarks.forEach((bookmark) => {
      bookmark.tags.forEach((tag) => {
        tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagsMap.entries()).map(([name, count]) => ({
      id: name,
      name,
      count,
    }));
  },
  selectAllDomains: (state: RootState) => {
    const domainsMap = new Map<string, number>();
    state.bookmarks.bookmarks.forEach((bookmark) => {
      domainsMap.set(bookmark.domain, (domainsMap.get(bookmark.domain) || 0) + 1);
    });

    return Array.from(domainsMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  },
};
