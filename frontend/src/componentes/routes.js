import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'devias/layouts/DashboardLayout';
import MainLayout from 'devias/layouts/MainLayout';
import AccountView from 'devias/views/account/AccountView';
import CustomerListView from 'devias/views/customer/CustomerListView';
import DashboardView from 'devias/views/reports/DashboardView';
import LoginView from 'devias/views/auth/LoginView';
import NotFoundView from 'devias/views/errors/NotFoundView';
import ProductListView from 'devias/views/product/ProductListView';
import RegisterView from 'devias/views/auth/RegisterView';
import SettingsView from 'devias/views/settings/SettingsView';
import { AddProcess, EditProcess, HelpIssue,
 HelpTutorials, Historic, Login, Process, ViewProcess,
  ViewProcessCalendar, ViewProcessMail, WelcomePage } from '../vistas/Vistas';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'AddProcess', element: <AddProcess /> },
      { path: 'EditProcess', element: <EditProcess /> },
      { path: 'HelpIssue', element: <HelpIssue /> },
      { path: 'HelpTutorials', element: <HelpTutorials /> },
      { path: 'Historic', element: <Historic /> },
      { path: 'Process', element: <Process /> },
      { path: 'ViewProcess', element: <ViewProcess /> },
      { path: 'ViewProcessCalendar', element: <ViewProcessCalendar /> },
      { path: 'ViewProcessMail', element: <ViewProcessMail /> },
      { path: 'WelcomePage', element: <WelcomePage /> },


      { path: 'account', element: <AccountView /> },
      { path: 'customers', element: <CustomerListView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'products', element: <ProductListView /> },
      { path: 'settings', element: <SettingsView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'Login', element: <Login /> },

      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
