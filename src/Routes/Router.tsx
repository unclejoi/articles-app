import { createBrowserRouter } from 'react-router-dom';
import LandingPage from './Articles/Landing';
import { LoginPage } from './Login/Login';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    index: true,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/articles',
        element: <LandingPage />,
      },
    ],
  },
]);

export default router;
