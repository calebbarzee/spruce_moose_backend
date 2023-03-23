import { IUser, UserModel } from '../models/user';
import { HydratedDocument, Types } from 'mongoose';
import { ICart } from '../models/cart';
import { IPlant, PlantModel } from '../models/plant';
import assert from 'assert';

export async function getCart(userId: Types.ObjectId): Promise<ICart> {
  const user: HydratedDocument<IUser> = await UserModel.findById(userId);
  if (!user) throw new Error('User ID not found');
  if (!user.cart?.items) user.cart = { items: [] };
  console.log(user.cart);
  // Clear any messages that were in the cart
  const returnCart: any = { ...user.cart };
  user.cart.message = '';
  await user.save();
  return returnCart._doc as ICart;
}

export async function addToCart(userId: Types.ObjectId, plantId: Types.ObjectId) {
  // Get the user
  const [user, plant] = await getUserAndPlant(userId, plantId);

  // Add the item to the cart
  const cartEntry = user.cart.items.find(
    (cartEntry) => cartEntry.plantId.toString() == plantId.toString()
  );

  if (cartEntry) {
    // Increment the quantity if one is already in the cart
    // Check for sufficient quantity in stock
    if (plant.stockQty <= cartEntry.quantity) {
      user.cart.message = getQuantityReducedMessage(plant, cartEntry.quantity + 1);
      throw new Error('Insufficient quantity in stock');
    }
    cartEntry.quantity += 1;
  } else {
    // Create the cart entry if there isn't one in cart yet
    // Check for sufficient quantity in stock
    if (plant.stockQty < 1) {
      user.cart.message = getQuantityReducedMessage(plant, 1);
      throw new Error('Insufficient quantity in stock');
    }
    user.cart.items.push({
      plantId: plantId,
      plant: plant,
      quantity: 1
    });
  }

  const result = await user.save();
  console.log(`Result after adding to cart: ${JSON.stringify(result.cart.items)}`);
}

export async function editCart(
  userId: Types.ObjectId,
  plantId: Types.ObjectId,
  newQuantity: number
) {
  // Ensure new quantity is a positive integer
  assert(Number.isInteger(newQuantity));
  assert(newQuantity >= 0);

  const [user, plant] = await getUserAndPlant(userId, plantId);

  if (plant.stockQty < newQuantity) {
    newQuantity = plant.stockQty;
    user.cart.message = getQuantityReducedMessage(plant, newQuantity);
  }

  // Check for an existing cart entry
  const entry = user.cart.items.find((entry) => entry.plantId.toString() == plantId.toString());
  if (!entry) {
    // Create a new cart entry if it doesn't exist
    user.cart.items.push({ plantId, plant, quantity: newQuantity });
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
  if (!user) throw new Error('User ID not found');
  user.cart = { items: [] };
  return user.save();
}

function getQuantityReducedMessage(plant: IPlant, requestedQuantity: number) {
  return `Could not add ${requestedQuantity} ${plant.commonName}(s) to cart because only ${plant.stockQty} are in stock.`;
}

async function getUserAndPlant(
  userId: Types.ObjectId,
  plantId: Types.ObjectId
): Promise<[HydratedDocument<IUser>, HydratedDocument<IPlant>]> {
  // Get the User
  const user = await UserModel.findById(userId);
  if (!user) throw new Error('User ID not found');
  if (!user.cart) user.cart = { items: [] };

  // Check for the plant existence
  const plant = await PlantModel.findById(plantId);
  if (!plant) throw new Error('Plant ID not found');

  return [user, plant];
}
