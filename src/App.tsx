import './App.css';
import { RouterProvider } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './Routes/Router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const clientQuery = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={clientQuery}>
      <div className="mainWrapper">
        <RouterProvider router={router} />
      </div>
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;
