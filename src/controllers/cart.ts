import { IUser, UserModel } from "../models/user";
import {Types} from "mongoose";
import {ICart} from "../models/cart";
import {PlantModel} from "../models/plant";
import assert from "assert";

export async function getCart(userId: Types.ObjectId): Promise<ICart> {
  const user: IUser = await UserModel.findById(userId);
  if (!user)
    throw new Error("User ID not found");
  if (!user.cart?.items)
    user.cart = {items: []};
  console.log(user.cart);
  return user.cart;
}

export async function addToCart(userId: Types.ObjectId, plantId: Types.ObjectId) {
  const user = await UserModel.findById(userId);
  if (!user)
    throw new Error("User ID not found");
  if (!user.cart)
    user.cart = {items: []};
  console.log(`Adding to ${user.firstName}'s cart: `);

  const plant = await PlantModel.findById(plantId);
  if (!plant)
    throw new Error("Plant ID not found")

  const cart = user.cart as ICart;

  const cartEntry = cart.items.find(cartEntry => cartEntry.plantId.toString() == plantId.toString());
  if (cartEntry){
    console.log(`Found existing entry for ${plantId}: ${cartEntry}`);
    console.log(`${cartEntry.quantity} ${cartEntry.plant.commonName}(s) currently in cart`);
    cartEntry.quantity += 1;
  }
  else{
    console.log(`No entry found for ${plantId}`);
    cart.items.push({
      plantId: plantId,
      plant: plant,
      quantity: 1
    });
  }

  const result = await user.save();
  console.log(`Result after adding to cart: ${JSON.stringify(result.cart.items)}`);
}

export async function editCart(userId: Types.ObjectId, plantId: Types.ObjectId, newQuantity: number) {
  // Ensure new quantity is a positive integer
  assert(Number.isInteger(newQuantity));
  assert(newQuantity >= 0);

  // Get the User
  const user = await UserModel.findById(userId);
  if (!user)
    throw new Error("User ID not found");
  if (!user.cart)
    user.cart = {items: []};
  console.log(`Editing to ${user.firstName}'s cart: `);

  // Check for an existing cart entry
  const entry = user.cart.items.find(entry => entry.plantId.toString() == plantId.toString());
  if (!entry){
    // Create a new cart entry if it doesn't exist
    const plant = await PlantModel.findById(plantId);
    if (!plant)
      throw new Error("Plant ID not found")
    user.cart.items.push({plantId, plant, quantity: newQuantity})
  } else {
    // Update existing cart entry
    entry.quantity = newQuantity;
  }

  const result = await user.save();
  console.log(`Result after editing cart: ${JSON.stringify(result.cart.items)}`);
  return result.cart as ICart;
}

export async function clearCart(userId: Types.ObjectId) {
  const user = await UserModel.findById(userId);
  if (!user)
    throw new Error("User ID not found");
  user.cart = {items: []};
  return user.save();
}