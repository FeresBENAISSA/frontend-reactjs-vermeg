import { Navigate, useRoutes } from 'react-router-dom';
// layouts
// import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
// import BlogPage from './pages/StoreManager/BlogPage';
import UserPage from './pages/Adminstrator/UserPage';
import ProductPage from './pages/StoreManager/ProductPage';

import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import RequireAuth from './redux/features/auth/RequireAuth';
// import ProductsPage from './pages/StoreManager/ProductsPage';

import DashboardAppPage from './pages/StoreManager/DashboardAppPage';
import AdminDashboardAppPage from './pages/Adminstrator/AdminDashboardAppPage';
import BankDashboardAppPage from './pages/BankAgent/BankDashboardAppPage';


import ManagerDashboardLayout from './layouts/dashboard/ManagerDashboardLayout';
import AdminDashboardLayout from './layouts/dashboard/AdminDashboardLayout';
import BankDashboardLayout from './layouts/dashboard/BankDashboardLayout';

import AdminProfile from './pages/Adminstrator/ProfileAdmin';
import BankProfile from './pages/BankAgent/ProfileBank';
import ManagerProfile from './pages/StoreManager/Profile';
import StorePage from './pages/Adminstrator/StorePage';
import StoreEmployeePage from './pages/StoreManager/StoreEmployeePage';
import CompanyPage from './pages/Adminstrator/CompanyPage';
import CategoryPage from './pages/StoreManager/CategoryPage';
import BrandPage from './pages/StoreManager/BrandPage';

// import RequireAuth from './components/RequireAuth';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: 'login',
      element: <LoginPage />,
    },
    // routes for manager
    {
      path: '/dashboard',
      element: <RequireAuth allowedRoles={'STORE_MANAGER'} />,
      children: [
        {
          path: '/dashboard',
          element: <ManagerDashboardLayout />,
          children: [
            { element: <Navigate to="/dashboard/manager" />, index: true },
            { path: 'manager', element: <DashboardAppPage /> },
            { path: 'product', element: <ProductPage /> },
            { path: 'categories', element: <CategoryPage /> },
            { path: 'brands', element: <BrandPage /> },
            { path: 'employee', element: <StoreEmployeePage /> },
            { path: 'profile', element: <ManagerProfile /> },
            // { path: 'blog', element: <BlogPage /> },
            // { path: 'products', element: <ProductsPage /> },
            // { path: 'bank', element: <BankDashboardAppPage /> },
            // { path: 'user', element: <UserPage /> },
          ],
        },
      ],
    },
    //admin
    {
      path: '/dashboard',
      element: <RequireAuth allowedRoles={'ADMIN'} />,
      children: [
        {
          path: '/dashboard',
          element: <AdminDashboardLayout />,
          children: [
            { element: <Navigate to="/dashboard/admin" />, index: true },
            { path: 'admin', element: <AdminDashboardAppPage /> },
            { path: 'user', element: <UserPage /> },
            { path: 'store', element: <StorePage /> },
            { path: 'company', element: <CompanyPage /> },
            { path: 'adminProfile', element: <AdminProfile /> },
            // { path: 'bank', element: <BankDashboardAppPage /> },
            // { path: 'product', element: <ProductPage /> },
            // { path: 'products', element: <ProductsPage /> },
            // { path: 'blog', element: <BlogPage /> },
            // { path: 'blog', element: <BlogPage /> },
          ],
        },
      ],
    },
    //bankAgent
    {
      path: '/dashboard',
      element: <RequireAuth allowedRoles={'BANK_AGENT'} />,
      children: [
        {
          path: '/dashboard',
          element: <BankDashboardLayout />,
          children: [
            { element: <Navigate to="/dashboard/bank" />, index: true },
            { path: 'bank', element: <BankDashboardAppPage /> },
            { path: 'bankprofile', element: <BankProfile/> },
            // { path: 'user', element: <UserPage /> },

            // { path: 'user', element: <UserPage /> },
            // { path: 'product', element: <ProductPage /> },
            // { path: 'products', element: <ProductsPage /> },
            // { path: 'blog', element: <BlogPage /> },
            // { path: 'blog', element: <BlogPage /> },
          ],
        },
      ],
    },

    // {
    //   path: '/dashboard',
    //   element: <DashboardLayout />,
    //   children: [
    //     { element: <Navigate to="/dashboard/manager" />, index: true },
    //     { path: 'manager', element: <DashboardAppPage /> },
    //     { path: 'admin', element: <AdminDashboardAppPage /> },
    //     { path: 'bank', element: <BankDashboardAppPage /> },
    //     { path: 'user', element: <UserPage /> },
    //     { path: 'product', element: <ProductPage /> },
    //     { path: 'products', element: <ProductsPage /> },
    //     { path: 'blog', element: <BlogPage /> },
    //     { path: 'blog', element: <BlogPage /> },
    //   ],
    // },

    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
