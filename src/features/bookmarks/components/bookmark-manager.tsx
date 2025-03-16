import { useState } from 'react';
import { Sidebar } from './sidebar';
import { BookmarkHeader } from './bookmark-header';
import { BookmarkList } from './bookmark-list';
import type { ViewType } from '@/lib/types';
import { useAppSelector } from '@/store';
import { selectors } from '@/store/slices/bookmarks-slice';
import { SettingsModal } from '@/features/settings';

export function BookmarkManager() {
  const [viewType, setViewType] = useState<ViewType>('domain');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Get bookmarks from Redux store
  const bookmarks = useAppSelector(selectors.selectAllBookmarks);
  const allTags = useAppSelector(selectors.selectAllTags);
  const domains = useAppSelector(selectors.selectAllDomains);

  // Sort tags and domains alphabetically
  const sortedTags = [...allTags].sort((a, b) => a.name.localeCompare(b.name));
  const sortedDomains = [...domains].sort((a, b) => a.name.localeCompare(b.name));

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

  // Sort bookmarks by domain
  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => a.domain.localeCompare(b.domain));

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

  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar
        viewType={viewType}
        onViewChange={handleViewChange}
        tags={sortedTags}
        domains={sortedDomains}
        selectedTags={selectedTags}
        selectedDomain={selectedDomain}
        onTagSelect={handleTagSelect}
        onDomainSelect={handleDomainSelect}
      />
      <div className='flex flex-col flex-1 overflow-hidden'>
        <BookmarkHeader searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        <BookmarkList
          bookmarks={sortedBookmarks}
          viewType={viewType}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
