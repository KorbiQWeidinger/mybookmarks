import { useAppDispatch, useAppSelector } from '@/store/store';
import { Button } from '@/components/ui/button';
import {
  actions as counterActions,
  selectors as counterSelectors,
} from '@/store/slices/counter-slice';

export function Counter() {
  const { decrement, increment } = counterActions;
  const count = useAppSelector(counterSelectors.selectCount);
  const dispatch = useAppDispatch();

  return (
    <div className='flex items-center gap-4'>
      <Button variant='outline' size='lg' onClick={() => dispatch(decrement())}>
        -
      </Button>
      <span className='text-4xl font-bold min-w-16 text-center'>{count}</span>
      <Button variant='outline' size='lg' onClick={() => dispatch(increment())}>
        +
      </Button>
    </div>
  );
}
