import Router from "express";
import { Request, Response } from "express";
import { addToCart, clearCart, editCart, getCart } from "../controllers/cart";
import { Types } from "mongoose";
import { requiresAuth } from "express-openid-connect";

export const cartRouter = Router();

cartRouter.get("/", async (req: Request, res: Response) => {
  try {
    const cart = await getCart(req.userId);
    return res.status(200).json(cart);
  } catch (e) {
    return res.status(400).json({
      message: "Failed to get Cart",
      error: e
    });
  }
});

cartRouter.post("/:plantId", requiresAuth(), async (req: Request, res: Response) => {
  try {
    const plantId = new Types.ObjectId(req.params.plantId);
    await addToCart(req.userId, plantId);
    return res.status(201).json({
      message: `Added ${plantId} to cart`
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      message: "Failed to add to cart",
      error: e
    });
  }
});

cartRouter.delete("/", requiresAuth(), async (req: Request, res: Response) => {
  try {
    await clearCart(req.userId);
    return res.status(204).json({ message: "Cart cleared" });
  } catch (e) {
    return res.status(400).json({
      message: "Failed to clear cart",
      error: e
    });
  }
});

cartRouter.put("/:plantId", requiresAuth(), async (req: Request, res: Response) => {
  try {
    const plantId = new Types.ObjectId(req.params.plantId);
    const {newQuantity} = req.body;
    const result = await editCart(req.userId, plantId, newQuantity);
    return res.status(201).json({cart: { items: result.items }, message: "Successfully updated cart"});
  } catch (e) {
    return res.status(400).json({
      message: "Failed to edit cart",
      error: e
    });
  }
})