const sendOtpRouteDoc = {
  post: {
    tags: ["Auth"],
    summary: "Send OTP to user email for verification",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email"],
            properties: {
              email: {
                type: "string",
                format: "email",
                example: "dhruv01@gmail.com",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "OTP sent successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "otp send successfull :",
                },
              },
            },
          },
        },
      },
      400: {
        description: "Email is missing",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "email is required!",
                },
              },
            },
          },
        },
      },
      401: {
        description: "User does not exist",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "User does not exist!",
                },
              },
            },
          },
        },
      },
      500: {
        description: "Server error while sending OTP",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "error occured while sending otp!",
                },
              },
            },
          },
        },
      },
    },
  },
};

export default sendOtpRouteDoc;
