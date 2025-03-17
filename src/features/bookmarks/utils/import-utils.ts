/**
 * Utility functions for importing bookmarks
 */

import { Bookmark } from '@/lib/Bookmark';

/**
 * Parse bookmarks from HTML file exported from Chrome
 */
export const parseBookmarksFromHtml = (html: string, onProgress?: (progress: number) => void) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Find all bookmark links
  const links = doc.querySelectorAll('a');
  const bookmarks = [];
  const totalLinks = links.length;

  // Process each link
  for (let i = 0; i < totalLinks; i++) {
    const link = links[i];
    const url = link.getAttribute('href');
    const title = link.textContent?.trim() || '';

    if (url && title && url.startsWith('http')) {
      try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace('www.', '');

        // Extract folder structure as tags
        const tags: string[] = [];

        // Find parent folders (DL > DT > H3 elements)
        let currentElement = link.parentElement;
        while (currentElement) {
          // Look for H3 elements which are folder names in Chrome bookmarks
          const folderName = currentElement.querySelector('h3')?.textContent?.trim();

          if (folderName) {
            tags.push(folderName.toLowerCase().replace(/\s+/g, '-'));
          }

          // Move up to parent DL element
          currentElement = currentElement.parentElement;
        }

        // Remove duplicates
        const uniqueTags = [...new Set(tags)];

        // Remove some tags that are not useful
        const filteredTags = uniqueTags.filter(
          (tag) => !tag.includes('chrome') && !tag.includes('bookmarks')
        );

        bookmarks.push({
          title,
          url,
          description: '',
          domain,
          tags: filteredTags,
          createdAt: new Date(),
          favicon: `https://${domain}/favicon.ico`,
        });
      } catch (error) {
        console.error('Invalid URL:', url, error);
      }
    }

    // Update progress
    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalLinks) * 100));
    }
  }

  return bookmarks;
};

/**
 * Parse bookmarks from JSON file exported from the app
 */
export const parseBookmarksFromJson = (json: string, onProgress?: (progress: number) => void) => {
  try {
    const data = JSON.parse(json);
    const bookmarks: Partial<Bookmark>[] = [];
    const entries = Object.entries(data);
    const totalEntries = entries.length;

    for (let i = 0; i < totalEntries; i++) {
      const [_, bookmark] = entries[i] as [string, Partial<Bookmark>];

      // Ensure the bookmark has all required fields
      if (bookmark && bookmark.title && bookmark.url) {
        // Convert createdAt string back to Date object
        const processedBookmark = {
          ...bookmark,
          createdAt: bookmark.createdAt ? new Date(bookmark.createdAt.toString()) : new Date(),
        };

        bookmarks.push(processedBookmark);
      }

      // Update progress
      if (onProgress) {
        onProgress(Math.round(((i + 1) / totalEntries) * 100));
      }
    }

    return bookmarks;
  } catch (error) {
    console.error('Error parsing JSON bookmarks:', error);
    return [];
  }
};

/**
 * Validate if a file is a valid bookmark file
 */
export const isValidBookmarkFile = (file: File): boolean => {
  return (
    file.type === 'text/html' ||
    file.name.endsWith('.html') ||
    file.type === 'application/json' ||
    file.name.endsWith('.json')
  );
};

/**
 * Determine the type of bookmark file
 */
export const getBookmarkFileType = (file: File): 'html' | 'json' | null => {
  if (file.type === 'text/html' || file.name.endsWith('.html')) {
    return 'html';
  } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
    return 'json';
  }
  return null;
};
