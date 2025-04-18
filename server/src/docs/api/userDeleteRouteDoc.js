export const deleteUserDoc = {
    delete: {
      tags: ["Users"],
      summary: "Delete a user",
      description: "Deletes a user by their ID.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "The ID of the user to delete",
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        200: {
          description: "User deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "boolean",
                    example: true
                  },
                  message: {
                    type: "string",
                    example: "data deleted successfully!"
                  },
                  data: {
                    type: "object",
                    example: {
                      _id: "6615038af2a1e5bc8c1a1234",
                      userName: "dhruv",
                      email: "dhruv123@gmail.com"
                    }
                  }
                }
              }
            }
          }
        },
        400: {
          description: "Invalid ID or credentials",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "boolean",
                    example: false
                  },
                  message: {
                    type: "string",
                    example: "invalid credentias!"
                  },
                  data: {
                    type: "object",
                    example: null
                  }
                }
              }
            }
          }
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "boolean",
                    example: false
                  },
                  message: {
                    type: "string",
                    example: "User not found!"
                  },
                  data: {
                    type: "object",
                    example: null
                  }
                }
              }
            }
          }
        },
        500: {
          description: "Server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "boolean",
                    example: false
                  },
                  message: {
                    type: "string",
                    example: "An error occured while deleting userdata"
                  },
                  data: {
                    type: "object",
                    example: null
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  