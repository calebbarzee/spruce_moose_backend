import dotenv from 'dotenv';

dotenv.config();
const outputFile = `../src/swagger-local.json`; // For generating the local swagger-local.json

const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Spruce Moose API',
    description: '🌲 SPRUCE MOOSE 🌲'
  },

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
    },

    order: {
      items: [
        {
          plantId: "641c62e9a277bac9f16ee367",
          plant: {
            scientificName: "Acer x freemanii 'Bailston'",
            commonName: "Maple First Editions® Matador",
            category: "ornamental",
            size: "5'",
            vendor: "",
            stockQty: 10,
            orderQty: 0,
            wasteQty: 0,
            price: 75,
            _id: "641c62e9a277bac9f16ee367",
            __v: 0
          },
          quantity: 5,
        }
      ],
      status: "fulfilled",
    }
  },

  // Authorizations
  securityDefinitions: {
    auth0: {
      type: 'oauth2',
      authorizationUrl: 'http://localhost:8080/login',
      flow: 'authorizationCode'
    }
  }
};

let endpointsFiles = ['../src/routes/index.ts'];
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log(`Wrote to ${outputFile}`);
});
