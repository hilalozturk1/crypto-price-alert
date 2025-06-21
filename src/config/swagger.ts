import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Crypto Price Alert Service API",
      version: "1.0.0",
      description: "cryptocurrency price alerts.",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "http://16.170.69.224:3000/api"
            : "http://localhost:3000/api",
        description:
          process.env.NODE_ENV === "production"
            ? "Production Server"
            : "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
