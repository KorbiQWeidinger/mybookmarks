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
          <p>For the best experience, set MyBookmarks as your browser's default new tab page</p>
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
          <Link to='/' className='flex items-center gap-2'>
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

      <section className='space-y-4 text-center'>
        <h2 className='text-2xl font-semibold'>Contact & Contribute</h2>
        <div className='flex flex-col items-center space-y-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full overflow-hidden'>
              <img
                src='/mybookmarks/korbi.png'
                alt='Korbi'
                className='w-full h-full object-cover'
              />
            </div>
            <a
              href='https://www.linkedin.com/in/korbinian-weidinger-524b63229/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              Contact me on LinkedIn for bug reports or feature requests
            </a>
          </div>
          <div className='flex items-center gap-3'>
            <a
              href='https://github.com/KorbiQWeidinger/mybookmarks'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline flex items-center gap-2'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-github'
              >
                <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4'></path>
                <path d='M9 18c-4.51 2-5-2-7-2'></path>
              </svg>
              Create an issue or open a pull request on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
