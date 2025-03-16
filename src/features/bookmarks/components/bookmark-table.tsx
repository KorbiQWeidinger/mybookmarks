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
import type { Bookmark } from '@/lib/types';
import { ExternalLink, Trash2 } from 'lucide-react';
import { useAppDispatch } from '@/store';
import { actions } from '@/store/slices/bookmarks-slice';

interface BookmarkTableProps {
  bookmarks: Bookmark[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export function BookmarkTable({ bookmarks, selectedTags, onTagSelect }: BookmarkTableProps) {
  const dispatch = useAppDispatch();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      dispatch(actions.deleteBookmark(id));
    }
  };

  return (
    <div className='w-full overflow-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[300px]'>Title</TableHead>
            <TableHead className='hidden md:table-cell'>Description</TableHead>
            <TableHead className='w-[300px]'>Tags</TableHead>
            <TableHead className='w-[50px]'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookmarks.map((bookmark) => (
            <TableRow key={bookmark.id}>
              <TableCell className='font-medium'>
                <div className='flex items-start gap-2'>
                  {bookmark.favicon && (
                    <img
                      src={bookmark.favicon || '/placeholder.svg'}
                      alt=''
                      className='w-4 h-4 mt-1'
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <a
                      href={bookmark.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:underline flex items-center gap-1 group'
                    >
                      <span>{bookmark.title}</span>
                      <ExternalLink className='h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity' />
                    </a>
                    <p className='text-xs text-muted-foreground'>{bookmark.domain}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className='hidden md:table-cell text-muted-foreground'>
                <p className='line-clamp-2 text-sm'>{bookmark.description}</p>
              </TableCell>
              <TableCell>
                <div className='relative'>
                  <div className='flex flex-wrap gap-1 max-h-[52px] overflow-hidden'>
                    {bookmark.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        className='cursor-pointer text-xs mb-1'
                        onClick={() => onTagSelect(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {bookmark.tags.length > 6 && (
                    <div className='absolute -bottom-1 right-0 text-xs text-muted-foreground bg-background pr-1'>
                      +{bookmark.tags.length - 6} more
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-muted-foreground hover:text-destructive'
                  onClick={() => handleDelete(bookmark.id)}
                  title='Delete bookmark'
                >
                  <Trash2 className='h-4 w-4' />
                  <span className='sr-only'>Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
