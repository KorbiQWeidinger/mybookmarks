import { Sidebar } from './sidebar';
import { BookmarkHeader } from './bookmark-header';
import { BookmarkList } from './bookmark-list';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectors as bookmarkSelectors } from '@/store/slices/bookmarks-slice';
import {
  selectors as managerSelectors,
  actions as managerActions,
} from '@/store/slices/bookmark-manager-slice';
import { SettingsModal } from '@/features/settings';
import type { ViewType } from '@/lib/Bookmark';

export function BookmarkContainer() {
  const dispatch = useAppDispatch();

  // Get state from Redux store
  const viewType = useAppSelector(managerSelectors.selectViewType);
  const searchQuery = useAppSelector(managerSelectors.selectSearchQuery);
  const selectedTags = useAppSelector(managerSelectors.selectSelectedTags);
  const selectedDomain = useAppSelector(managerSelectors.selectSelectedDomain);
  const isSettingsOpen = useAppSelector(managerSelectors.selectIsSettingsOpen);

  // Get bookmarks from Redux store
  const bookmarks = useAppSelector(bookmarkSelectors.selectAllBookmarks);
  const allTags = useAppSelector(bookmarkSelectors.selectAllTags);
  const domains = useAppSelector(bookmarkSelectors.selectAllDomains);

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
      selectedTags.length > 0
        ? selectedTags.every((tagId) => {
            // Find the tag name from the ID
            const tagName = allTags.find((t) => t.id === tagId)?.name;
            return tagName ? bookmark.tags.includes(tagName) : false;
          })
        : true;

    const matchesDomain = selectedDomain ? bookmark.domain === selectedDomain : true;

    return matchesSearch && matchesTags && matchesDomain;
  });

  // Sort bookmarks by domain
  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => a.domain.localeCompare(b.domain));

  const handleSearchChange = (query: string) => {
    dispatch(managerActions.setSearchQuery(query));
  };

  const handleViewChange = (view: ViewType) => {
    dispatch(managerActions.setViewType(view));
  };

  const handleTagSelect = (tag: string) => {
    // Find the tag ID from the tag name if it's a name
    const tagId = allTags.find((t) => t.name === tag)?.id || tag;
    dispatch(managerActions.toggleTag(tagId));
  };

  const handleDomainSelect = (domain: string) => {
    dispatch(managerActions.toggleDomain(domain));
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
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => dispatch(managerActions.setSettingsModalOpen(false))}
      />
    </div>
  );
}
