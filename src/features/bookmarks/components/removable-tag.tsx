import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { X, Trash2 } from 'lucide-react';
import { MouseEvent } from 'react';

interface RemovableTagProps {
  tag: string;
  count?: number;
  isSelected?: boolean;
  onClick?: (tag: string) => void;
  onRemove: (tag: string, e: MouseEvent) => void;
  variant?: 'x' | 'trash';
}

export function RemovableTag({
  tag,
  count,
  isSelected = false,
  onClick,
  onRemove,
  variant = 'x',
}: RemovableTagProps) {
  const handleRemove = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onRemove(tag, e);
  };

  return (
    <Badge
      variant={isSelected ? 'default' : 'outline'}
      className='cursor-pointer text-xs mb-1 group relative transition-all duration-200 hover:pr-6'
      onClick={onClick ? () => onClick(tag) : undefined}
    >
      <span>
        {tag}
        {count !== undefined && ` (${count})`}
      </span>
      <Button
        variant='ghost'
        size='icon-sm'
        className={cn(
          'absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-0 px-1 h-3 w-3 hover:bg-muted/60 rounded-sm',
          variant === 'trash' ? 'hover:text-destructive' : 'hover:text-muted-foreground'
        )}
        onClick={handleRemove}
        onMouseDown={(e) => e.stopPropagation()}
        title='Remove tag'
        type='button'
      >
        {variant === 'x' ? <X size={10} /> : <Trash2 size={10} />}
      </Button>
    </Badge>
  );
}
