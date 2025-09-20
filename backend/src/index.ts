import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./connection";
import userRoute from "./routes/user";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const mongoUrl = process.env.DATABASE_URL;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", userRoute);

if (!mongoUrl) {
  throw new Error("DATABASE_URL is not defined in .env");
}

dbConnection(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
