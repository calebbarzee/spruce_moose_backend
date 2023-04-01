import dotenv from 'dotenv';

dotenv.config();
const outputFile = `../src/swagger.json`; // For generating the deployed swagger.json

const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Spruce Moose API',
    description: '🌲 SPRUCE MOOSE 🌲'
  },

  host: `spruce-moose-backend.onrender.com`, // Uncomment these lines for the deployed version
  schemes: ['https'], // Uncomment these lines for the deployed version

  // Tags
  tags: [
    {
      name: 'Plants',
      description: 'CRUD operations regarding the Plant Model.'
    },
    {
      name: 'Users',
      description: 'CRUD operations regarding the User Model.'
    },
    {
      name: 'Cart',
      description: "CRUD operations for interacting with a user's shopping cart."
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
      category: 'ornamental',
      vendor: 'bunnings',
      imgUrl: 'https://source.unsplash.com/random/640×480/?plant,plants,nature',
      stockQty: 10,
      orderQty: 1,
      wasteQty: 3,
      price: 39.99
    },

    cartEntry: {
      plantId: '640761fc6a186b04e603c1ed',
      quantity: 5
    }
  },

  // Authorizations
  securityDefinitions: {
    auth0: {
      type: 'oauth2',
      authorizationUrl: 'https://spruce-moose-backend.onrender.com/login', // Uncomment this line for production
      flow: 'authorizationCode'
    }
  }
};

const endpointsFiles = ["../src/routes/index.ts"];
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log(`Wrote to ${outputFile}`);
});
