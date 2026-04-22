import { FC, SyntheticEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice';
import { selectRegisterError } from '@selectors/user';
import { useForm } from '../../hooks/useForm';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { values, getFieldSetter } = useForm({
    userName: '',
    email: '',
    password: ''
  });
  const errorText = useSelector(selectRegisterError) || '';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerUser({
        email: values.email,
        password: values.password,
        name: values.userName
      })
    ).then((result) => {
      if (registerUser.fulfilled.match(result)) {
        const from = (location.state as { from?: { pathname?: string } } | null)
          ?.from?.pathname;
        navigate(from || '/', { replace: true });
      }
    });
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={values.email}
      userName={values.userName}
      password={values.password}
      setEmail={getFieldSetter('email')}
      setPassword={getFieldSetter('password')}
      setUserName={getFieldSetter('userName')}
      handleSubmit={handleSubmit}
    />
  );
};
