import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/store';
import { actions } from '@/store/slices/bookmarks-slice';
import { Upload, FileUp, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  parseBookmarksFromHtml,
  parseBookmarksFromJson,
  isValidBookmarkFile,
  getBookmarkFileType,
} from '@/features/bookmarks/utils';
import { Bookmark } from '@/lib/Bookmark';

interface BookmarkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookmarkImportModal({ isOpen, onClose }: BookmarkImportModalProps) {
  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector((state) => state.bookmarks.bookmarks);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
    skipped?: number;
  } | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidBookmarkFile(droppedFile)) {
        setFile(droppedFile);
        setImportResult(null);
      } else {
        setImportResult({
          success: false,
          message: 'Please upload an HTML or JSON file.',
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (isValidBookmarkFile(selectedFile)) {
        setFile(selectedFile);
        setImportResult(null);
      } else {
        setImportResult({
          success: false,
          message: 'Please upload an HTML or JSON file.',
        });
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setImportResult(null);

    try {
      const text = await file.text();
      const fileType = getBookmarkFileType(file);

      let parsedBookmarks: Partial<Bookmark>[] = [];

      if (fileType === 'html') {
        parsedBookmarks = parseBookmarksFromHtml(text, setProgress);
      } else if (fileType === 'json') {
        parsedBookmarks = parseBookmarksFromJson(text, setProgress);
      }

      if (parsedBookmarks.length === 0) {
        setImportResult({
          success: false,
          message: 'No valid bookmarks found in the file.',
        });
      } else {
        // Count how many bookmarks would be skipped (already exist)
        const skippedCount = parsedBookmarks.filter(
          (bookmark) => bookmark.url && bookmarks[bookmark.url]
        ).length;
        const importedCount = parsedBookmarks.length - skippedCount;

        // Add each bookmark to the store (duplicates will be automatically skipped by the reducer)
        parsedBookmarks.forEach((bookmark) => {
          if (bookmark.title && bookmark.url && bookmark.domain) {
            dispatch(
              actions.addBookmark({
                title: bookmark.title,
                url: bookmark.url,
                description: bookmark.description || '',
                domain: bookmark.domain,
                tags: bookmark.tags || [],
                createdAt: bookmark.createdAt || new Date(),
                favicon: bookmark.favicon,
              })
            );
          }
        });

        setImportResult({
          success: true,
          message: `${importedCount} bookmarks imported successfully. ${skippedCount > 0 ? `${skippedCount} duplicates skipped.` : ''}`,
          count: importedCount,
          skipped: skippedCount,
        });

        // Reset file after successful import
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error parsing bookmarks:', error);
      setImportResult({
        success: false,
        message: 'Failed to parse bookmarks from the file.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setFile(null);
      setImportResult(null);
      setProgress(0);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Import Bookmarks</DialogTitle>
          <DialogDescription>
            Import bookmarks from an HTML file exported from Chrome or a JSON file exported from
            this app.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <div className='flex flex-col items-center gap-2'>
                <FileUp className='h-10 w-10 text-muted-foreground' />
                <p className='font-medium'>{file.name}</p>
                <p className='text-sm text-muted-foreground'>{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div className='flex flex-col items-center gap-2'>
                <Upload className='h-10 w-10 text-muted-foreground' />
                <p className='font-medium'>Drag and drop your file here</p>
                <p className='text-sm text-muted-foreground'>or</p>
                <Button
                  variant='outline'
                  onClick={() => fileInputRef.current?.click()}
                  type='button'
                >
                  Select File
                </Button>
                <input
                  type='file'
                  ref={fileInputRef}
                  className='hidden'
                  accept='.html,text/html,.json,application/json'
                  onChange={handleFileChange}
                />
                <p className='text-xs text-muted-foreground mt-2'>
                  Supported formats: HTML (Chrome export), JSON (MyBookmarks export)
                </p>
              </div>
            )}
          </div>

          {isProcessing && (
            <div className='space-y-2'>
              <p className='text-sm text-center'>Processing bookmarks...</p>
              <Progress value={progress} />
            </div>
          )}

          {importResult && (
            <Alert variant={importResult.success ? 'default' : 'destructive'}>
              {importResult.success ? (
                <Check className='h-4 w-4' />
              ) : (
                <AlertCircle className='h-4 w-4' />
              )}
              <AlertTitle>{importResult.success ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription>{importResult.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file || isProcessing} className='gap-2'>
            <Upload className='h-4 w-4' />
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
