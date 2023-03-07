import { HydratedDocument } from "mongoose";
import { IPlant, PlantModel } from "../models/plant";
import { Request, Response, NextFunction } from "express";

const getAllPlants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await PlantModel.find({}).then((data) => {
      if (data.length === 0)
        res.status(404).send({ message: `No Plant Found` });
      else res.status(200).send(data);
    });
  } catch (error) {
    console.log(error);
  }
};

const getPlantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await PlantModel.find({ _id: req.params.plantId }).then((data) => {
      if (!data) res.status(404).send({ message: `Plant not found` });
      else res.status(200).send(data);
    });
  } catch (error) {
    console.log(error);
  }
};

export default { getAllPlants, getPlantById };
