import { HashRouter as Router, Route, Routes as RouterRoutes } from 'react-router-dom';
import { BookmarksPage } from '@/pages/bookmarks-page';
import { LandingPage } from '@/pages/landing-page';

export const Routes = () => {
  return (
    <Router>
      <RouterRoutes>
        <Route path='/landing' element={<LandingPage />} />
        <Route path='/' element={<BookmarksPage />} />
      </RouterRoutes>
    </Router>
  );
};
