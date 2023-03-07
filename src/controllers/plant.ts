import { HydratedDocument } from "mongoose";
import { IPlant, PlantModel } from "../models/plant";
import { Types } from "mongoose";
interface IUpdateOne {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId: any;
  upsertedCount: number;
  matchedCount: number;
}

export const getPlants = async (): Promise<HydratedDocument<IPlant>[]> => {
  return await PlantModel.find({});
};

export const getPlantById = async (
  plantId: Types.ObjectId
): Promise<HydratedDocument<IPlant>[]> => {
  return await PlantModel.find({ _id: plantId });
};

export const addPlant = async (
  plant: IPlant
): Promise<HydratedDocument<IPlant>> => {
  const result = new PlantModel(plant);
  return await result.save();
};

export const updatePlant = async (
  filter: Object,
  plant: IPlant
): Promise<IUpdateOne> => {
  return await PlantModel.updateOne(filter, plant);
};
