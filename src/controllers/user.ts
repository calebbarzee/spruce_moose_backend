import { HydratedDocument, Types } from 'mongoose';
import { IUser, UserModel } from '../models/user';

export async function getUserByEmail(email: string): Promise<HydratedDocument<IUser>> {
  const homie = await UserModel.findOne({ email });
  if (!homie) throw new Error('Homie not found with that email');
  return homie;
}

export async function getUserById(
  userId: string | Types.ObjectId
): Promise<HydratedDocument<IUser>> {
  return UserModel.findById(userId);
}

export async function createUser(user: IUser) {
  const result = await new UserModel(user);
  return await result.save();
}

export async function checkUserExist(email: string) {
  const result = await UserModel.findOne({ email });
  return result ? true : false;
}

export async function updateUser(userId: Types.ObjectId, user: IUser) {
  return await UserModel.findByIdAndUpdate(userId, user, {
    new: true
  });
}
export async function deleteUser(userId: Types.ObjectId) {
  await UserModel.findByIdAndRemove(userId);
  return;
}
