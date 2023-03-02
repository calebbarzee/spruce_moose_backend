import Router from "express";
import {IUser} from "../models/user";
import {Request, Response} from "express";
import {createUser} from "../controllers/user";

export const userRouter = Router();

userRouter.post('/', async (req: Request, res: Response) => {
  try {
    const newUser: IUser = {
      ...req.body,
      email: req.oidc.user.email,
      userLevel: 1
    };
    const result = await createUser(newUser);
    return res.status(201).json({id: result._id});
  } catch (e) {
    return res.status(400).json({
      message: "",
      error: e,
    });
  }
})