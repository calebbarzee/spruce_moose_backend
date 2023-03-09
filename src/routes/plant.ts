import Router, { NextFunction, Request, Response } from 'express';
import { requiresAuth } from 'express-openid-connect';
import { HydratedDocument, Types } from 'mongoose';
import { IPlant } from '../models/plant';
import { getPlants, getPlantById, addPlant, updatePlant, deletePlant } from '../controllers/plant';
import { getUserById } from '../controllers/user';

export const plantRouter = Router();

plantRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  /* 
    #swagger.tags = ['Plants']
    #swagger.summary = "Gets all plants."
    #swagger.operationId = 'getAllPlants'
    #swagger.response[200] = {
      description: "Success",
    }
    #swagger.response[404] = {
      description: "Not Found"
    }
  */
  try {
    const result = await getPlants();
    if (result.length === 0) res.status(404).send({ message: 'No Plant Found' });
    else res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});

plantRouter.get('/:plantId', async (req: Request, res: Response, next: NextFunction) => {
  /* 
    #swagger.tags = ['Plants']
    #swagger.summary = "Gets plant by ID."
    #swagger.operationId = 'getPlantById'
    #swagger.response[200] = {
      description: "Success",
    }
    #swagger.response[404] = {
      description: "Not Found"
    }
  */
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
  /* 
    #swagger.tags = ['Plants']
    #swagger.summary = "Add plant to the store."
    #swagger.operationId = 'addPlant'
    #swagger.parameters['plant'] = {
      in: "body",
      description: "Plant interface",
      required: true,
      schema: { $ref: '#/definitions/plant'}
    }
    #swagger.response[200] = {
      description: "Success",
    }
    #swagger.response[403] = {
      description: "Invalid User Access"
    }
    #swagger.response[404] = {
      description: "Not Found"
    }
  */
  try {
    // Check for user level
    const id = req.userId;
    const user = await getUserById(id);

    if (user.userLevel === 1) {
      return res.status(403).json({ message: `Invalid User Access` });
    } else {
      const newPlant: HydratedDocument<IPlant> = { ...req.body };
      const result = await addPlant(newPlant);
      if (result) {
        res.status(200).send({
          message: `Plant with name ${newPlant.commonName} added with ID: ${result.id}`
        });
      } else {
        res.status(404).send({ message: `Plant not added` });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

plantRouter.put(
  '/:plantId',
  requiresAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    /* 
    #swagger.tags = ['Plants']
    #swagger.summary = "Update plant to the store."
    #swagger.operationId = 'updatePlant'
    #swagger.parameters['plant'] = {
      in: "body",
      description: "Plant interface",
      required: true,
      schema: { $ref: '#/definitions/plant'}
    }
    #swagger.response[200] = {
      description: "Success",
    }
    #swagger.response[403] = {
      description: "Invalid User Access"
    }
    #swagger.response[404] = {
      description: "Not Found"
    }
  */
    try {
      // Check for user level
      const id = req.userId;
      const user = await getUserById(id);
      if (user.userLevel === 1) {
        return res.status(403).send({ message: `Invalid User Access` });
      } else {
        const plant: IPlant = {
          ...req.body
        };
        // this is filter to look plantId
        const filter = { _id: req.params.plantId };
        const result = await updatePlant(filter, plant);
        if (result.modifiedCount === 0) {
          res.status(404).send({ message: `No Plant Modified.` });
        } else {
          res
            .status(204)
            // This doesn't really send the json but the header is updated in swagger doc
            .send({ message: `Plant with ID: ${req.params.plantId}` });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
);

// Are we going to add a potential archive list?
plantRouter.delete(
  '/:plantId',
  requiresAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    /* 
    #swagger.tags = ['Plants']
    #swagger.summary = "Update plant to the store."
    #swagger.description = "This routes updates specific plant by ID to the store"
    #swagger.operationId = 'deletePlant'
    #swagger.response[200] = {
      description: "Success",
    }
    #swagger.response[403] = {
      description: "Invalid User Access"
    }
    #swagger.response[404] = {
      description: "Not Found"
    }
  */
    try {
      // Check for user level
      const id = req.userId;
      const user = await getUserById(id);
      if (user.userLevel === 1) {
        return res.status(403).json({ message: `Invalid User Access` });
      } else {
        const id: Types.ObjectId = new Types.ObjectId(req.params.plantId);
        const result = await deletePlant(id);
        if (result.deletedCount === 0) res.status(404).send({ message: `No Plant Deleted` });
        else
          res
            .status(200)
            .send({ message: `Plant with ID: ${req.params.plantId} has been deleted.` });
      }
    } catch (error) {
      console.log(error);
    }
  }
);
