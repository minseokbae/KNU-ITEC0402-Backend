import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/day-predict/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/month-predict/index')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/month',
      element: <SamplePage />
    },
    {
      path: '/day',
      element: <DashboardDefault />
    }
  ]
};

export default MainRoutes;
