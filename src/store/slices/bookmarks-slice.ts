import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Bookmark } from '@/lib/Bookmark';

// Load bookmarks from localStorage if available
const loadBookmarksFromStorage = (): Record<string, Bookmark> => {
  try {
    const storedBookmarks = localStorage.getItem('bookmarks');
    if (storedBookmarks) {
      const parsedBookmarks = JSON.parse(storedBookmarks);

      // If the stored data is an array (old format), convert it to dictionary
      if (Array.isArray(parsedBookmarks)) {
        return parsedBookmarks.reduce(
          (acc, bookmark: Bookmark) => {
            acc[bookmark.url] = {
              ...bookmark,
              createdAt: new Date(bookmark.createdAt),
            };
            return acc;
          },
          {} as Record<string, Bookmark>
        );
      }

      // If it's already a dictionary, just convert dates
      const bookmarkDict: Record<string, Bookmark> = {};
      Object.keys(parsedBookmarks).forEach((url) => {
        bookmarkDict[url] = {
          ...parsedBookmarks[url],
          createdAt: new Date(parsedBookmarks[url].createdAt),
        };
      });
      return bookmarkDict;
    }
  } catch (error) {
    console.error('Failed to load bookmarks from localStorage:', error);
  }
  // Return empty object if no bookmarks are found in localStorage
  return {};
};

// Save bookmarks to localStorage
const saveBookmarksToStorage = (bookmarks: Record<string, Bookmark>) => {
  try {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Failed to save bookmarks to localStorage:', error);
  }
};

interface BookmarksState {
  bookmarks: Record<string, Bookmark>;
}

const initialState: BookmarksState = {
  bookmarks: loadBookmarksFromStorage(),
};

export const { actions, reducer } = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    addBookmark: (state, action: PayloadAction<Omit<Bookmark, 'id'>>) => {
      // Check if bookmark with this URL already exists
      if (state.bookmarks[action.payload.url]) {
        // Bookmark already exists, don't add it again
        return;
      }

      const newBookmark: Bookmark = {
        ...action.payload,
        id: crypto.randomUUID(),
      };

      // Add to dictionary with URL as key
      state.bookmarks[action.payload.url] = newBookmark;
      saveBookmarksToStorage(state.bookmarks);
    },
    updateBookmark: (state, action: PayloadAction<Bookmark>) => {
      const oldUrl = Object.keys(state.bookmarks).find(
        (url) => state.bookmarks[url].id === action.payload.id
      );

      if (oldUrl) {
        // If URL has changed, remove the old entry
        if (oldUrl !== action.payload.url) {
          delete state.bookmarks[oldUrl];
        }

        // Add/update with the new URL as key
        state.bookmarks[action.payload.url] = action.payload;
        saveBookmarksToStorage(state.bookmarks);
      }
    },
    deleteBookmark: (state, action: PayloadAction<string>) => {
      // Find the URL for this bookmark ID
      const url = Object.keys(state.bookmarks).find(
        (url) => state.bookmarks[url].id === action.payload
      );

      if (url) {
        delete state.bookmarks[url];
        saveBookmarksToStorage(state.bookmarks);
      }
    },
    removeTagFromBookmark: (state, action: PayloadAction<{ bookmarkId: string; tag: string }>) => {
      const { bookmarkId, tag } = action.payload;
      const url = Object.keys(state.bookmarks).find(
        (url) => state.bookmarks[url].id === bookmarkId
      );

      if (url) {
        state.bookmarks[url].tags = state.bookmarks[url].tags.filter((t) => t !== tag);
        saveBookmarksToStorage(state.bookmarks);
      }
    },
    addTagToBookmark: (state, action: PayloadAction<{ bookmarkId: string; tag: string }>) => {
      const { bookmarkId, tag } = action.payload;
      const url = Object.keys(state.bookmarks).find(
        (url) => state.bookmarks[url].id === bookmarkId
      );

      if (url && tag.trim() && !state.bookmarks[url].tags.includes(tag)) {
        state.bookmarks[url].tags.push(tag);
        saveBookmarksToStorage(state.bookmarks);
      }
    },
    deleteTagFromAllBookmarks: (state, action: PayloadAction<string>) => {
      const tagToDelete = action.payload;

      Object.keys(state.bookmarks).forEach((url) => {
        state.bookmarks[url].tags = state.bookmarks[url].tags.filter((tag) => tag !== tagToDelete);
      });

      saveBookmarksToStorage(state.bookmarks);
    },
    updateTagInAllBookmarks: (state, action: PayloadAction<{ oldTag: string; newTag: string }>) => {
      const { oldTag, newTag } = action.payload;

      if (oldTag === newTag || !newTag.trim()) {
        return;
      }

      Object.keys(state.bookmarks).forEach((url) => {
        if (state.bookmarks[url].tags.includes(oldTag)) {
          // Remove the old tag and add the new one if it doesn't already exist
          state.bookmarks[url].tags = state.bookmarks[url].tags
            .filter((tag) => tag !== oldTag)
            .concat(state.bookmarks[url].tags.includes(newTag) ? [] : [newTag]);
        }
      });

      saveBookmarksToStorage(state.bookmarks);
    },
    clearAllBookmarks: (state) => {
      state.bookmarks = {};
      saveBookmarksToStorage(state.bookmarks);
    },
  },
});

export const selectors = {
  selectAllBookmarks: (state: RootState) => Object.values(state.bookmarks.bookmarks),
  selectBookmarkById: (state: RootState, id: string) => {
    const url = Object.keys(state.bookmarks.bookmarks).find(
      (url) => state.bookmarks.bookmarks[url].id === id
    );
    return url ? state.bookmarks.bookmarks[url] : undefined;
  },
  selectBookmarksByTags: (state: RootState, tags: string[]) =>
    Object.values(state.bookmarks.bookmarks).filter((bookmark) =>
      tags.every((tag) => bookmark.tags.includes(tag))
    ),
  selectBookmarksByDomain: (state: RootState, domain: string) =>
    Object.values(state.bookmarks.bookmarks).filter((bookmark) => bookmark.domain === domain),
  selectAllTags: (state: RootState) => {
    const tagsMap = new Map<string, number>();
    Object.values(state.bookmarks.bookmarks).forEach((bookmark) => {
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
    Object.values(state.bookmarks.bookmarks).forEach((bookmark) => {
      domainsMap.set(bookmark.domain, (domainsMap.get(bookmark.domain) || 0) + 1);
    });

    return Array.from(domainsMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  },
};
