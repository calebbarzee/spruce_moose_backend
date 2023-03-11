import Router, { Request, Response } from 'express';
import { auth } from 'express-openid-connect';
import { addUserId } from '../middleware/auth';
import { logRequestInfo } from '../middleware/log';
import { config } from 'dotenv';
import { userRouter } from './user';
import { plantRouter } from './plant';
import swaggerUi from 'swagger-ui-express';
import { cartRouter } from "./cart";

// DotEnv Config
config();

export const router = Router();

// Auth0 config
const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

// Middleware
router.use(auth(authConfig));
router.use(addUserId);
router.use(logRequestInfo);

// Swagger
// Get the filename from the .env by default for easier testing on both localhost and Render
const swaggerPath = `../${process.env.SWAGGER_JSON_FILENAME}` || '../swagger.json';
const swaggerDoc = require(swaggerPath);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

router.get('/', async (req: Request, res: Response) => {
  // #swagger.ignore = true

  return res.redirect('/api-docs');
});

router.get('/logout', (res: Response) => {
  return res.send('You are logged out now!');
});

router.use('/user', userRouter);
router.use('/plant', plantRouter);
router.use('/cart', cartRouter);
