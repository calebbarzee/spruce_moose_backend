import dotenv from 'dotenv';
dotenv.config();

// const outputFile = `../src/swagger.json`;        // For generating the deployed swagger.json
const outputFile = `../src/swagger-local.json`; // For generating the local swagger-local.json

const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Spruce Moose API',
    description: '🌲 SPRUCE MOOSE 🌲'
  },

  // host: `spruce-moose-backend.onrender.com`, // Uncomment these lines for the deployed version
  // schemes: ['https'],                        // Uncomment these lines for the deployed version
  host: `localhost:8080`, // Uncomment these lines for the local version
  schemes: ['http'], // Uncomment these lines for the local version

  // Tags
  tags: [
    {
      name: 'Plants',
      description: 'CRUD operations regarding the Plant Model.'
    },
    {
      name: 'Users',
      description: 'CRUD operations regarding the User Model.'
    }
  ],

  // Definitions
  definitions: {
    user: {
      email: 'string',
      firstName: 'string',
      lastName: 'string',
      userLevel: 1 | 2,
      tokenData: {},
      cart: {},
      orders: []
    },
    newUser: {
      $firstName: 'string',
      $lastName: 'string'
    },

    error: {
      $message: 'string',
      error: {
        message: 'string'
      }
    },

    plant: {
      scientificName: 'Monstera Deliciosa',
      commonName: 'Monstera',
      category: 'Plants',
      imgUrl: 'base64 string',
      stockQty: 10,
      orderQty: 1,
      wasteQty: 3,
      price: 39.99
    }
  }
};

let endpointsFiles = ['../src/routes/index.ts'];
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log(`Wrote to ${outputFile}`);
});
