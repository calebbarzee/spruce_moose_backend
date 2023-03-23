import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import {
  getUserByEmail,
  getUserById,
  createUser,
  checkUserExist,
  updateUser,
  deleteUser
} from '../controllers/user';
import { connectDBforTesting, disconnectDBforTesting } from './connectDBforTesting';
import { UserModel, IUser } from '../models/user';
import { faker } from '@faker-js/faker';

// Test
describe('User Model Testing', () => {
  const userInput: IUser = {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userLevel: 1,
    tokenData: {},
    cart: {
      items: []
    },
    orders: [{}]
  };

  beforeAll(async () => {
    await connectDBforTesting();
  });
  afterAll(async () => {
    await UserModel.deleteMany({
      email: { $nin: ['jackson858216047@gmail.com', 'joeljossie@gmail.com'] }
    });
    await disconnectDBforTesting();
  });

  test('Create User Test', async () => {
    // const userInput: IUser = {
    //   email: faker.internet.email(),
    //   firstName: faker.name.firstName(),
    //   lastName: faker.name.lastName(),
    //   userLevel: 1,
    //   tokenData: {},
    //   cart: {},
    //   orders: [{}]
    // };
    const createdUser = await createUser(userInput);
    expect(createdUser).toBeDefined();
    expect(createdUser.email).toBe(userInput.email);
    expect(createdUser.firstName).toBe(userInput.firstName);
    expect(createdUser.lastName).toBe(userInput.lastName);
    expect(createdUser.userLevel).toBe(userInput.userLevel);
    expect(createdUser.tokenData).toBe(userInput.tokenData);
    // expect(createdUser.cart).toBe(userInput.cart);
    // expect(createdUser.orders).toBe(userInput.orders);
  });

  test('GET USER BY EMAIL TEST', async () => {
    const user = await getUserByEmail('jackson858216047@gmail.com');
    expect(user).toBeInstanceOf(Object);
  });

  test('Get User By ID Test', async () => {
    const createdUser = await createUser(userInput);
    const fetchedUser: IUser = await getUserById(createdUser._id);
    expect(fetchedUser).toBeDefined();
    expect(fetchedUser.email).toBe(createdUser.email);
    expect(fetchedUser.firstName).toBe(createdUser.firstName);
    expect(fetchedUser.lastName).toBe(createdUser.lastName);
    expect(fetchedUser.userLevel).toBe(createdUser.userLevel);
    // expect(fetchedUser.tokenData).toBe(createdUser.tokenData);
  });

  test('UPDATE User Test', async () => {
    const createdUser = await createUser(userInput);
    const userUpdate: IUser = {
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      userLevel: 2,
      tokenData: {},
      cart: {
        items: []
      },
      orders: [{}]
    };
    await updateUser(createdUser._id, userUpdate);
    const fetchedUser: IUser = await getUserById(createdUser._id);
    expect(fetchedUser).toBeDefined();
    expect(fetchedUser.email).toBe(userUpdate.email);
    expect(fetchedUser.firstName).toBe(userUpdate.firstName);
    expect(fetchedUser.lastName).toBe(userUpdate.lastName);
    expect(fetchedUser.userLevel).toBe(userUpdate.userLevel);

    expect(fetchedUser.email).not.toBe(createdUser.email);
    expect(fetchedUser.firstName).not.toBe(createdUser.firstName);
    expect(fetchedUser.lastName).not.toBe(createdUser.lastName);
    expect(fetchedUser.userLevel).not.toBe(createdUser.userLevel);
  });

  test('DELETE User Test', async () => {
    const createdUser = await createUser(userInput);
    await deleteUser(createdUser._id);
    const fetchedUser = await getUserById(createdUser._id);
    console.log(fetchedUser);
    const fetchedUserByEmail = await checkUserExist(createdUser.email);
    console.log(fetchedUserByEmail);
    expect(fetchedUser).toBeNull();
    expect(fetchedUserByEmail).toBeTruthy();
  });
});
