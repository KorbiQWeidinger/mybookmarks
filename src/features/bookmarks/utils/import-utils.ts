/**
 * Utility functions for importing bookmarks
 */

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
          if (folderName && folderName !== 'Bookmarks' && folderName !== 'bookmarks-bar') {
            tags.push(folderName.toLowerCase().replace(/\s+/g, '-'));
          }

          // Move up to parent DL element
          currentElement = currentElement.parentElement;
        }

        // Remove duplicates
        const uniqueTags = [...new Set(tags)];

        bookmarks.push({
          title,
          url,
          description: '',
          domain,
          tags: uniqueTags,
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
 * Validate if a file is a valid HTML bookmark file
 */
export const isValidBookmarkFile = (file: File): boolean => {
  return file.type === 'text/html' || file.name.endsWith('.html');
};
