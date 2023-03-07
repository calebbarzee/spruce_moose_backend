// If a token exists, uses the token to attach the user object on the request
// Otherwise, does nothing
import { NextFunction, Request, Response } from 'express';
import { getUserByEmail } from '../controllers/user';
import { HydratedDocument } from 'mongoose';
import { IUser } from '../models/user';

export const addUserId = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.oidc.isAuthenticated()) return next();
  else {
    if (!req.oidc.user) {
      console.log('Authenticated, but no user object 🤨');
      throw new Error('Authenticated, but no user object 🤨');
    }

    try {
      const user: HydratedDocument<IUser> = await getUserByEmail(req.oidc.user.email);
      console.log(`Found user with email ${req.oidc.user.email}: ${user._id}`);
      req.userId = user._id;
      return next();
    } catch (e) {
      console.log(`Couldn't find user with email ${req.oidc.user.email}`);
      console.log(e);
      return next();
    }
  }
};
