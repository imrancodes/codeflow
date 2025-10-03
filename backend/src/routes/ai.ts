import express from "express";
import { handleAiChat } from "../controller/ai";

const aiRoute = express.Router();

aiRoute.post('/', handleAiChat)

export default aiRoute;