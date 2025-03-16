import { X } from 'lucide-react';
import { Counter } from '@/components/counter';
import { ViteLogo } from '@/components/logos/vite';
import { ShadcnLogo } from '@/components/logos/shadcn';
import { ModeToggle } from '../components/mode-toggle';
import { Button } from '@/components/ui/button';

export function Main() {
  const handleNavigateToRepo = () => {
    window.open('https://github.com/KorbiQWeidinger/vite-shadcn', '_blank');
  };

  return (
    <main className='min-h-screen bg-background flex flex-col items-center justify-center p-4'>
      <div className='flex items-center justify-center gap-8 mb-12'>
        <ViteLogo width={90} height={90} />
        <X className='h-8 w-8' />
        <ShadcnLogo width={90} height={90} />
      </div>
      <h2 className='text-2xl font-bold mb-32'>Template</h2>
      <Counter />
      <div className='m-12'>
        <ModeToggle />
      </div>
      <Button onClick={handleNavigateToRepo}>Use this template</Button>
    </main>
  );
}
