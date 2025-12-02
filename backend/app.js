import { llmCall } from "./chat.js"
import {indexDocument} from "./gemini-prepare.js"
import aiRoute from "./prompt.route.js"
import express from "express"
import cors from "cors"

const app = express()
app.use(express.json());
app.use(cors({
  origin: [
    "https://customer-support-bot-wxgu.onrender.com",
    "https://customer-support-bot-backend-r3c4.onrender.com",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());
const port = process.env.PORT

app.get('/', (req, res)=>{
    res.send("Hello")
})

app.post('/llm', aiRoute)

app.listen(port, (req, res)=>{
    console.log("Running on", port)
})