import { FC, SyntheticEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { selectLoginError } from '@selectors/user';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { values, getFieldSetter } = useForm({
    email: '',
    password: ''
  });
  const errorText = useSelector(selectLoginError) || '';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser(values)).then((result) => {
      if (loginUser.fulfilled.match(result)) {
        const from = (location.state as { from?: { pathname?: string } } | null)
          ?.from?.pathname;
        navigate(from || '/', { replace: true });
      }
    });
  };

  return (
    <LoginUI
      errorText={errorText}
      email={values.email}
      setEmail={getFieldSetter('email')}
      password={values.password}
      setPassword={getFieldSetter('password')}
      handleSubmit={handleSubmit}
    />
  );
};
