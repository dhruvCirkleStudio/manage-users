export const userRegister = {
  post: {
    tags: ["Users"],
    description: "User Register!",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userName: {
                type: "string",
                example: "dhruv",
              },
              email: {
                type: "string",
                example: "dhruv123@gmail.com",
              },
              password: {
                type: "string",
                example: "abc123",
              },
              gender: {
                type: "string",
                enum: ["male", "female", "other"],
                example: "male",
              },
              userType: {
                type: "string",
                enum: ["guest", "admin", "user"],
                example: "guest",
              },
              deviceType: {
                type: "string",
                enum: ["pc", "mobile", "tablet"],
                example: "pc",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "User registered successfully!",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "user added successfully!",
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
        description: "email already exists!",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "email already exists!" },
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
                  example: "An error occurred while registering User!",
                },
              },
            },
          },
        },
      },
    },
  },
};
