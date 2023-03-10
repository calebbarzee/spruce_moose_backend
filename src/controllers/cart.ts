import {UserModel} from "../models/user";
import {HydratedDocument, Types} from "mongoose";
import {ICart} from "../models/cart";
import {PlantModel} from "../models/plant";

export async function getCart(userId: Types.ObjectId): Promise<HydratedDocument<ICart>> {
  return UserModel.findById(userId).get('cart');
}

export async function addToCart(userId: Types.ObjectId, plantId: Types.ObjectId) {
  const user = await UserModel.findById(userId);
  if (!user?.cart)
    throw new Error("User ID not found");

  const plant = await PlantModel.findById(plantId);
  if (!plant)
    throw new Error("Plant ID not found")


}