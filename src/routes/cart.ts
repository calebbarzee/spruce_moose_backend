import Router from "express";
import { Request, Response } from "express";
import { addToCart, clearCart, editCart, getCart } from "../controllers/cart";
import { Types } from "mongoose";
import { requiresAuth } from "express-openid-connect";

export const cartRouter = Router();

cartRouter.get("/", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Cart']
    #swagger.summary = "Get the logged-in user's shopping cart."
    #swagger.operationId = 'getCart'
    #swagger.response[200] = {
      description: "Success",
    }
    #swagger.response[400] = {
      description: "Failed to get cart for user"
    }
    #swagger.response[403] = {
      description: "Invalid User Access"
    }
   */
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
  /*
    #swagger.tags = ['Cart']
    #swagger.summary = "Add an item to the cart."
    #swagger.operationId = 'addToCart'
    #swagger.parameters['plantId'] = {
      in: "path",
      description: "ID of the plant being added to cart",
      required: true,
    }
    #swagger.response[201] = {
      description: "Successfully added to cart",
    }
    #swagger.response[400] = {
      description: "Failed to add to cart"
    }
    #swagger.response[403] = {
      description: "Invalid User Access"
    }
    #swagger.response[404] = {
      description: "Could not find plant with that ID"
    }
   */
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
  /*
    #swagger.tags = ['Cart']
    #swagger.summary = "Clear the cart, removing all items in it."
    #swagger.operationId = 'clearCart'
    #swagger.response[204] = {
      description: "Successfully cleared cart",
    }
    #swagger.response[400] = {
      description: "Failed to clear cart"
    }
    #swagger.response[403] = {
      description: "Invalid User Access"
    }
   */
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
  /*
    #swagger.tags = ['Cart']
    #swagger.summary = "Update or set an item's quantity in the cart."
    #swagger.description = "If the plantId does not yet exist in the cart, this will add it with the quantity specified."
    #swagger.operationId = 'editCart'
    #swagger.parameters['cartEntry'] = {
      in: "body",
      description: "Updated cart entry",
      required: true,
      schema: { $ref: '#/definitions/cartEntry'}
    }
    #swagger.response[201] = {
      description: "Successfully updated cart",
    }
    #swagger.response[400] = {
      description: "Failed to update cart"
    }
    #swagger.response[403] = {
      description: "Invalid User Access"
    }
    #swagger.response[404] = {
      description: "Could not find plant with that ID"
    }
   */
  try {
    const plantId = new Types.ObjectId(req.params.plantId);
    const {newQuantity} = req.body;
    const result = await editCart(req.userId, plantId, newQuantity);
    return res.status(201).json({cart: { items: result.items }, message: "Successfully updated cart"});
  } catch (e) {
    return res.status(400).json({
      message: "Failed to update cart",
      error: e
    });
  }
})