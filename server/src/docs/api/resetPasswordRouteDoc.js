const resetPasswordDoc = {
  patch: {
    tags: ["Auth"],
    summary: "Reset the password for a logged-in user",
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["oldPassword", "newPassword"],
            properties: {
              oldPassword: {
                type: "string",
                example: "currentPassword123",
              },
              newPassword: {
                type: "string",
                example: "newSecurePassword456",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Password successfully changed",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "password changed!",
                },
              },
            },
          },
        },
      },
      400: {
        description: "Missing or invalid credentials",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "credentials are missing!",
                },
              },
            },
          },
        },
      },
      401: {
        description: "Wrong old password",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Entered wrong password!",
                },
              },
            },
          },
        },
      },
      404: {
        description: "User not found",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "User not found",
                },
              },
            },
          },
        },
      },
      500: {
        description: "Server error during password reset",
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

export default resetPasswordDoc;
