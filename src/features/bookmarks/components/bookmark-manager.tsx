import { useState } from 'react';
import { Sidebar } from './sidebar';
import { BookmarkHeader } from './bookmark-header';
import { BookmarkList } from './bookmark-list';
import type { ViewType } from '@/lib/types';
import { useAppSelector } from '@/store';
import { selectors } from '@/store/slices/bookmarks-slice';
import { Button } from '@/components/ui/button';

export function BookmarkManager() {
  const [viewType, setViewType] = useState<ViewType>('domain');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Get bookmarks from Redux store
  const bookmarks = useAppSelector(selectors.selectAllBookmarks);
  const allTags = useAppSelector(selectors.selectAllTags);
  const domains = useAppSelector(selectors.selectAllDomains);

  // Filter bookmarks based on search query, selected tags, and selected domain
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch = searchQuery
      ? bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesTags =
      selectedTags.length > 0 ? selectedTags.every((tag) => bookmark.tags.includes(tag)) : true;

    const matchesDomain = selectedDomain ? bookmark.domain === selectedDomain : true;

    return matchesSearch && matchesTags && matchesDomain;
  });

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewChange = (view: ViewType) => {
    setViewType(view);
    // Reset selections when changing views
    if (view === 'domain') {
      setSelectedTags([]);
    } else {
      setSelectedDomain(null);
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDomainSelect = (domain: string) => {
    setSelectedDomain((prev) => (prev === domain ? null : domain));
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
    // In a real app, this would open the settings modal or navigate to settings page
  };

  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar
        viewType={viewType}
        onViewChange={handleViewChange}
        tags={allTags}
        domains={domains}
        selectedTags={selectedTags}
        selectedDomain={selectedDomain}
        onTagSelect={handleTagSelect}
        onDomainSelect={handleDomainSelect}
        onOpenSettings={handleOpenSettings}
      />
      <div className='flex flex-col flex-1 overflow-hidden'>
        <BookmarkHeader searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        <BookmarkList
          bookmarks={filteredBookmarks}
          viewType={viewType}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
        />

        {/* Settings Modal would go here in a real app */}
        {showSettings && (
          <div
            className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
            onClick={() => setShowSettings(false)}
          >
            <div
              className='bg-background p-6 rounded-lg shadow-lg max-w-md w-full'
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className='text-xl font-bold mb-4'>Settings</h2>
              <p className='mb-4'>This is where you would configure your bookmark settings.</p>
              <div className='border-t pt-4 mt-4'>
                <Button onClick={() => setShowSettings(false)}>Close Settings</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
