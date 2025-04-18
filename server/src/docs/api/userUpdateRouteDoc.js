export const userUpdateData = {
    post: {
      tags: ["Users"],
      description: "User data update!",
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
          description: "User data updated successfully!",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status:{
                    type: "Boolean",
                    example: true,
                  },
                  message: {
                    type: "string",
                    example: "user added successfully!",
                  },
                  data: {
                    type: "Object",
                    example: null,
                  },
                },
              },
            },
          },
        },
        400: {
          description: "some fields are missing!",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status:{
                    type: "Boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Credentials are missing!",
                  },
                  data: {
                    type: "Object",
                    example: null,
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
                  status:{
                    type: "Boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "An error occurred while registering User!",
                  },
                  data: {
                    type: "Object",
                    example: null,
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  