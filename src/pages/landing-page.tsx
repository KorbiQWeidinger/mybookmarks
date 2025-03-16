import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen max-w-3xl mx-auto p-6 space-y-8'>
      <div className='text-center space-y-8'>
        <Badge variant='secondary' className='text-sm'>
          Beta
        </Badge>
        <h1 className='text-4xl font-bold'>Welcome to MyBookmarks</h1>
      </div>

      <section className='space-y-4 text-center'>
        <h2 className='text-2xl font-semibold'>Setup Instructions</h2>
        <div className='space-y-2 text-muted-foreground'>
          <p>For the best experience, set My Bookmarks as your browser's default new tab page</p>
          <div className='text-sm space-y-1'>
            <p>
              <strong>Chrome:</strong> Settings → On startup → Open a specific page → Add a new page
              → Enter URL
            </p>
            <p>
              <strong>Firefox:</strong> Settings → Home → New Windows and Tabs → Homepage and new
              windows → Custom URLs
            </p>
            <p>
              <strong>Edge:</strong> Settings → On startup → Open these pages → Add a new page →
              Enter URL
            </p>
          </div>
          <p className='mt-4'>
            <strong>Import Your Bookmarks:</strong> You can easily import your existing browser
            bookmarks through the settings page. Simply go to Settings and use the "Import
            Bookmarks" feature to transfer your bookmarks from your browser.
          </p>
        </div>
      </section>

      <section className='space-y-4 text-center'>
        <h2 className='text-2xl font-semibold'>Data Storage</h2>
        <div className='text-muted-foreground space-y-2'>
          <p>
            Your bookmarks are currently stored in local storage with the ability to create local
            backups.
          </p>
          <p>
            While we ensure your data is safely stored on your device, we're actively working on
            cloud sync and server-side storage features for future releases.
          </p>
        </div>
      </section>

      <div className='flex justify-center mt-5 mb-15'>
        <Button asChild size='lg'>
          <Link to='/bookmarks' className='flex items-center gap-2'>
            Get Started <ArrowRight className='w-4 h-4' />
          </Link>
        </Button>
      </div>

      <section className='space-y-4 text-center'>
        <h2 className='text-2xl font-semibold'>Features</h2>
        <ul className='text-muted-foreground space-y-2'>
          <li>✨ Clean and minimalist bookmark management</li>
          <li>🏷️ Custom tags and categories</li>
          <li>🔍 Quick search and filtering</li>
          <li>🌙 Dark mode support</li>
        </ul>
      </section>

      <section className='space-y-4 text-center'>
        <h2 className='text-2xl font-semibold'>Roadmap</h2>
        <ul className='text-muted-foreground space-y-2'>
          <li>📱 Mobile responsive design</li>
          <li>🔄 Browser extension for quick bookmarking</li>
          <li>☁️ Cloud sync across devices</li>
          <li>📊 Advanced bookmark analytics</li>
        </ul>
      </section>
    </div>
  );
}
