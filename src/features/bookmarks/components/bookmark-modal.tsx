import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { actions, selectors } from '@/store/slices/bookmarks-slice';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkId?: string; // Optional ID for editing existing bookmark
}

export function BookmarkModal({ isOpen, onClose, bookmarkId }: BookmarkModalProps) {
  const dispatch = useAppDispatch();
  const existingBookmark = useAppSelector((state) =>
    bookmarkId ? selectors.selectBookmarkById(state, bookmarkId) : undefined
  );

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    favicon: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Load existing bookmark data when editing
  useEffect(() => {
    if (existingBookmark) {
      setFormData({
        title: existingBookmark.title,
        url: existingBookmark.url,
        description: existingBookmark.description || '',
        favicon: existingBookmark.favicon || '',
      });
      setTags(existingBookmark.tags || []);
    } else {
      // Reset form when creating a new bookmark
      setFormData({
        title: '',
        url: '',
        description: '',
        favicon: '',
      });
      setTags([]);
    }
  }, [existingBookmark, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Extract domain from URL
    let domain = '';
    try {
      const url = new URL(formData.url);
      domain = url.hostname.replace('www.', '');
    } catch (error) {
      console.error('Invalid URL:', error);
      // Use the URL as is if it's invalid
      domain = formData.url;
    }

    // Generate default favicon URL if none provided
    const favicon = formData.favicon || `https://${domain}/favicon.ico`;

    if (existingBookmark) {
      // Update existing bookmark
      dispatch(
        actions.updateBookmark({
          ...existingBookmark,
          title: formData.title,
          url: formData.url,
          description: formData.description,
          domain,
          tags,
          favicon,
        })
      );
    } else {
      // Create new bookmark
      dispatch(
        actions.addBookmark({
          title: formData.title,
          url: formData.url,
          description: formData.description,
          domain,
          tags,
          createdAt: new Date(),
          favicon,
        })
      );
    }

    // Reset form and close modal
    setFormData({ title: '', url: '', description: '', favicon: '' });
    setTags([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{existingBookmark ? 'Edit Bookmark' : 'Add Bookmark'}</DialogTitle>
            <DialogDescription>
              {existingBookmark
                ? 'Update the details of your bookmark.'
                : 'Enter the details of the bookmark you want to save.'}
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='url'>URL</Label>
              <Input
                id='url'
                name='url'
                type='url'
                placeholder='https://example.com'
                value={formData.url}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                name='title'
                placeholder='Bookmark title'
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                name='description'
                placeholder='Add a description (optional)'
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='favicon'>Custom Favicon URL</Label>
              <Input
                id='favicon'
                name='favicon'
                type='url'
                placeholder='https://example.com/favicon.ico (optional)'
                value={formData.favicon}
                onChange={handleInputChange}
              />
              <p className='text-xs text-muted-foreground'>
                Leave empty to use the default favicon from the website
              </p>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='tags'>Tags</Label>
              <div className='flex gap-2'>
                <Input
                  id='tags'
                  placeholder='Add tags'
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button type='button' variant='outline' size='icon' onClick={handleAddTag}>
                  <Plus className='h-4 w-4' />
                  <span className='sr-only'>Add tag</span>
                </Button>
              </div>

              {tags.length > 0 && (
                <div className='flex flex-wrap gap-1 mt-2'>
                  {tags.map((tag) => (
                    <Badge key={tag} variant='secondary' className='gap-1'>
                      {tag}
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-4 w-4 p-0 hover:bg-transparent'
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className='h-3 w-3' />
                        <span className='sr-only'>Remove {tag}</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit'>{existingBookmark ? 'Update' : 'Save'} Bookmark</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
