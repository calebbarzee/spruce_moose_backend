import Router, { Request, Response } from "express";
import { requiresAuth } from "express-openid-connect";
import plant from "../controllers/plant";
import plantController from "../controllers/plant";

export const plantRouter = Router();

plantRouter.get("/", plantController.getAllPlants);

plantRouter.get("/:plantId", plantController.getPlantById);

plantRouter.post("/");

plantRouter.put("/:plantId");

plantRouter.delete("/:plantId");
