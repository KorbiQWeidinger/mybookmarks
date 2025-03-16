import { HashRouter as Router, Route, Routes as RouterRoutes } from 'react-router-dom';
import { Main } from '@/pages/main';

export const Routes = () => {
  return (
    <Router>
      <RouterRoutes>
        <Route path='/' element={<Main />} />
      </RouterRoutes>
    </Router>
  );
};
