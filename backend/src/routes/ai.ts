import express from "express";
import { handleAiChat, handleInlineCompletion } from "../controller/ai.js";

const aiRoute = express.Router();

aiRoute.post('/', handleAiChat)
aiRoute.post('/inline', handleInlineCompletion)

export default aiRoute;