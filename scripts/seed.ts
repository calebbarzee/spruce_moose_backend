import * as seedData from './inv_2023.json';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { PlantModel } from '../src/models/plant';
config();

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_TEST_URI).then(async () => {
  console.log('connected successfully to DB 🌲');
  await PlantModel.deleteMany({});
  const allPlants = await PlantModel.find({});
  console.log(`Plants collection: ${allPlants}`);
  const plantPromises = [];
  seedData.plants.forEach((plant) => {
    console.log(`Adding ${plant.commonName} to plants collection`);
    plantPromises.push(PlantModel.create(plant));
  });
  await Promise.all(plantPromises);
  console.log('finished 👍');
  mongoose.disconnect().then(() => {
    console.log('disconnected from db 🌲');
  });
});
