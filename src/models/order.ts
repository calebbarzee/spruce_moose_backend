import { Schema, Types } from 'mongoose';
import { IPlant, PlantModel, PlantSchema } from './plant';

enum OrderStatus {processing, fulfilled, cancelled, returned}

export interface IOrder {
  items: OrderEntry[];
  status: {type: OrderStatus, default: OrderStatus.processing}
  message?: string;
}

interface OrderEntry {
  plantId: Types.ObjectId;
  plant: IPlant;
  quantity: number;
}

export const OrderSchema = new Schema<IOrder>({
  items: [
    {
      plantId: { type: Schema.Types.ObjectId, ref: PlantModel },
      plant: { type: PlantSchema, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  status: {type: OrderStatus, default: OrderStatus.processing},
  message: String
});
