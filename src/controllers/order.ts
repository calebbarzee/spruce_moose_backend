import { HydratedDocument, Types } from 'mongoose';
import { IOrder, OrderModel, OrderStatus} from '../models/order';
import { IUser, UserModel } from '../models/user';
import { ICart } from '../models/cart';
import assert from 'assert';

export async function getOrderById(orderId: Types.ObjectId): Promise<IOrder> {
  const order = OrderModel.findById(orderId);
  return order;
}

export async function getUserOrders(userId: Types.ObjectId): Promise<IUser["orders"]> {
  const user: HydratedDocument<IUser> = await UserModel.findById(userId);
  if (!user) throw new Error('User ID not found');
  if (user.userLevel === 2) {
    const orders = OrderModel.find();
    return orders; // return all orders, if admin (admin users shouldn't have orders associated with them)
  }
  return user.orders;
} 

export async function checkout(userId: Types.ObjectId): Promise<IOrder> {
  // first get the user's cart
  const user: HydratedDocument<IUser> = await UserModel.findById(userId);
  if (!user) throw new Error('User ID not found');
  const cart: ICart = user.cart;
  // second create an order from the cart
  const order: IOrder = { items: cart.items, status: OrderStatus.processing};
  // third add the order to the user's order history
  user.orders.push(order);
  // fourth clear the user's cart
  user.cart = { items: [] };
  // update the user
  await user.save();
  return order;
}
export async function editOrder(orderId: Types.ObjectId, newOrder: IOrder): Promise<IOrder> {
  OrderModel.updateOne({$_id: orderId}, {$set : newOrder});
  const order = await getOrderById(orderId);
  return order;
}