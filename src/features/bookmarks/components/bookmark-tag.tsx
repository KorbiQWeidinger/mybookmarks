import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { X, Trash2, Pencil, Check } from 'lucide-react';
import { MouseEvent, useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/store';
import { actions } from '@/store/slices/bookmarks-slice';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface BookmarkTagProps {
  tag: string;
  count?: number;
  isSelected?: boolean;
  bookmarkId?: string;
  onClick?: (tag: string) => void;
  onRemove?: (tag: string, e: MouseEvent) => void;
  variant?: 'x' | 'trash';
  allTags?: { id: string; name: string; count: number }[];
  className?: string;
}

export function BookmarkTag({
  tag,
  count,
  isSelected = false,
  bookmarkId,
  onClick,
  onRemove,
  variant = 'x',
  allTags = [],
  className,
}: BookmarkTagProps) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(tag);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRemove = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (variant === 'trash') {
      // For sidebar tags, show confirmation dialog
      setShowDeleteDialog(true);
    } else if (bookmarkId && onRemove) {
      // For individual bookmark tags
      onRemove(tag, e);
    } else if (bookmarkId) {
      // Direct dispatch if no onRemove handler
      dispatch(actions.removeTagFromBookmark({ bookmarkId, tag }));
    }
  };

  const confirmDeleteTag = () => {
    dispatch(actions.deleteTagFromAllBookmarks(tag));
    setShowDeleteDialog(false);
  };

  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditing(true);
  };

  const saveTagEdit = (newTag: string) => {
    if (newTag.trim() && newTag !== tag) {
      // Check if tag already exists
      const tagExists = allTags.some((t) => t.name === newTag);

      if (tagExists) {
        setEditValue(newTag);
        setShowMergeDialog(true);
        return;
      }

      if (bookmarkId) {
        // For individual bookmark tags
        // First remove the old tag
        dispatch(actions.removeTagFromBookmark({ bookmarkId, tag }));

        // Then add the new tag
        dispatch(actions.addTagToBookmark({ bookmarkId, tag: newTag.trim() }));
      } else {
        // Update tag across all bookmarks
        dispatch(actions.updateTagInAllBookmarks({ oldTag: tag, newTag }));
      }
    }

    setIsEditing(false);
  };

  const handleSave = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    saveTagEdit(editValue.trim());
  };

  const confirmMergeTag = () => {
    if (editValue.trim() && editValue !== tag) {
      dispatch(actions.updateTagInAllBookmarks({ oldTag: tag, newTag: editValue.trim() }));
    }
    setShowMergeDialog(false);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTagEdit(editValue.trim());
    } else if (e.key === 'Escape') {
      setEditValue(tag);
      setIsEditing(false);
    }
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div className='flex items-center mb-1 max-w-[150px]' onClick={(e) => e.stopPropagation()}>
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => saveTagEdit(editValue.trim())}
          className='h-6 text-xs py-0 px-2'
          onClick={(e) => e.stopPropagation()}
        />
        <Button
          variant='ghost'
          size='icon-sm'
          className='h-6 w-6 p-0 ml-1 hover:bg-muted/60 rounded-sm'
          onClick={handleSave}
          title='Save tag'
          type='button'
        >
          <Check size={12} />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Badge
        variant={isSelected ? 'default' : 'outline'}
        className={cn(
          'cursor-pointer text-xs mb-1 group relative transition-all duration-200',
          'inline-flex items-center hover:pr-12',
          className
        )}
        onClick={onClick ? () => onClick(tag) : undefined}
      >
        <span>
          {tag}
          {count !== undefined && ` (${count})`}
        </span>
        <div className='absolute right-1 flex items-center h-full opacity-0 group-hover:opacity-100 transition-opacity'>
          <Button
            variant='ghost'
            size='icon-sm'
            className={cn(
              'p-0 h-3 pl-3 pr-2 w-3 hover:bg-muted/60 rounded-sm',
              'hover:text-muted-foreground hover:bg-none'
            )}
            onClick={handleEdit}
            onMouseDown={(e) => e.stopPropagation()}
            title='Edit tag'
            type='button'
          >
            <Pencil size={10} />
          </Button>
          <Button
            variant='ghost'
            size='icon-sm'
            className={cn(
              'p-0 px-1 h-3 w-3 hover:bg-muted/60 rounded-sm ml-1 hover:bg-none',
              variant === 'trash' ? 'hover:text-destructive' : 'hover:text-muted-foreground'
            )}
            onClick={handleRemove}
            onMouseDown={(e) => e.stopPropagation()}
            title='Remove tag'
            type='button'
          >
            {variant === 'x' ? <X size={14} /> : <Trash2 size={10} />}
          </Button>
        </div>
      </Badge>

      {/* Merge Tag Dialog */}
      <AlertDialog open={showMergeDialog} onOpenChange={setShowMergeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Merge tags</AlertDialogTitle>
            <AlertDialogDescription>
              The tag "{editValue}" already exists. Do you want to merge "{tag}" into "{editValue}"?
              This will remove "{tag}" and keep "{editValue}" in all bookmarks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMergeTag}>Merge Tags</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Tag Dialog */}
      {variant === 'trash' && (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete tag</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the tag "{tag}" from all bookmarks? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteTag}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
