import Router from 'express';
import { Request, Response } from 'express';
import { getOrderById, getUserOrders, editOrder, checkout } from '../controllers/order';
import { getUserById } from '../controllers/user';
import { HydratedDocument, Types } from 'mongoose';
import { IOrder } from '../models/order';
import { requiresAuth } from 'express-openid-connect';

export const orderRouter = Router();

orderRouter.get('/', requiresAuth(), async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Order']
    #swagger.summary = "Get the logged-in user\'s order history (if admin get all orders)."
    #swagger.operationId = 'getUserOrders'
    #swagger.response[200] = {
      description: "Success",
    }
    #swagger.response[400] = {
      description: "Failed to get orders for user"
    }
    #swagger.response[403] = {
      description: "Invalid User Access"
    }
   */
  try {
    const orders = await getUserOrders(req.userId);
    return res.status(200).json(orders);
  } catch (e) {
    return res.status(400).json({
      message: 'Failed to get Cart',
      error: e.message
    });
  }
});

orderRouter.get('/:orderId', requiresAuth(), async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Order']
    #swagger.summary = "Get the logged-in user\'s order history (if admin get all orders)."
    #swagger.operationId = 'getOrderById'
    #swagger.parameters['orderId'] = {
      in: "path",
      description: "Order ID",
      required: true,
      }
    #swagger.response[200] = {
      description: "Success",
    }
    #swagger.response[400] = {
      description: "Failed to get order by ID"
    }
    #swagger.response[403] = {
      description: "Invalid User Access"
    }
    #swagger.response[404] = {
      description: "Order not found"
    }
   */
  try {
    const id = req.userId;
    const orderId = new Types.ObjectId(req.params.orderId);
    const user = await getUserById(id);
      if (user.userLevel === 1) {
        return res.status(403).send({ message: `Invalid User Access` });
      }
      else {
        const order = await getOrderById(orderId); // make sure to return order interface object
        if (!order) {
          return res.status(404).send({ message: `Order not found` });
        }
        return res.status(200).json(order);
      }
  } catch (e) {
    return res.status(400).json({
      message: 'Failed to get order by ID',
      error: e.message
    });
  }
});

orderRouter.post('/', requiresAuth(), async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Order']
    #swagger.summary = "Checkout a cart and create an order."
    #swagger.operationId = 'checkout'
    #swagger.response[201] = {
      description: "Checkout successful, order created",
    }
    #swagger.response[400] = {
      description: "Failed to checkout"
    }
    #swagger.response[403] = {
      description: "Invalid User Access"
    }
   */
  try {
    const order = await checkout(req.userId);
    return res.status(201).json({
      message: `Checkout successful, User: ${req.userId} has created an order.`,
      order
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      message: 'Failed to checkout',
      error: e.message
    });
  }
});

orderRouter.put('/:orderId', requiresAuth(), async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Order']
    #swagger.summary = "Update an order."
    #swagger.description = "If the orderId does not exist."
    #swagger.operationId = 'editOrder'
    #swagger.parameters['orderId'] = {
      in: "path",
      description: "Order ID",
      required: true,
    }
    #swagger.parameters['order'] = {
      in: "body",
      description: "Order Interface",
      required: true,
      schema: { $ref: '#/definitions/order'}
    }
    #swagger.response[201] = {
      description: "Successfully updated order",
    }
    #swagger.response[400] = {
      description: "Failed to update order"
    }
    #swagger.response[403] = {
      description: "Invalid User Access"
    }
    #swagger.response[404] = {
      description: "Could not find order with that ID"
    }
   */
  try {
    const id = req.userId;
    const orderId = new Types.ObjectId(req.params.orderId);
    const order: HydratedDocument<IOrder> = { ...req.body.order };
    const user = await getUserById(id);
      if (user.userLevel === 1) {
        return res.status(403).send({ message: `Invalid User Access` });
      } else {
        const oldOrder = await getOrderById(orderId); // make sure order exists and return order interface object
        if (!oldOrder) {
          return res.status(404).send({ message: `Could not find order with that ID` });
        }
        const result = await editOrder(orderId, order);
        return res.status(201)
        .json({ order: { items: result.items }, message: 'Successfully updated order' });
      }
  } catch (e) {
    return res.status(400).json({
      message: 'Failed to update order',
      error: e.message
    });
  }
});
