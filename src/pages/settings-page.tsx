import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch } from '@/store';
import { actions } from '@/store/slices/bookmarks-slice';
import { useState } from 'react';
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

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteAllBookmarks = () => {
    dispatch(actions.clearAllBookmarks());
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className='container py-8'>
      <h1 className='text-3xl font-bold mb-6'>Settings</h1>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Bookmarks</CardTitle>
          <CardDescription>Manage your bookmark data</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>Delete All Bookmarks</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your bookmarks.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAllBookmarks}>Delete All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};
