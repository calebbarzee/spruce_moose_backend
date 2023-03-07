import Router, { NextFunction, Request, Response } from 'express';
import { requiresAuth } from 'express-openid-connect';
import { HydratedDocument, Types } from 'mongoose';
import { IPlant } from '../models/plant';
import { getPlants, getPlantById, addPlant, updatePlant } from '../controllers/plant';

export const plantRouter = Router();

plantRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getPlants();
    if (result.length === 0) res.status(404).send({ message: 'No Plant Found' });
    else res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});

plantRouter.get('/:plantId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: Types.ObjectId = new Types.ObjectId(req.params.plantId);
    const result = await getPlantById(id);
    if (result.length === 0) res.status(404).send({ message: `Plant not found` });
    else res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});

plantRouter.post('/', requiresAuth(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newPlant: HydratedDocument<IPlant> = { ...req.body };
    const result = await addPlant(newPlant);
    if (result) {
      res.status(200).send({
        message: `Plant with name ${newPlant.commonName} added with ID: ${result.id}`
      });
    } else {
      res.status(404).send({ message: `Plant not added` });
    }
  } catch (error) {
    console.log(error);
  }
});

plantRouter.put(
  '/:plantId',
  requiresAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plant: IPlant = {
        ...req.body
      };
      // this is filter to look plantId
      const filter = { _id: req.params.plantId };

      // TODO: Refactor this to plant controller
      const result = await updatePlant(filter, plant);
      if (result.modifiedCount === 0) {
        res.status(404).send({ message: `No Plant Modified.` });
      } else {
        res
          .status(204)
          // This doesn't really send the json but the header is updated in swagger doc
          .send({ message: `Plant with ID: ${req.params.plantId}` });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

// Are we going to add a potential archive list?
plantRouter.delete('/:plantId', requiresAuth());
