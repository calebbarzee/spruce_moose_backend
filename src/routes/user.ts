import Router from 'express';
import { IUser } from '../models/user';
import { Request, Response } from 'express';
import { createUser, getUserById } from '../controllers/user';
import { requiresAuth } from 'express-openid-connect';

export const userRouter = Router();

userRouter.post('/', requiresAuth(), async (req: Request, res: Response) => {
  /*  #swagger.parameters['user'] = {
         in: 'body',
         description: 'Create new user AFTER successful OAuth login',
         schema: { $ref: '#/definitions/newUser' }
   } */
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

userRouter.get('/:userId', requiresAuth(), async (req: Request, res: Response) => {
  /*  #swagger.parameters['userId'] = {
       in: 'path',
       description: 'Get a user by ID. Frontend should never have to use this, this is for debugging only',
       schema: { $ref: '#/definitions/newUser' }
 } */
  try {
    const id = req.params.userId;
    return res.json(await getUserById(id));
  } catch (e) {
    return res.status(400).json({
      message: '',
      error: e
    });
  }
});
