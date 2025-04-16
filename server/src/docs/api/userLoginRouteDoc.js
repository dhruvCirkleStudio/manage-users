export const userLogin = {
  post: {
    tags: ["Auth"],
    description: "User sign in",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", example: "user@example.com" },
              password: { type: "string", example: "password12" },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Authentication successful!",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Authentication successful!",
                },
                user: {
                  type: "object",
                  properties: {
                    _id: {
                      type: "string",
                      example: "67fdfc767ae0280ff12e1d94",
                    },
                    userName: { type: "string", example: "dhruv" },
                    email: {
                      type: "stirng",
                      example: "dhruvnavadiya.cs@gmail.com",
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
                accessToken: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c...",
                },
              },
            },
          },
        },
      },
      400: {
        description: "Credentials are missing!",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Credentials are missing!",
                },
              },
            },
          },
        },
      },
      401: {
        description: "Invalid credentials!",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Invalid credentials!" },
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
                error: {
                  type: "string",
                  example: "An error occurred while authenticating User!",
                },
              },
            },
          },
        },
      },
    },
  },
};
