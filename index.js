import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import connectDB from "./src/config/db.js";
import authRoutes from './src/routes/auth.routes.js'
import userRoutes from "./src/routes/user.routes.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";
const PORT = process.env.PORT || 5000;

const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;


