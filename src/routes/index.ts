import Router, {Request} from 'express';
import {auth, requiresAuth} from "express-openid-connect";
import {addUserId} from "../middleware/auth";
import {logRequestInfo} from "../middleware/log";
import {config} from "dotenv";
import {userRouter} from "./user";
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


router.get('/', async (req: Request, res) => {
  return res.json({message: "Hello spruce moose"});
});

router.use('/user', userRouter)