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
    const newPlant: HydratedDocument<IPlant> = new PlantModel({
      scientificName: req.body.scientificName,
      commonName: req.body.commonName,
      category: req.body.category,
      imgUrl: req.body.imgUrl,
      stockQty: req.body.stockQty,
      orderQty: req.body.orderQty,
      wasteQty: req.body.wasteQty,
      price: req.body.price,
    });

    const result = await newPlant.save();
    if (result === newPlant) {
      res.status(200).send({
        message: `Plant with name ${newPlant.commonName} added with ID: ${result.id}`,
      });
    } else {
      res.status(404).send({ message: `Plant not added` });
    }
  } catch (error) {
    console.log(error);
  }
};

const updatePlant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatePlant: IPlant = {
      scientificName: req.body.scientificName,
      commonName: req.body.commonName,
      category: req.body.category,
      imgUrl: req.body.imgUrl,
      stockQty: req.body.stockQty,
      orderQty: req.body.orderQty,
      wasteQty: req.body.wasteQty,
      price: req.body.price,
    };
    // this is filter to look plantId
    const filter = { _id: req.params.plantId };

    await PlantModel.updateOne(filter, updatePlant).then((result) => {
      console.log(result);
      if (result.modifiedCount === 0) {
        res.status(404).send({ message: `No Plant Modified.` });
      } else {
        res
          .status(204)
          // This doesn't really send the json but the header is updated in swagger doc
          .send({ message: `Plant with ID: ${req.params.plantId}` });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default { getAllPlants, getPlantById, addPlant, updatePlant };
