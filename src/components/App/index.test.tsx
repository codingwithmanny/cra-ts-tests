import React from 'react';
import { render, fireEvent, cleanup, act, wait } from '@testing-library/react';
import { App } from './';
import * as fetch from './fetchApi';

// CLEAN UP AFTER EACH TEST
afterEach(() => {
  cleanup();
});

// MOCKING MY FAKE FETCH API
jest.spyOn(fetch, 'fetchApi').mockImplementation(
  ({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) =>
    new Promise((resolve, reject) => {
      if (
        firstName.length <= 0 ||
        lastName.length <= 0 ||
        email.length <= 0 ||
        password.length < 8
      ) {
        const errors: any = {};
        if (firstName.length <= 0) {
          errors.firstName = `Invalid field: 'firstName'`;
        }

        if (lastName.length <= 0) {
          errors.lastName = `Invalid field: 'lastName'`;
        }

        if (email.length <= 0) {
          errors.email = `Invalid field: 'email'`;
        }

        if (password.length < 8) {
          errors.password = `Invalid field: 'password'`;
        }
        return reject({
          message: `Invalid field(s)`,
          errors,
        });
      }

      return resolve({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
      });
    })
);

// TESTS
test('<App />', async () => {
  // Get component
  const { container } = render(<App />);

  // 1. Test that the view has all the fields present with a snapshot (form, input, button, errors)
  expect(container).toMatchSnapshot();

  // 2. Test that a user can update the fields data with state
  // user can enter date into 4 fields
  const form: HTMLFormElement | null = container.querySelector('form');
  const button: HTMLButtonElement | null = container.querySelector('button');

  const firstName: HTMLInputElement | null = container.querySelector(
    'input[name=firstName]'
  );

  const lastName: HTMLInputElement | null = container.querySelector(
    'input[name=lastName]'
  );

  const email: HTMLInputElement | null = container.querySelector(
    'input[name=email]'
  );

  const password: HTMLInputElement | null = container.querySelector(
    'input[name=password]'
  );

  if (firstName) {
    fireEvent.change(firstName, { target: { value: 'John' } });
    expect(firstName.value).toEqual('John');
  }

  if (lastName) {
    fireEvent.change(lastName, { target: { value: 'Smith' } });
    expect(lastName.value).toEqual('Smith');
  }

  if (email) {
    fireEvent.change(email, { target: { value: '' } });
    expect(email.value).toEqual('');
  }

  if (password) {
    fireEvent.change(password, { target: { value: 'asdf1234!' } });
    expect(password.value).toEqual('asdf1234!');
  }

  // 3. Test that missing fields will show an error message
  if (form && button) {
    fireEvent.click(button);
    await act(() => wait());
    expect(fetch.fetchApi).toBeCalledTimes(1);
    expect(
      fetch.fetchApi({
        firstName: (firstName && firstName.value) || '',
        lastName: (lastName && lastName.value) || '',
        email: (email && email.value) || '',
        password: (password && password.value) || '',
      })
    ).rejects.toEqual({
      message: `Invalid field(s)`,
      errors: {
        email: `Invalid field: 'email'`,
      },
    });

    const spans: { [key: string]: any } = container.querySelectorAll('span');
    expect(Object.keys(spans).length).toEqual(1);
    expect(spans[0].innerHTML).toEqual(`Invalid field: 'email'`);
  }

  if (email) {
    fireEvent.change(email, { target: { value: 'john.smith@email.com' } });
  }

  // 4. Test that submitting the form will disable the fields
  if (firstName && lastName && email && password && button) {
    fireEvent.click(button);

    expect(firstName.getAttribute('disabled')).not.toBeNull;
    expect(lastName.getAttribute('disabled')).not.toBeNull;
    expect(email.getAttribute('disabled')).not.toBeNull;
    expect(password.getAttribute('disabled')).not.toBeNull;
    expect(button.getAttribute('disabled')).not.toBeNull;

    await act(() => wait());
    expect(fetch.fetchApi).toBeCalledTimes(3);

    expect(firstName.getAttribute('disabled')).toBeNull;
    expect(lastName.getAttribute('disabled')).toBeNull;
    expect(email.getAttribute('disabled')).toBeNull;
    expect(password.getAttribute('disabled')).toBeNull;
    expect(button.getAttribute('disabled')).toBeNull;

    // 5. Test the form success will empty fields
    expect(firstName.value).toEqual('');
    expect(lastName.value).toEqual('');
    expect(email.value).toEqual('');
    expect(password.value).toEqual('');
    expect(button.value).toEqual('');
  }
});
