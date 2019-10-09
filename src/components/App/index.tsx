import React, { useState } from 'react';
import { fetchApi } from './fetchApi';

export const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
  }>({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
  });
  const [input, setInput] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    fetchApi(input)
      .then(data => {
        setLoading(false);
        setInput({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
        });
      })
      .catch(e => {
        setErrors({ ...errors, ...e.errors });
        setLoading(false);
      });

    event.preventDefault();
  };

  const onInputChange = (key: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newState: {
      [key: string]: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    } = { ...input };
    newState[key] = event.target.value;
    setInput(newState);
  };

  return (
    <>
      <form onSubmit={onFormSubmit}>
        <p>
          <label htmlFor="firstName">First Name</label>
          <input
            disabled={loading}
            type="text"
            name="firstName"
            id="firstName"
            value={input.firstName}
            onChange={onInputChange('firstName')}
          />
          {errors.firstName && <span>{errors.firstName}</span>}
        </p>

        <p>
          <label>Last Name</label>
          <input
            disabled={loading}
            type="text"
            name="lastName"
            id="lastName"
            value={input.lastName}
            onChange={onInputChange('lastName')}
          />
          {errors.lastName && <span>{errors.lastName}</span>}
        </p>

        <p>
          <label>Email Address</label>
          <input
            disabled={loading}
            type="email"
            name="email"
            id="email"
            value={input.email}
            onChange={onInputChange('email')}
          />
          {errors.email && <span>{errors.email}</span>}
        </p>

        <p>
          <label>Password</label>
          <input
            disabled={loading}
            type="password"
            name="password"
            id="password"
            value={input.password}
            onChange={onInputChange('password')}
          />
          {errors.password && <span>{errors.password}</span>}
        </p>

        <p>
          <button type="submit" disabled={loading}>
            Submit
          </button>
        </p>
      </form>
    </>
  );
};
