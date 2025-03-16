import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Moon,
  Search,
  Sparkles,
  Tags,
  Smartphone,
  Globe,
  Cloud,
  BarChart2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GitHub } from '@/components/icons/GitHub';

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
        <h2 className='text-2xl font-semibold'>Contact & Contribute</h2>
        <div className='flex flex-col items-center space-y-4'>
          <div className='flex items-center gap-3'>
            <a
              href='https://github.com/KorbiQWeidinger/mybookmarks/issues'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline flex items-center gap-2'
            >
              <GitHub className='w-5 h-5' />
              Create an issue or open a pull request on GitHub
            </a>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 rounded-full overflow-hidden'>
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
              Contact me on LinkedIn
            </a>
          </div>
        </div>
      </section>

      <section className='space-y-4 text-center'>
        <h2 className='text-2xl font-semibold'>Features</h2>
        <ul className='text-muted-foreground space-y-2'>
          <li className='flex items-center justify-center gap-2'>
            <Sparkles className='h-4 w-4' /> Clean and minimalist bookmark management
          </li>
          <li className='flex items-center justify-center gap-2'>
            <Tags className='h-4 w-4' /> Custom tags and categories
          </li>
          <li className='flex items-center justify-center gap-2'>
            <Search className='h-4 w-4' /> Quick search and filtering
          </li>
          <li className='flex items-center justify-center gap-2'>
            <Moon className='h-4 w-4' /> Dark mode support
          </li>
        </ul>
      </section>

      <section className='space-y-4 text-center'>
        <h2 className='text-2xl font-semibold'>Roadmap</h2>
        <ul className='text-muted-foreground space-y-2'>
          <li className='flex items-center justify-center gap-2'>
            <Smartphone className='h-4 w-4' /> Mobile responsive design
          </li>
          <li className='flex items-center justify-center gap-2'>
            <Globe className='h-4 w-4' /> Browser extension for quick bookmarking
          </li>
          <li className='flex items-center justify-center gap-2'>
            <Cloud className='h-4 w-4' /> Cloud sync across devices
          </li>
          <li className='flex items-center justify-center gap-2'>
            <BarChart2 className='h-4 w-4' /> Advanced bookmark analytics
          </li>
        </ul>
      </section>
    </div>
  );
}
