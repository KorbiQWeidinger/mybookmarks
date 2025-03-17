import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Bookmark } from '@/lib/Bookmark';
import { ExternalLink, Trash2, MoreHorizontal, Pencil } from 'lucide-react';
import { useAppDispatch } from '@/store';
import { actions } from '@/store/slices/bookmarks-slice';
import { useState } from 'react';
import { BookmarkTag } from './bookmark-tag';
import { BookmarkModal } from './bookmark-modal';

interface BookmarkTableProps {
  bookmarks: Bookmark[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export function BookmarkTable({ bookmarks, selectedTags, onTagSelect }: BookmarkTableProps) {
  const dispatch = useAppDispatch();
  const [expandedTags, setExpandedTags] = useState<string[]>([]);
  const [editingBookmarkId, setEditingBookmarkId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    dispatch(actions.deleteBookmark(id));
  };

  const toggleExpandTags = (bookmarkId: string) => {
    setExpandedTags((prev) =>
      prev.includes(bookmarkId) ? prev.filter((id) => id !== bookmarkId) : [...prev, bookmarkId]
    );
  };

  const handleRemoveTag = (bookmarkId: string, tagToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(actions.removeTagFromBookmark({ bookmarkId, tag: tagToRemove }));
  };

  const handleEdit = (bookmarkId: string) => {
    setEditingBookmarkId(bookmarkId);
  };

  const handleCloseEditModal = () => {
    setEditingBookmarkId(null);
  };

  return (
    <div className='w-full overflow-x-auto overflow-y-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[300px] max-w-[400px]'>Title</TableHead>
            <TableHead className='hidden md:table-cell w-[300px] max-w-[400px]'>
              Description
            </TableHead>
            <TableHead className='w-[600px]'>Tags</TableHead>
            <TableHead className='w-[100px]'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookmarks.map((bookmark) => {
            const isExpanded = expandedTags.includes(bookmark.id);
            const displayTags = isExpanded ? bookmark.tags : bookmark.tags.slice(0, 4);
            const hiddenTagsCount = bookmark.tags.length - 4;

            return (
              <TableRow key={bookmark.url}>
                <TableCell className='font-medium'>
                  <div className='flex items-start gap-2'>
                    {bookmark.favicon && (
                      <img
                        src={bookmark.favicon || ''}
                        alt=''
                        className='w-4 h-4 mt-1 flex-shrink-0'
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    {bookmark.favicon === null && (
                      <div className='w-4 h-4 mt-1 bg-muted rounded-full flex-shrink-0' />
                    )}
                    <div className='min-w-0'>
                      <a
                        href={bookmark.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:underline flex items-center gap-1 group'
                      >
                        <span className='truncate block max-w-[250px]'>{bookmark.title}</span>
                        <ExternalLink className='h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0' />
                      </a>
                      <p className='text-xs text-muted-foreground truncate max-w-[250px]'>
                        {bookmark.domain}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='hidden md:table-cell text-muted-foreground'>
                  <p className='truncate text-sm max-w-[250px]' title={bookmark.description}>
                    {bookmark.description}
                  </p>
                </TableCell>
                <TableCell>
                  <div className='flex flex-wrap gap-1'>
                    {displayTags.map((tag) => (
                      <BookmarkTag
                        key={tag}
                        tag={tag}
                        bookmarkId={bookmark.id}
                        isSelected={selectedTags.includes(tag)}
                        onClick={onTagSelect}
                        onRemove={(tagToRemove, e) => handleRemoveTag(bookmark.id, tagToRemove, e)}
                      />
                    ))}
                    {!isExpanded && hiddenTagsCount > 0 && (
                      <Badge
                        variant='secondary'
                        className='cursor-pointer text-xs mb-1'
                        onClick={() => toggleExpandTags(bookmark.id)}
                      >
                        +{hiddenTagsCount} more
                      </Badge>
                    )}
                    {isExpanded && bookmark.tags.length > 4 && (
                      <Badge
                        variant='secondary'
                        className='cursor-pointer text-xs mb-1'
                        onClick={() => toggleExpandTags(bookmark.id)}
                      >
                        Show less
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center justify-end gap-1'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-muted-foreground'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleEdit(bookmark.id)}>
                          <Pencil className='h-4 w-4 mr-2' />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(bookmark.id)}
                          className='text-destructive focus:text-destructive'
                        >
                          <Trash2 className='h-4 w-4 mr-2' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Edit Modal */}
      {editingBookmarkId && (
        <BookmarkModal
          isOpen={!!editingBookmarkId}
          onClose={handleCloseEditModal}
          bookmarkId={editingBookmarkId}
        />
      )}
    </div>
  );
}
