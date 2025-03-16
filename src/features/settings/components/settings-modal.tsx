import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModeToggle } from '@/components/mode-toggle';
import { Label } from '@/components/ui/label';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
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
          {/* Additional settings can be added here */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
