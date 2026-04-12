import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

type TFormValues = Record<string, string>;

export const useForm = <T extends TFormValues>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const setValue = <K extends keyof T>(
    name: K,
    value: SetStateAction<T[K]>
  ) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]:
        typeof value === 'function'
          ? (value as (prevState: T[K]) => T[K])(prevValues[name])
          : value
    }));
  };

  const getFieldSetter = <K extends keyof T>(
    name: K
  ): Dispatch<SetStateAction<T[K]>> => {
    const fieldSetter: Dispatch<SetStateAction<T[K]>> = (value) => {
      setValue(name, value);
    };

    return fieldSetter;
  };

  const resetForm = (nextValues: T = initialValues) => {
    setValues(nextValues);
  };

  return {
    values,
    setValues,
    handleChange,
    setValue,
    getFieldSetter,
    resetForm
  };
};
