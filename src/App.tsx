import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from '@/context/theme-provider';
import { Routes } from '@/routes/Routes';
import { store } from '@/store';

export function App() {
  return (
    <ThemeProvider>
      <ReduxProvider store={store}>
        <Routes />
      </ReduxProvider>
    </ThemeProvider>
  );
}
