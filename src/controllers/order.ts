import { HydratedDocument, Types } from 'mongoose';
import { IOrder } from '../models/order';
import { IUser, UserModel } from '../models/user';
import { ICart } from '../models/cart';
import { IPlant, PlantModel } from '../models/plant';
import assert from 'assert';

export async function getOrderById(orderId: Types.ObjectId): Promise<IOrder>{

}
export async function getUserOrders(userId: Types.ObjectId): Promise<Array<IOrder>>{

} 
export async function checkout(userId: Types.ObjectId): Promise<IOrder>{

}
export async function editOrder(orderId: Types.ObjectId, newOrder: IOrder): Promise<IOrder>{

}