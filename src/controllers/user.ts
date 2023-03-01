import {HydratedDocument} from "mongoose";
import {IUser, UserModel} from "../models/user";


export async function getUserByEmail(email: String): Promise<HydratedDocument<IUser>> {
  const homie = await UserModel.findOne({email});
  if (!homie)
    throw new Error("Homie not found with that email");
  return homie;
}