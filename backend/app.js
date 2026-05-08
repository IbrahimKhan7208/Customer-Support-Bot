import "dotenv/config"
import aiRoute from "./prompt.route.js"
import express from "express"
import cors from "cors"

const app = express()
app.use(express.json());
app.use(cors())

const port = process.env.PORT

app.get('/', (req, res)=>{
    res.send("Hello")
})

app.post('/llm', aiRoute)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ChatBot API is running' });
});

app.listen(port, (req, res)=>{
    console.log("Running on", port)
})