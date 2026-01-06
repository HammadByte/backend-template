import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import connectDB from "../src/config/db.js";
import authRoutes from '../src/routes/auth.routes.js';
import userRoutes from "../src/routes/user.routes.js";
import errorMiddleware from "../src/middlewares/error.middleware.js";

const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use(cors({
  origin: [
    "http://127.0.0.1:5500", // local dev
    "http://localhost:5500",  // sometimes browser uses this
    "http://127.0.0.1:5500" // production frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorMiddleware);

app.get("/", (req, res) => {
res.send("ESM Backend running on Vercel 🚀");
})

export default app;


