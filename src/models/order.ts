import { model, Schema, Types } from 'mongoose';
import { IPlant, PlantModel, PlantSchema } from './plant';

export enum OrderStatus {
  processing = 'processing',
  fulfilled = 'fulfilled',
  cancelled = 'cancelled',
  returned = 'returned'
}

export type IOrder = {
  items: OrderEntry[];
  status: OrderStatus;
  message?: string;
}


type OrderEntry = {
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
  status: 
    {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.processing,
    required: true
    },
  message: String
});

export const OrderModel = model<IOrder>('order', OrderSchema);