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
    newUser: {
      $firstName: 'Joe',
      $lastName: 'Momma'
    },

    error: {
      $message: 'Something went wrong.',
      error: {
        message: 'details'
      }
    }
  }
};

let endpointsFiles = ['../src/routes/index.ts'];
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log(`Wrote to ${outputFile}`);
});
