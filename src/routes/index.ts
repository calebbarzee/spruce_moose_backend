import Router, {Request} from 'express';

export const router = Router();

router.get('/', async (req: Request, res) => {
  return res.json({message: "Hello spruce moose"});
});