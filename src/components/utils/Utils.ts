import { toast } from 'react-toastify';

export const Toast = (type: string, message?: string) => {
  if (type === 'success') {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      progress: undefined,
      theme: 'light',
    });
  }

  if (type === 'error') {
    toast.error('Something went wrong, Please try again!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      progress: undefined,
      theme: 'light',
    });
  }
};
