import jwt from "jsonwebtoken";

export const authenticateUser = async(req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    // console.log("authHeader",authHeader);
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token is not provided!" });
    }
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("error in auth middleware:",);
    if (error instanceof jwt.JsonWebTokenError) {
      // console.log('jsonwebtokenerror ::',error, 'jwt.JsonWebTokenError',jwt.JsonWebTokenError);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Authentication failed" });
  }
};
