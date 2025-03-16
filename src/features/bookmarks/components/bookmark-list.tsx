import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookmarkTable } from './bookmark-table';
import { Button } from '@/components/ui/button';
import { Import } from 'lucide-react';
import { BookmarkImportModal } from './bookmark-import-modal';
import type { Bookmark, ViewType } from '@/lib/types';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  viewType: ViewType;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export function BookmarkList({
  bookmarks,
  viewType,
  selectedTags,
  onTagSelect,
}: BookmarkListProps) {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Group bookmarks by domain if in domain view
  const groupedBookmarks =
    viewType === 'domain'
      ? bookmarks.reduce(
          (groups, bookmark) => {
            const domain = bookmark.domain;
            if (!groups[domain]) {
              groups[domain] = [];
            }
            groups[domain].push(bookmark);
            return groups;
          },
          {} as Record<string, Bookmark[]>
        )
      : { 'All Bookmarks': bookmarks };

  // Sort bookmarks within each group alphabetically by title
  Object.keys(groupedBookmarks).forEach((domain) => {
    groupedBookmarks[domain].sort((a, b) => a.title.localeCompare(b.title));
  });

  // Sort domain groups alphabetically
  const sortedGroupEntries = Object.entries(groupedBookmarks).sort(([domainA], [domainB]) =>
    domainA.localeCompare(domainB)
  );

  return (
    <>
      <div className='flex-1 overflow-hidden'>
        <ScrollArea className='h-full'>
          <div className='p-4'>
            {sortedGroupEntries.map(([groupName, bookmarks]) => (
              <div key={groupName} className='mb-8'>
                {viewType === 'domain' && (
                  <h2 className='text-lg font-semibold mb-4 flex items-center'>
                    {bookmarks[0]?.favicon && (
                      <img
                        src={bookmarks[0].favicon || '/placeholder.svg'}
                        alt=''
                        className='w-4 h-4 mr-2'
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    {groupName}
                  </h2>
                )}
                <BookmarkTable
                  bookmarks={bookmarks}
                  selectedTags={selectedTags}
                  onTagSelect={onTagSelect}
                />
              </div>
            ))}

            {bookmarks.length === 0 && (
              <div className='flex flex-col items-center justify-center h-64 text-muted-foreground'>
                <p className='mb-4'>No bookmarks found</p>
                <Button
                  onClick={() => setIsImportModalOpen(true)}
                  className='flex items-center gap-2'
                >
                  <Import className='h-4 w-4' />
                  Import Bookmarks
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <BookmarkImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </>
  );
}
