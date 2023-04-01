import { model, Schema } from 'mongoose';
import { CartSchema, ICart } from './cart';
import { OrderSchema } from './order';

/**
 * Just a starter Interface, Schema, and Model
 */
export type IUser = {
  email: string;
  firstName: string;
  lastName: string;
  userLevel: 1 | 2;
  tokenData: object;
  cart: ICart;
  orders: object[];
};

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userLevel: { type: Number, required: true },
  tokenData: { type: Object, required: true },
  cart: { type: CartSchema },
  orders: [OrderSchema]
});

export const UserModel = model('user', UserSchema);
