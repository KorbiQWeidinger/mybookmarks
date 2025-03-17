import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { ViewType, Tag } from '@/lib/Bookmark';
import { Bookmark, FolderKanban, Hash, Menu, Search, X, Settings } from 'lucide-react';
import { SettingsModal } from '@/features/settings';
import { useAppSelector } from '@/store';
import { selectors } from '@/store/slices/bookmarks-slice';
import { BookmarkTag } from './bookmark-tag';

interface SidebarProps {
  viewType: ViewType;
  onViewChange: (view: ViewType) => void;
  tags: Tag[];
  domains: { name: string; count: number }[];
  selectedTags: string[];
  selectedDomain: string | null;
  onTagSelect: (tag: string) => void;
  onDomainSelect: (domain: string) => void;
}

// Reusable search input component
interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

function SearchInput({ placeholder, value, onChange }: SearchInputProps) {
  return (
    <div className='relative mb-4'>
      <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='pl-8 h-9 w-full'
      />
      {value && (
        <Button
          variant='ghost'
          size='icon'
          className='absolute right-1 top-1 h-7 w-7'
          onClick={() => onChange('')}
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Clear search</span>
        </Button>
      )}
    </div>
  );
}

// Section title component
function SectionTitle({ title }: { title: string }) {
  return <h2 className='text-sm font-semibold text-muted-foreground mb-2'>{title}</h2>;
}

// Empty results component
function EmptyResults({ message }: { message: string }) {
  return <p className='text-sm text-muted-foreground text-center py-2'>{message}</p>;
}

// Domain list component
interface DomainListProps {
  domains: { name: string; count: number }[];
  selectedDomain: string | null;
  onDomainSelect: (domain: string) => void;
}

function DomainList({ domains, selectedDomain, onDomainSelect }: DomainListProps) {
  const [searchValue, setSearchValue] = useState('');

  // Filter domains based on search
  const filteredDomains = domains.filter((domain) =>
    domain.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className='space-y-2 w-full max-w-full overflow-hidden'>
      <SearchInput placeholder='Search domains...' value={searchValue} onChange={setSearchValue} />

      <SectionTitle title='Domains' />

      {filteredDomains.length > 0 ? (
        filteredDomains.map((domain) => (
          <Button
            key={domain.name}
            variant={selectedDomain === domain.name ? 'secondary' : 'ghost'}
            className='w-full justify-start text-left overflow-hidden min-w-0'
            onClick={() => onDomainSelect(domain.name)}
          >
            <div className='flex items-center w-full min-w-0'>
              <span className='truncate min-w-0 flex-1'>{domain.name}</span>
              <Badge variant='outline' className='ml-2 flex-shrink-0'>
                {domain.count}
              </Badge>
            </div>
          </Button>
        ))
      ) : (
        <EmptyResults message='No domains found' />
      )}
    </div>
  );
}

// Tag list component
interface TagListProps {
  tags: Tag[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

function TagList({ tags, selectedTags, onTagSelect }: TagListProps) {
  const [searchValue, setSearchValue] = useState('');
  const bookmarks = useAppSelector(selectors.selectAllBookmarks);

  // Filter tags based on search
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Filter out tags that don't have possible combinations with the currently selected tags
  const availableTags =
    selectedTags.length > 0
      ? filteredTags.filter((tag) => {
          // Skip if the tag is already selected
          if (selectedTags.includes(tag.id)) return true;

          // Check if there's at least one bookmark that has all selected tags AND this tag
          return bookmarks.some((bookmark) => {
            const hasAllSelectedTags = selectedTags.every((selectedTagId) => {
              const selectedTagName = tags.find((t) => t.id === selectedTagId)?.name;
              return selectedTagName ? bookmark.tags.includes(selectedTagName) : false;
            });

            // If the bookmark has all selected tags, check if it also has the current tag
            return hasAllSelectedTags && bookmark.tags.includes(tag.name);
          });
        })
      : filteredTags;

  return (
    <div className='space-y-2 w-full max-w-full overflow-hidden'>
      <SearchInput placeholder='Search tags...' value={searchValue} onChange={setSearchValue} />

      <SectionTitle title='Tags' />

      {availableTags.length > 0 ? (
        <div className='flex flex-col space-y-2'>
          {availableTags.map((tag) => (
            <BookmarkTag
              key={tag.id}
              tag={tag.name}
              count={tag.count}
              isSelected={selectedTags.includes(tag.id)}
              onClick={() => onTagSelect(tag.name)}
              variant='trash'
              className='inline-flex'
            />
          ))}
        </div>
      ) : (
        <EmptyResults message='No tags found' />
      )}
    </div>
  );
}

export function Sidebar({
  viewType,
  onViewChange,
  tags,
  domains,
  selectedTags,
  selectedDomain,
  onTagSelect,
  onDomainSelect,
}: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button
        variant='outline'
        size='icon'
        className='fixed left-4 top-4 z-50 md:hidden'
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className='h-4 w-4' /> : <Menu className='h-4 w-4' />}
      </Button>

      {/* Sidebar */}
      <div
        className={`bg-card border-r w-64 flex-shrink-0 flex flex-col h-full transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } fixed md:relative z-40`}
      >
        <div className='p-5 border-b'>
          <h1 className='text-xl font-bold flex items-center gap-2'>
            <Bookmark className='h-5 w-5' />
            Bookmarks
          </h1>
        </div>

        <div className='p-4 border-b'>
          <Tabs
            defaultValue={viewType}
            value={viewType}
            onValueChange={(value) => onViewChange(value as ViewType)}
            className='w-full'
          >
            <TabsList className='grid grid-cols-2 w-full'>
              <TabsTrigger value='domain' className='flex items-center gap-1'>
                <FolderKanban className='h-4 w-4' />
                Domains
              </TabsTrigger>
              <TabsTrigger value='tag' className='flex items-center gap-1'>
                <Hash className='h-4 w-4' />
                Tags
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className='flex-1 overflow-hidden'>
          <ScrollArea className='h-full w-full px-4 py-4'>
            <style>{`
              [data-radix-scroll-area-viewport] > div {
                display: block !important;
                min-width: 0 !important;
              }
            `}</style>
            {viewType === 'domain' ? (
              <DomainList
                domains={domains}
                selectedDomain={selectedDomain}
                onDomainSelect={onDomainSelect}
              />
            ) : (
              <TagList tags={tags} selectedTags={selectedTags} onTagSelect={onTagSelect} />
            )}
          </ScrollArea>
        </div>

        {/* Settings button at bottom of sidebar */}
        <div className='border-t p-4'>
          <Button
            variant='ghost'
            className='w-full justify-start gap-2'
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className='h-4 w-4' />
            <span>Settings</span>
          </Button>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
