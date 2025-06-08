// backend/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LinkSaaS API',
      version: '1.0.0',
      description: 'API Documentation for LinkSaaS',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
      },
    ],
  },
  apis: ['./routes/*.js'], // lokasi dokumentasi di route
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
