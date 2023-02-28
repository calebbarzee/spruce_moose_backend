// src/types/express/index.d.ts

import {Types} from "mongoose";

// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface Request {
      userId: Types.ObjectId
    }
  }
}