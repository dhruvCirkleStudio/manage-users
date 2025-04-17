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
                status:{
                  type: "Boolean",
                  example: true,
                },
                message: {
                  type: "string",
                  example: "otp send successfull :",
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
        description: "Email is missing",
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
                  example: "email is required!",
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
      401: {
        description: "User does not exist",
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
                  example: "User does not exist!",
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
        description: "Server error while sending OTP",
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
                  example: "error occured while sending otp!",
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

export default sendOtpRouteDoc;
