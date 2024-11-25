import React from 'react';
import { lazy } from 'react';
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import ProtectedRoute from './PrivateRoutes';

const DashboardDefault = Loadable(lazy(() => import('pages/day-predict/index')));
const SamplePage = Loadable(lazy(() => import('pages/month-predict/index')));

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
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
