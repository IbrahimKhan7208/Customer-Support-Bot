import { llmCall } from "./chat.js"
import {indexDocument} from "./gemini-prepare.js"
import aiRoute from "./prompt.route.js"
import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json());

const port = process.env.PORT

app.get('/', (req, res)=>{
    res.send("Hello")
})

app.post('/llm', aiRoute)

app.listen(port, (req, res)=>{
    console.log("Running on", port)
})