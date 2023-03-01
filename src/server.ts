exports = {}
// NPM Modules
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Project Modules
import {router} from './routes';

// Import Config
import {config} from 'dotenv';

// Setup Config
config();


// Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


// Routes
app.use('/', router);


// Database
mongoose.set('strictQuery', true); // Suppress warning
mongoose.connect(process.env.MONGODB_URI!).then(() => {
  console.log(`|***********************************|`);
  console.log(`| Successfully connected to DB!`);
  app.listen(process.env.PORT, () => {
    console.log(`| SpruceMoose listening on port ${process.env.PORT}`);
    console.log(`|***********************************|\n`);
  });
}).catch(() => console.log("Failed to connect to database"));
