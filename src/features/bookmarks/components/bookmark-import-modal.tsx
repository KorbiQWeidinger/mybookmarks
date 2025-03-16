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
import { useAppDispatch } from '@/store';
import { actions } from '@/store/slices/bookmarks-slice';
import { Upload, FileUp, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface BookmarkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookmarkImportModal({ isOpen, onClose }: BookmarkImportModalProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
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
      if (droppedFile.type === 'text/html' || droppedFile.name.endsWith('.html')) {
        setFile(droppedFile);
        setImportResult(null);
      } else {
        setImportResult({
          success: false,
          message: 'Please upload an HTML file exported from Chrome.',
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/html' || selectedFile.name.endsWith('.html')) {
        setFile(selectedFile);
        setImportResult(null);
      } else {
        setImportResult({
          success: false,
          message: 'Please upload an HTML file exported from Chrome.',
        });
      }
    }
  };

  const parseBookmarksFromHtml = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Find all bookmark links
    const links = doc.querySelectorAll('a');
    const bookmarks = [];
    const totalLinks = links.length;

    // Process each link
    for (let i = 0; i < totalLinks; i++) {
      const link = links[i];
      const url = link.getAttribute('href');
      const title = link.textContent?.trim() || '';

      if (url && title && url.startsWith('http')) {
        try {
          const urlObj = new URL(url);
          const domain = urlObj.hostname.replace('www.', '');

          // Extract folder structure as tags
          const tags: string[] = [];

          // Find parent folders (DL > DT > H3 elements)
          let currentElement = link.parentElement;
          while (currentElement) {
            // Look for H3 elements which are folder names in Chrome bookmarks
            const folderName = currentElement.querySelector('h3')?.textContent?.trim();
            if (folderName && folderName !== 'Bookmarks' && folderName !== 'Bookmarks bar') {
              tags.push(folderName.toLowerCase().replace(/\s+/g, '-'));
            }

            // Move up to parent DL element
            currentElement = currentElement.parentElement;
          }

          // Add domain as a tag
          tags.push(domain.split('.')[0]);

          // Remove duplicates
          const uniqueTags = [...new Set(tags)];

          bookmarks.push({
            title,
            url,
            description: '',
            domain,
            tags: uniqueTags,
            createdAt: new Date(),
            favicon: `https://${domain}/favicon.ico`,
          });
        } catch (error) {
          console.error('Invalid URL:', url, error);
        }
      }

      // Update progress
      setProgress(Math.round(((i + 1) / totalLinks) * 100));
    }

    return bookmarks;
  };

  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setImportResult(null);

    try {
      const text = await file.text();
      const bookmarks = parseBookmarksFromHtml(text);

      if (bookmarks.length === 0) {
        setImportResult({
          success: false,
          message: 'No valid bookmarks found in the file.',
        });
      } else {
        // Add each bookmark to the store
        bookmarks.forEach((bookmark) => {
          dispatch(actions.addBookmark(bookmark));
        });

        setImportResult({
          success: true,
          message: 'Bookmarks imported successfully!',
          count: bookmarks.length,
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
            Import bookmarks from an HTML file exported from Chrome.
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
                <p className='font-medium'>Drag and drop your HTML file here</p>
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
                  accept='.html,text/html'
                  onChange={handleFileChange}
                />
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
              <AlertDescription>
                {importResult.message}
                {importResult.count && ` Imported ${importResult.count} bookmarks.`}
              </AlertDescription>
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
