import Router from 'express';
import { IUser } from '../models/user';
import { Request, Response } from 'express';
import { createUser, getUserById, udpateUser } from '../controllers/user';
export const userRouter = Router();

userRouter.post('/', async (req: Request, res: Response) => {
  /*  
  #swagger.parameters['user'] = {
    in: 'body',
    description: 'Create new user AFTER successful OAuth login',
    schema: { $ref: '#/definitions/newUser' }
  } 
  */
  try {
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
  #swagger.description = 'Get your user data by ID'
  */
  try {
    const id = req.userId;
    return res.json(await getUserById(id));
  } catch (e) {
    return res.status(400).json({
      message: 'Failed to retrieve your data.',
      error: e
    });
  }
});

userRouter.put('/', async (req: Request, res: Response) => {
  /*  
  #swagger.parameters['Update Data'] = {
    in: 'body',
    description: 'Modify a user by id',
    schema: { $ref: '#/definitions/newUser' }
  } 
  */

  try {
    const updatedUser: IUser = {
      ...req.body,
      email: req.oidc.user.email,
      userLevel: 1,
      tokenData: req.oidc.user
    };

    return res.status(201).json(await udpateUser(req.userId, updatedUser));
  } catch (e) {
    return res.status(400).json({
      message: 'Failed to update your data.',
      error: e
    });
  }
});

userRouter.get('/:userId', async (req: Request, res: Response) => {
  /*  
  #swagger.parameters['userId'] = {
    in: 'path',
    description: 'Get a user by ID. Frontend should never have to use this, this is for debugging only'
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
