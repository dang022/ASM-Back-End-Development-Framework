import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShopOnline API',
      version: '1.0.0'
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

export const swaggerSpec = swaggerJSDoc(options);
