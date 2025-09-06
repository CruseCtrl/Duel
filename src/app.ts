import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { engagementRouter } from "./routes/engagement.js";
import { topUsersRouter } from "./routes/top-users.js";

export const app = express();

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Duel",
    version: "1.0.0",
    description: "API Documentation",
  },
  servers: [{ url: "http://localhost:3000", description: "Local server" }],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(engagementRouter);
app.use(topUsersRouter);
