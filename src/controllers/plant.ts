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

const addPlant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqBody: IPlant = {
      scientificName: req.body.scientificName,
      commonName: req.body.commonName,
      category: req.body.category,
      imgUrl: req.body.imgUrl,
      stockQty: req.body.stockQty,
      orderQty: req.body.orderQty,
      wasteQty: req.body.wasteQty,
      price: req.body.price,
    };

    const newPlant = new PlantModel(reqBody);

    const result = await newPlant.save();
    if (result === newPlant) {
      res.status(200).send({
        message: `Plant with name ${reqBody.commonName} added with ID: ${result.id}`,
      });
    } else {
      res.status(404).send({ message: `Plant not added` });
    }
  } catch (error) {
    console.log(error);
  }
};

export default { getAllPlants, getPlantById, addPlant };
