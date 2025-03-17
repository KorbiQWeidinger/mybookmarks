import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModeToggle } from '@/components/mode-toggle';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Download } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector((state) => state.bookmarks.bookmarks);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteAllBookmarks = () => {
    dispatch(actions.clearAllBookmarks());
    setIsDeleteDialogOpen(false);
  };

  const handleDownloadBookmarks = () => {
    const date = new Date().toISOString().split('T')[0];
    const fileName = `mybookmarks_${date}.json`;
    const bookmarksJson = JSON.stringify(bookmarks, null, 2);

    // Create a blob and download link
    const blob = new Blob([bookmarksJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create download link and trigger click
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className='space-y-4 py-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='theme-toggle'>Theme</Label>
            <ModeToggle />
          </div>

          <div className='pt-4 border-t'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-medium'>Bookmarks</h3>
              <div className='flex gap-2'>
                <Button variant='outline' size='sm' onClick={handleDownloadBookmarks}>
                  <Download className='h-4 w-4 mr-2' />
                  Export
                </Button>
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant='destructive' size='sm'>
                      Clear All Bookmarks
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your
                        bookmarks.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAllBookmarks}>
                        Delete All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
