import { HashRouter as Router, Route, Routes as RouterRoutes } from 'react-router-dom';
import { BookmarksPage } from '@/pages/bookmarks-page';
import { LandingPage } from '@/pages/landing-page';
import { SettingsPage } from '@/pages/settings-page';

export const Routes = () => {
  return (
    <Router>
      <RouterRoutes>
        <Route path='/landing' element={<LandingPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/' element={<BookmarksPage />} />
      </RouterRoutes>
    </Router>
  );
};
