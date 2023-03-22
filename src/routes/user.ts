import Router from 'express';
import { IUser } from '../models/user';
import { Request, Response } from 'express';
import {
  createUser,
  checkUserExist,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user';
export const userRouter = Router();

userRouter.post('/', async (req: Request, res: Response) => {
  /*  
  #swagger.tags = ['Users']
  #swagger.summary = "Add a new user."
  #swagger.parameters['user'] = {
    in: 'body',
    description: 'Please only add your firstName and lastName when calling this endpoint.',
    schema: { $ref: '#/definitions/newUser' }
  } 
  #swagger.responses[201] = {
    description: 'User successfully created. You will receive the new user id.',
    schema: { id: 'a random string' }
  }
  #swagger.responses[400] = {
    description: 'Failed to create a new user. You will receive an error object.',
    schema: { $ref: '#/definitions/error' }
  }
  */
  try {
    const userAlreadyExist = await checkUserExist(req.oidc.user.email);
    console.log(userAlreadyExist);
    if (userAlreadyExist) {
      return res.status(400).json({
        message: 'User already exist'
      });
    }
    const newUser: IUser = {
      ...req.body,
      email: req.oidc.user.email,
      userLevel: 1,
      tokenData: req.oidc.user
    };
    const result = await createUser(newUser);
    return res.status(201).json({ id: result._id });
  } catch (e) {
    return res.status(400).json({
      message: 'Failed to create user',
      error: e
    });
  }
});

userRouter.get('/', async (req: Request, res: Response) => {
  /*  
  #swagger.tags = ['Users']
  #swagger.summary = 'Get your user data when you are logged in and your user is created.'
  #swagger.responses[200] = {
    description: 'Able to retrieve your data. You will receive your user object.',
    schema: { $ref: '#/definitions/user' }
  }
  #swagger.responses[400] = {
    description: 'Failed to retrieve your user object. You will receive an error object.',
    schema: { $ref: '#/definitions/error' }
  }
  */
  try {
    const id = req.userId;
    return res.status(200).json(await getUserById(id));
  } catch (e) {
    return res.status(400).json({
      message: 'Failed to retrieve your data.',
      error: e
    });
  }
});

userRouter.put('/', async (req: Request, res: Response) => {
  /*  
  #swagger.tags = ['Users']
  #swagger.summary = 'Modify your user object'
  #swagger.parameters['Update Data'] = {
    in: 'body',
    description: 'Please only modify your firstName and lastName when calling this endpoint.',
    schema: { $ref: '#/definitions/newUser' }
  } 
  #swagger.responses[200] = {
    description: 'Able to update your data. You will receive your new user object.',
    schema: { $ref: '#/definitions/user' }
  }
  #swagger.responses[400] = {
    description: 'Failed to update your user object. You will receive an error object.',
    schema: { $ref: '#/definitions/error' }
  }
  */
  try {
    const updatedUser: IUser = {
      ...req.body,
      email: req.oidc.user.email,
      userLevel: 1,
      tokenData: req.oidc.user
    };

    return res.status(201).json(await updateUser(req.userId, updatedUser));
  } catch (e) {
    return res.status(400).json({
      message: 'Failed to update your data.',
      error: e
    });
  }
});

userRouter.delete('/', async (req: Request, res: Response) => {
  /*  
  #swagger.tags = ['Users']
  #swagger.summary = 'You can delete your user data in the database.'
  #swagger.responses[200] = {
    description: 'Able to delete your data. You will receive a 200 status code but no json data.',
  }
  #swagger.responses[400] = {
    description: 'Failed to delete your user object. You will receive an error object.',
    schema: { $ref: '#/definitions/error' }
  }
  */
  try {
    await deleteUser(req.userId);
    return res.sendStatus(200);
  } catch (e) {
    return res.status(400).json({
      message: 'Failed to delete your data.',
      error: e
    });
  }
});

userRouter.get('/:userId', async (req: Request, res: Response) => {
  /*  
  #swagger.tags = ['Users']
  #swagger.summary = 'Get a specific user data using the userId.'
  #swagger.responses[200] = {
    description: 'Able to retrieve user data. You will receive an user object.',
    schema: { $ref: '#/definitions/user' }
  }
  #swagger.responses[400] = {
    description: 'Failed to retrieve the user object. You will receive an error object.',
    schema: { $ref: '#/definitions/error' }
  }
  */
  try {
    const id = req.params.userId;
    return res.json(await getUserById(id));
  } catch (e) {
    return res.status(400).json({
      message: 'Failed to retrieve user data.',
      error: e
    });
  }
});
