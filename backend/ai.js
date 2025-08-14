import express from "express"
import "dotenv/config"
import { OpenAI } from "openai"
import cors from "cors"

const app = express()

app.use(express.json())

app.use(
  cors({
    origin: "*", // allow all domains
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // allowed headers
  })
);

const port = process.env.PORT || 3000
const openai = new OpenAI()

app.post("/persona-ai", async (req, res) => {

    try {

        const {systemPrompt,messages} = req.body;

        if(!systemPrompt || !messages){
            return res.status(400).json({
                message:"Missing systemPrompt or messages"
            })
        }

        console.log(systemPrompt)
        console.log(messages)
    
    
    
        const reposnse = await openai.chat.completions.create({
            model:"gpt-4.1-mini",
            messages: [
                {role:"system",content:systemPrompt},
                ...messages
            ],
    
        })
    
        res.status(200).json({
            messages:reposnse.choices[0].message.content
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Something went wrong"
        })
        
    }

})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})