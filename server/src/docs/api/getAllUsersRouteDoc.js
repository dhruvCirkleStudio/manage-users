export const getAllUsersRouteDoc = {
  get: {
    summary: "Get all users",
    description: "Retrieve a list of all users from the database",
    tags: ["Users"],
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {
      200: {
        description: "Successfully retrieved users",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "success",
                },
                users: {
                  type: "array",
                  items: {
                    _id: {
                      type: "string",
                      example: "67fdfc767ae0280ff12e1d94",
                    },
                    userName: { type: "string", example: "dhruv" },
                    email: {
                      type: "stirng",
                      example: "dhruv01@gmail.com",
                    },
                    gender: {
                      type: "stirng",
                      example: "male",
                    },
                    userType: {
                      type: "stirng",
                      example: "guest",
                    },
                    deviceType: {
                      type: "stirng",
                      example: "pc",
                    },
                    createdAt: {
                      type: "stirng",
                      example: "2025-04-15T06:28:06.959Z",
                    },
                    updatedAt: {
                      type: "stirng",
                      example: "2025-04-16T10:32:16.732Z",
                    },
                    __v: { type: "number", example: 0 },
                    token: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                  },
                },
              },
            },
          },
        },
      },
      500: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "something went wrong!",
                },
              },
            },
          },
        },
      },
    },
  },
};
