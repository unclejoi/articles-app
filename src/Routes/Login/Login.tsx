import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import './Login.css';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/TextInput';
import { ErrorIcon } from '../../assets/icons/error';

interface ICredentials {
  username: string;
  password: string;
}

interface IData {
  username: string;
  email: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [credentials, setCredentials] = React.useState<ICredentials>({
    username: '',
    password: '',
  });
  const [displayError, setDisplayError] = React.useState<boolean>(false);

  const { data } = useQuery({
    queryKey: ['postList'],
    queryFn: async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );
      return response.json();
    },
  });

  React.useEffect(() => {
    const user = sessionStorage.getItem('userData');
    if (user) {
      const data = JSON.parse(user);
      navigate(`/articles?userId=${data.id}`);
    }
  }, [navigate]);

  React.useEffect(() => {
    return () => {
      // Clear all cached data
      console.log('remove queries');
      queryClient.removeQueries();
    };
  }, [queryClient]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = data.find(
      (item: IData) =>
        item.username === credentials.username &&
        item.email === credentials.password
    );
    if (userData) {
      navigate(`/articles?userId=${userData.id}`);
      sessionStorage.setItem('userData', JSON.stringify(userData));
    } else {
      setDisplayError(true);
    }
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setDisplayError(false);
    setCredentials((prevState) => ({
      username: name === 'username' ? value : prevState.username,
      password: name === 'password' ? value : prevState.password,
    }));
  };

  return (
    <>
      <form style={{ height: '100%', minHeight: '100vh' }} onSubmit={onSubmit}>
        <div className="login-wrapper">
          <div className="login-card">
            <div className="title"> Login </div>
            <div className="input-wrapper">
              <Input
                type="text"
                className="input"
                placeholder="Username"
                value={credentials.username}
                name="username"
                onChange={onChange}
                required
              />
            </div>
            <div className="input-wrapper">
              <Input
                type="password"
                className="input"
                placeholder="Password"
                value={credentials.password}
                name="password"
                onChange={onChange}
                required
              />
            </div>
            {displayError && (
              <div className="login-failed">
                <ErrorIcon />
                <div style={{ marginLeft: '5px' }}>
                  {' '}
                  Invalid username and/or password!
                </div>
              </div>
            )}
            <Button type="submit" className="submit-btn" caption="Login" />
          </div>
        </div>
      </form>
    </>
  );
};
