import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { getPlantById, getPlants, addPlant, updatePlant, deletePlant } from '../controllers/plant';
import { connectDBforTesting, disconnectDBforTesting } from './connectDBforTesting';
import { PlantModel, IPlant } from '../models/plant';
import { faker } from '@faker-js/faker';

// Test
describe('Plant Model Testing', () => {
  const plantInput: IPlant = {
    scientificName: faker.commerce.productName(),
    commonName: faker.commerce.productName(),
    category: faker.helpers.arrayElement(['plant', 'pot']),
    imgUrl: faker.image.imageUrl(),
    stockQty: faker.datatype.number({ min: 0, max: 15 }),
    orderQty: faker.datatype.number({ min: 0, max: 15 }),
    wasteQty: faker.datatype.number({ min: 0, max: 15 }),
    price: faker.datatype.number({ min: 0, max: 15 })
  };

  beforeAll(async () => {
    await connectDBforTesting();
  });
  afterAll(async () => {
    await PlantModel.collection.drop();
    await disconnectDBforTesting();
  });

  test('Create Plant Test', async () => {
    const plantInput: IPlant = {
      scientificName: faker.commerce.productName(),
      commonName: faker.commerce.productName(),
      category: faker.helpers.arrayElement(['plant', 'pot']),
      imgUrl: faker.image.imageUrl(),
      stockQty: faker.datatype.number({ min: 0, max: 15 }),
      orderQty: faker.datatype.number({ min: 0, max: 15 }),
      wasteQty: faker.datatype.number({ min: 0, max: 15 }),
      price: faker.datatype.number({ min: 0, max: 15 })
    };
    const createdPlant = await addPlant(plantInput);
    expect(createdPlant).toBeDefined();
    expect(createdPlant.scientificName).toBe(plantInput.scientificName);
    expect(createdPlant.commonName).toBe(plantInput.commonName);
    expect(createdPlant.category).toBe(plantInput.category);
    expect(createdPlant.imgUrl).toBe(plantInput.imgUrl);
    expect(createdPlant.stockQty).toBe(plantInput.stockQty);
    expect(createdPlant.orderQty).toBe(plantInput.orderQty);
    expect(createdPlant.wasteQty).toBe(plantInput.wasteQty);
    expect(createdPlant.price).toBe(plantInput.price);
  });

  test('GET ALL Plants Test', async () => {
    const plants = await getPlants();
    expect(plants).toBeInstanceOf(Array);
  });

  test('Get Plant By ID Test', async () => {
    const createdPlant = await addPlant(plantInput);
    const fetchedPlant: any = await getPlantById(createdPlant._id);
    expect(fetchedPlant).toBeDefined();
    expect(fetchedPlant.scientificName).toBe(createdPlant.scientificName);
    expect(fetchedPlant.commonName).toBe(createdPlant.commonName);
    expect(fetchedPlant.category).toBe(createdPlant.category);
    expect(fetchedPlant.imgUrl).toBe(createdPlant.imgUrl);
    expect(fetchedPlant.stockQty).toBe(createdPlant.stockQty);
    expect(fetchedPlant.orderQty).toBe(createdPlant.orderQty);
    expect(fetchedPlant.wasteQty).toBe(createdPlant.wasteQty);
    expect(fetchedPlant.price).toBe(createdPlant.price);
  });

  test('UPDATE Plant Test', async () => {
    const createdPlant = await addPlant(plantInput);
    const plantUpdate: IPlant = {
      scientificName: faker.name.firstName(),
      commonName: faker.name.lastName(),
      category: faker.helpers.arrayElement(['plant', 'pot']),
      imgUrl: faker.image.imageUrl(null, null, null, true),
      stockQty: faker.datatype.number({ min: 16, max: 30 }),
      orderQty: faker.datatype.number({ min: 16, max: 30 }),
      wasteQty: faker.datatype.number({ min: 16, max: 30 }),
      price: faker.datatype.number({ min: 16, max: 30 })
    };
    await updatePlant({ _id: createdPlant._id }, plantUpdate);
    const fetchedPlant: any = await getPlantById(createdPlant._id);
    expect(fetchedPlant).toBeDefined();
    expect(fetchedPlant.scientificName).toBe(plantUpdate.scientificName);
    expect(fetchedPlant.commonName).toBe(plantUpdate.commonName);
    // expect(fetchedPlant.category).toBe(plantUpdate.category);
    expect(fetchedPlant.imgUrl).toBe(plantUpdate.imgUrl);
    expect(fetchedPlant.stockQty).toBe(plantUpdate.stockQty);
    expect(fetchedPlant.orderQty).toBe(plantUpdate.orderQty);
    expect(fetchedPlant.wasteQty).toBe(plantUpdate.wasteQty);
    expect(fetchedPlant.price).toBe(plantUpdate.price);
    expect(fetchedPlant.scientificName).not.toBe(createdPlant.scientificName);
    expect(fetchedPlant.commonName).not.toBe(createdPlant.commonName);
    // expect(fetchedPlant.category).not.toBe(createdPlant.category);
    expect(fetchedPlant.imgUrl).not.toBe(createdPlant.imgUrl);
    expect(fetchedPlant.stockQty).not.toBe(createdPlant.stockQty);
    expect(fetchedPlant.orderQty).not.toBe(createdPlant.orderQty);
    expect(fetchedPlant.wasteQty).not.toBe(createdPlant.wasteQty);
    expect(fetchedPlant.price).not.toBe(createdPlant.price);
  });

  test('DELETE Plant Test', async () => {
    const createdPlant = await addPlant(plantInput);
    await deletePlant(createdPlant._id);
    const fetchedPlant = await getPlantById(createdPlant._id);
    console.log(fetchedPlant);
    expect(fetchedPlant).toBeNull();
  });
});
