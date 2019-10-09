import { delay } from 'q';

export const fetchApi = async ({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
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
    throw {
      message: `Invalid field(s)`,
      errors,
    };
  }

  await delay(2000);
  return {
    firstName,
    lastName,
    email,
  };
};
