import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectUpdateUserError, selectUser } from '@selectors/user';
import { updateUser } from '../../services/slices/userSlice';
import { useForm } from '../../hooks/useForm';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser) || {
    name: '',
    email: ''
  };
  const updateUserError = useSelector(selectUpdateUserError) || undefined;
  const { values, setValues, handleChange, resetForm } = useForm({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    setValues({
      name: user.name || '',
      email: user.email || '',
      password: ''
    });
  }, [setValues, user]);

  const isFormChanged =
    values.name !== user.name ||
    values.email !== user.email ||
    Boolean(values.password);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const payload: { name?: string; email?: string; password?: string } = {};

    if (values.name !== user.name) {
      payload.name = values.name;
    }
    if (values.email !== user.email) {
      payload.email = values.email;
    }
    if (values.password) {
      payload.password = values.password;
    }

    dispatch(updateUser(payload)).then((result) => {
      if (updateUser.fulfilled.match(result)) {
        setValues({
          name: values.name,
          email: values.email,
          password: ''
        });
      }
    });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    resetForm({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  return (
    <ProfileUI
      formValue={values}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleChange}
      updateUserError={updateUserError}
    />
  );
};
