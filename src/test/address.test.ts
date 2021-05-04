import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';

import { Address } from '../entities/Address.entity';
import {
  createAddressPayload,
  updateAddressPayload,
} from '../types/controllers/address.types';

dotenv.config();

const URL =
  process.env.URL + (process.env.PORT ? ':' + process.env.PORT : '') + '/api';

let headers = {
  Authorization: null,
};

let authToken: string | null = null;
const createdAddresses: Address[] = [];

describe('Address routes tests', () => {
  /*
   * Creating an user and authenticating
   */
  beforeAll(async () => {
    // Generating data for new user
    const randomNumber = new Date().valueOf();
    const username = `${randomNumber}userTest`;
    const email = `${randomNumber}user.test@mail.com`;
    const password = `123456`;

    const createUserPayload = {
      username,
      password,
      firstName: 'User',
      lastName: 'for Test',
      email,
      birthDate: '1999-12-09',
    };

    // Creating a new user
    await axios.post(`${URL}/users`, createUserPayload);

    // Authenticating user
    const authUserPayload = {
      username,
      password,
    };

    const authenticationResponse = await axios.post(
      `${URL}/auth`,
      authUserPayload,
    );

    authToken = authenticationResponse.data.token;
    headers.Authorization = `Bearer ${authToken}`;
  });

  /*
   * Deleting created user
   */
  afterAll(async () => {
    await axios.delete(`${URL}/users`, { headers });
  });

  it('Should create an address', async () => {
    const createAddressPayload: createAddressPayload = {
      country: 'BR',
      zipCode: '02995000',
      state: 'SP',
      neighbourhood: 'Parque Nações Unidas',
      street: 'R. Friedrich Von Voith',
      number: 410,
    };

    const res = await axios.post(`${URL}/addresses`, createAddressPayload, {
      headers,
    });

    expect(res.status).toBe(201);
    expect(res.data.address).toHaveProperty('isMain');
    expect(res.data.address.isMain).toBeTruthy();

    createdAddresses.push(res.data.address);
  });

  it('Should create a non-main address', async () => {
    const createAddressPayload: createAddressPayload = {
      country: 'BR',
      zipCode: '02995001',
      state: 'SP',
      neighbourhood: 'Parque Nações Unidas',
      street: 'R. Friedrich Von Voith',
      number: 410,
    };

    const res = await axios.post(`${URL}/addresses`, createAddressPayload, {
      headers,
    });

    expect(res.status).toBe(201);
    expect(res.data.address).toHaveProperty('isMain');
    expect(res.data.address.isMain).toBeFalsy();

    createdAddresses.push(res.data.address);
  });

  it('Should update an address', async () => {
    const { id, country, zipCode } = createdAddresses[1];

    const updateAddressPayload: updateAddressPayload = {
      country,
      zipCode,
      state: 'RJ',
      neighbourhood: 'Botafogo',
      street: 'São Gonçalves',
      number: 12,
      isMain: true,
    };

    const res = await axios.patch(
      `${URL}/addresses/${id}`,
      updateAddressPayload,
      {
        headers,
      },
    );

    expect(res.status).toBe(200);
    expect(res.data.address.isMain).toBeTruthy();
    expect(res.data.address.state).toBe('RJ');
    expect(res.data.address.neighbourhood).toBe('Botafogo');
    expect(res.data.address.street).toBe('São Gonçalves');
    expect(res.data.address.number).toBe(12);

    createdAddresses.splice(1, 1);
    createdAddresses.push(res.data.address);
  });

  it('Should have only one main address', async () => {
    const res = await axios.get(`${URL}/addresses/all`, {
      headers,
    });

    const mainAddresses: Address[] = res.data.filter(
      (address) => address.isMain,
    );

    expect(res.status).toBe(200);
    expect(mainAddresses.length).toBe(1);
  });

  it('Should get all addresses', async () => {
    const res = await axios.get(`${URL}/addresses/all`, {
      headers,
    });

    expect(res.status).toBe(200);
    expect(typeof res.data).toBe('object');
  });

  it('Should get a specific address', async () => {
    const { id } = createdAddresses[0];

    const res = await axios.get(`${URL}/addresses/${id}`, {
      headers,
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('id');
  });

  it('Should not create addresses with same ZIP Code', (done) => {
    const createAddressPayload: createAddressPayload = {
      country: 'BR',
      zipCode: '02995000',
      state: 'SP',
      neighbourhood: 'Parque Nações Unidas',
      street: 'R. Friedrich Von Voith',
      number: 410,
    };

    axios
      .post(`${URL}/addresses`, createAddressPayload, {
        headers,
      })
      .catch((err) => {
        expect(err.response.status).toBe(422);
        done();
      });
  });

  it('Should not create invalid addresses', (done) => {
    const createAddressPayload: createAddressPayload = {
      country: 'BR',
      zipCode: null,
      state: 'SP123',
      neighbourhood: 'Parque Nações Unidas@',
      street: 'R. Friedrich Von Voith#',
      number: 410,
    };

    axios
      .post(`${URL}/addresses`, createAddressPayload, {
        headers,
      })
      .catch((err) => {
        expect(err.response.status).toBe(422);
        done();
      });
  });

  it('Should delete an address', async () => {
    const { id } = createdAddresses[0];
    const res = await axios.delete(`${URL}/addresses/${id}`, {
      headers,
    });

    expect(res.status).toBe(200);
  });
});
