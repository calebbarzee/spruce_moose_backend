import {model, Schema} from "mongoose";

/**
 * Just a starter Interface, Schema, and Model
 */
export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  userLevel: 1 | 2;
  tokenData: object;
  cart?: object;
  orders?: object[];
}

const OrderSchema = new Schema({

})

const UserSchema = new Schema<IUser>({
  email: {type: String, required: true, index: true},
  orders: [OrderSchema],
})

export const UserModel = model("user", UserSchema);