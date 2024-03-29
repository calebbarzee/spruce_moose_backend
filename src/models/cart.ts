import { Schema, Types } from 'mongoose';
import { IPlant, PlantModel, PlantSchema } from './plant';

export type ICart = {
  items: CartEntry[];
  message?: string;
}

type CartEntry = {
  plantId: Types.ObjectId;
  plant: IPlant;
  quantity: number;
}

export const CartSchema = new Schema<ICart>({
  items: [
    {
      plantId: { type: Schema.Types.ObjectId, ref: PlantModel },
      plant: { type: PlantSchema, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  message: String
});
