import { model, Schema } from 'mongoose';

/* 
  Interface for Produts
*/
export interface IProduct {
  stockQty: number;
  orderQty: number;
  wasteQty: number;
  price: number;
  imgUrl: string;
}

export interface IPlant extends IProduct {
  scientificName: string;
  commonName: string;
  category: string;
}

// Which ones are we gonna require?
const PlantSchema = new Schema<IPlant>({
  scientificName: { type: String, required: true },
  commonName: { type: String, required: true },
  category: { type: String, required: true },
  imgUrl: { type: String },
  stockQty: { type: Number, required: true },
  orderQty: { type: Number },
  wasteQty: { type: Number },
  price: { type: Number, required: true }
});

// Add a third parameter on model to specify which collection
export const PlantModel = model<IPlant>('plant', PlantSchema);
