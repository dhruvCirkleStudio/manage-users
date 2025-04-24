import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDb } from "./utils/connection.js";
import cookieParser from "cookie-parser";
import userRouter from "./routers/user.routes.js";
import authRouter from "./routers/auth.routes.js";
import {swaggerSpec, swaggerUi} from "./utils/swagger.js";
import fileRoutes from "./routers/file.routes.js";

const app = express();
const PORT = 8000;

connectDb();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/file", fileRoutes);

app.listen(PORT,'0.0.0.0',() => {
  console.log("server is listing on port:", PORT);
});
