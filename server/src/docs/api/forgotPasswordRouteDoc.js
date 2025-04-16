const forgotPasswordRouteDoc = {
    patch: {
    tags: ["Auth"],
    summary: "Reset user password using email and OTP",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "otp", "newPassword"],
            properties: {
              email: {
                type: "string",
                format: "email",
                example: "dhruv01@gmail.com",
              },
              otp: {
                type: "integer",
                example: 123456,
              },
              newPassword: {
                type: "string",
                example: "newSecurePass@123",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Password reset successful",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Password forgot successfully",
                },
              },
            },
          },
        },
      },
      400: {
        description: "Missing credentials or expired OTP",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "otp expired!",
                },
              },
            },
          },
        },
      },
      401: {
        description: "Invalid OTP",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Invalid OTP.",
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
                  example: "User not found.",
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
                  example: "Faild to forget Password!",
                },
              },
            },
          },
        },
      },
    },
  },
};

export default forgotPasswordRouteDoc;
