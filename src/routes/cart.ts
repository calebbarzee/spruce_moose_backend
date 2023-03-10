import Router from "express";
import {Request, Response} from "express";
import {addToCart, getCart} from "../controllers/cart";
import {Types} from "mongoose";

export const cartRouter = Router();

cartRouter.get('/', async (req: Request, res: Response) => {
  try {
    const cart = getCart(req.userId);
    return res.status(200).json(cart);
  } catch (e) {
    return res.status(400).json({
      message: "Failed to get Cart",
      error: e,
    });
  }
})

cartRouter.post('/:plantId', async (req: Request, res: Response) => {
  try {
    // TODO
    const plantId = new Types.ObjectId(req.params.plantId);
    await addToCart(req.userId, plantId);
  } catch (e) {
    return res.status(400).json({
      message: "",
      error: e,
    });
  }
})