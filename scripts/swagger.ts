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
    }
  }
};

let endpointsFiles = ['../src/routes/index.ts'];
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log(`Wrote to ${outputFile}`);
});
