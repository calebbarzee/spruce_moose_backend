import {Schema} from "mongoose";
import {IPlant, PlantSchema} from "./plant";

export interface ICart {
  plants: CartEntry[]
}

interface CartEntry {
  plant: IPlant[],
  quantity: number
}


export const CartSchema = new Schema({
  plants: [{
    plant: PlantSchema,
    quantity: Number
  }]
});
