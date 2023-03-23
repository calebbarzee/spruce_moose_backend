import { HydratedDocument, Types } from "mongoose";
import { IPlant, PlantModel } from "../models/plant";

interface IUpdateOne {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId: any;
  upsertedCount: number;
  matchedCount: number;
}

interface IDeletedOne {
  acknowledged: boolean;
  deletedCount: number;
}

export const getPlants = async (): Promise<HydratedDocument<IPlant>[]> => {
  const plants = await PlantModel.find({});
  return plants.map(plant => {
    if (!plant.imgUrl)
      plant.imgUrl = "https://source.unsplash.com/random/640×480/?plant,plants,nature";
    return plant;
  });
};

export const getPlantById = async (
  plantId: Types.ObjectId | string
): Promise<HydratedDocument<IPlant>> => {
  const plant = await PlantModel.findOne({ _id: plantId });
  if (plant && !plant.imgUrl)
    plant.imgUrl = "https://source.unsplash.com/random/640×480/?plant,plants,nature";
  return plant;
};

export const addPlant = async (plant: IPlant): Promise<HydratedDocument<IPlant>> => {
  const result = new PlantModel(plant);
  return await result.save();
};

export const updatePlant = async (filter: Object, plant: IPlant): Promise<IUpdateOne> => {
  return await PlantModel.updateOne(filter, plant);
};

export const deletePlant = async (plantId: Types.ObjectId | string): Promise<IDeletedOne> => {
  return await PlantModel.deleteOne({ _id: plantId });
};
