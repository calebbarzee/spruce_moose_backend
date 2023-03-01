import {model, Schema} from "mongoose";

/**
 * Just a starter Interface, Schema, and Model
 */
export interface IUser {
  email: string;
  cart?: object;
  orders?: object[];
}

const UserSchema = new Schema<IUser>({
  email: {type: String, required: true, index: true}
})

export const UserModel = model("user", UserSchema);