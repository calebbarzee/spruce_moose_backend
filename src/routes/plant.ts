import Router, { Request, Response } from "express";
import { requiresAuth } from "express-openid-connect";
import plant from "../controllers/plant";
import plantController from "../controllers/plant";

export const plantRouter = Router();

plantRouter.get("/", plantController.getAllPlants);

plantRouter.get("/:plantId", plantController.getPlantById);

plantRouter.post("/", requiresAuth(), plantController.addPlant);

plantRouter.put("/:plantId", requiresAuth(), plantController.updatePlant);

// Are we going to add a potential archive list?
plantRouter.delete("/:plantId", requiresAuth());
