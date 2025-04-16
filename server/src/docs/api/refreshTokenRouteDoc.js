const refreshToken = {
  post: {
    tags: ["Auth"],
    summary: "Refresh Access Token",
    description: "Uses refresh token from cookie to return a new access token.",
    responses: {
      200: {
        description: "Token refreshed successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Token refreshed successfully",
                },
                accessToken: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
              },
            },
          },
        },
      },
      400: {
        description: "No token provided",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "token does not Provided!",
                },
              },
            },
          },
        },
      },
      401: {
        description: "Invalid token or user not found",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "token invalid!",
                },
              },
            },
          },
        },
      },
      403: {
        description: "Refresh token mismatch",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Refresh token does not match!",
                },
              },
            },
          },
        },
      },
      500: {
        description: "Server error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "error while refreshing token!",
                },
              },
            },
          },
        },
      },
    },
  },
};

export {refreshToken}
