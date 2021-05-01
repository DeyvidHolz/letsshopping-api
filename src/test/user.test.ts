import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';

import { User } from '../entities/User.entity';
import RequestNotExpected from '../errors/test/requestNotExpected.error';

dotenv.config();

const URL =
  process.env.URL + (process.env.PORT ? ':' + process.env.PORT : '') + '/api';

const randomNumber = new Date().valueOf();
let user: User = new User();
const username = `${randomNumber}userTest`;
const email = `${randomNumber}user.test@mail.com`;
const password = `123456`;

let authToken = null;

describe('User controller tests', () => {
  it('Should create a user', async () => {
    const createUserPayload = {
      username,
      password,
      firstName: 'User',
      lastName: 'for Test',
      email,
      birthDate: '1999-12-09',
    };

    const res = await axios.post(`${URL}/users`, createUserPayload);

    expect(res.status).toBe(201);
    expect(res.data.user.id).toBeGreaterThan(0);

    user = res.data.user;
  });

  it('Should authenticate user', async () => {
    const authUserPayload = {
      username,
      password,
    };

    const res = await axios.post(`${URL}/auth`, authUserPayload);

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('token');

    authToken = res.data.token;
  });

  it('Should update user', async () => {
    const newfirstName = user.firstName + 'Updated';

    const updateUserPayload = {
      id: user.id,
      currentPassword: password,
      firstName: newfirstName,
      lastName: user.lastName + 'Updated',
      email: user.email,
      birthDate: '1999-12-29',
    };

    const res = await axios.put(`${URL}/users`, updateUserPayload, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(res.status).toBe(200);
    expect(res.data.user.firstName).toBe(newfirstName);
    expect(res.data.user).not.toHaveProperty('password');
  });

  it('Should not create users with same username/email', (done) => {
    const createUserPayload = {
      username,
      password,
      firstName: 'User',
      lastName: 'Test',
      email,
      birthDate: '1999-12-09',
    };

    axios
      .post(`${URL}/users`, createUserPayload)
      .then(() => {
        throw new RequestNotExpected(
          'Should not create users with same username/email',
        );
      })
      .catch((err: AxiosError) => {
        expect(err.response.status).toBe(422);
        done();
      });
  });

  it('Should not create invalid users', (done) => {
    const createUserPayload = {
      username: username + ' invalid',
      password: '1234',
      firstName: 'User1',
      lastName: 'Test2',
      email: email + 'invalid!',
      birthDate: '19-09-2019',
    };

    axios
      .post(`${URL}/users`, createUserPayload)
      .then(() => {
        throw new RequestNotExpected('Should not create invalid users');
      })
      .catch((err: AxiosError) => {
        // @todo: add the rest of expects to check all errors it should return
        expect(err.response.status).toBe(422);
        done();
      });
  });

  it('Should delete user', async () => {
    const res = await axios.delete(`${URL}/users`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('message');
    expect(res.data.message).toBe('User deleted.');
  });
});
