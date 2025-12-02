import { promptController } from "./prompt.controller.js";
import express from "express"

const router = express.Router()

router.post("/llm", promptController)

export default router