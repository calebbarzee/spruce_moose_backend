import { model, Schema, Types } from 'mongoose';

/* 
  Interface for Products
*/
export interface IProduct {
  _id?: string | Types.ObjectId;
  stockQty: number;
  orderQty: number;
  wasteQty: number;
  price: number;
  imgUrl: string;
  vendor?: string;
}

export interface IPlant extends IProduct {
  scientificName: string;
  commonName: string;
  category: string;
  size: string;
}

// Which ones are we gonna require?
export const PlantSchema = new Schema<IPlant>({
  scientificName: { type: String, required: true },
  commonName: { type: String, required: true },
  category: { type: String, required: true },
  size: { type: String },
  vendor: { type: String },
  imgUrl: { type: String },
  stockQty: { type: Number, required: true },
  orderQty: { type: Number },
  wasteQty: { type: Number },
  price: { type: Number, required: true },
});

// Add a third parameter on model to specify which collection
export const PlantModel = model<IPlant>('plant', PlantSchema);
