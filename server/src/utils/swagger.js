import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { userLogin } from "../docs/api/userLoginRouteDoc.js";
import { refreshToken } from "../docs/api/refreshTokenRouteDoc.js";
import { userRegister } from "../docs/api/userRegisterRouteDoc.js";
import resetPasswordDoc from "../docs/api/resetPasswordRouteDoc.js";
import sendOtpRouteDoc from "../docs/api/sendOtpRouteDoc.js";
import forgotPasswordRouteDoc from "../docs/api/forgotPasswordRouteDoc.js";
import { getAllUsersRouteDoc } from "../docs/api/getAllUsersRouteDoc.js";
import { userUpdateData } from "../docs/api/userUpdateRouteDoc.js";
import { deleteUserDoc } from "../docs/api/userDeleteRouteDoc.js";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Manage user apis",
    version: "1.0.0",
    description:
      "This is a sample Express API application documented with Swagger",
  },
  servers: [
    {
      url: "http://localhost:8000",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT", // Optional but recommended
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    "/auth/login": userLogin,
    "/auth/refreshAccessToken": refreshToken,
    "/auth/resetPassword": resetPasswordDoc,
    "/auth/sendOtp": sendOtpRouteDoc,
    "/auth/forgotPassword": forgotPasswordRouteDoc,
    "/user/register": userRegister,
    "/user": getAllUsersRouteDoc,
    "/user/update":userUpdateData,
    "/user/delete/{id}":deleteUserDoc
  },
};
const options = {
  swaggerDefinition,
  apis: ["../docs/api/*.js"],
};
// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };
