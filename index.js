import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv"
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";


dotenv.config();
const app = express();
const PORT = 5000;


app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
app.use(express.json());


const uri = "mongodb+srv://maksudurrahamanmishu7_db_user:WsjWoiktLwTSXjE6@cluster0.b3nlp4l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const db = client.db("studentHub");

        studentHubCollection = db.collection("studentHub");
        addTranslationCollection = db.collection("addTranslation");
        quizDataCollection = db.collection("quizData");
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        console.log("MongoDB connected and collections initialized!");
    } finally {
        // Ensures that the client will close when you finish/error
        console.error("MongoDB connection failed:", err);
        await client.close();
    }
}
run().catch(console.dir);





const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

let quizDataCollection;
let studentHubCollection;
let addTranslationCollection;




app.post("/studentHub", async (req, res) => {
    try {
        const result = await studentHubCollection.insertOne(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: "Insert failed" });
    }
});

app.get("/studentHub", async (req, res) => {
    const result = await studentHubCollection.find().toArray();
    res.json(result);
});

app.post("/addTranslation", async (req, res) => {
    try {
        const result = await addTranslationCollection.insertOne(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: "Insert failed" });
    }
});

app.get("/addTranslation", async (req, res) => {
    const result = await addTranslationCollection.find().toArray();
    res.json(result);
});

app.post("/quizData", async (req, res) => {
    try {

        if (!quizDataCollection) {
            throw new Error("quizDataCollection not initialized!");
        }

        const result = await quizDataCollection.insertOne(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: "Insert failed" });
    }
});

app.get("/quizData", async (req, res) => {
    const result = await quizDataCollection.find().sort({ createdAt: -1 }).toArray();
    res.json(result);
});

app.delete('/quizData/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await quizDataCollection.deleteOne(filter);
    res.json(result)
})

app.patch('/quizData/:id', async (req, res) => {
    try {
        const filter = { _id: new ObjectId(req.params.id) };
        const updateDoc = { $set: req.body };
        const result = await quizDataCollection.updateOne(filter, updateDoc);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Update failed", details: err.message });
    }
});



app.post("/generate-quiz", async (req, res) => {
    const { subject, chapters } = req.body;
    console.log("Subject and chapter is heare", subject, chapters);
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a quiz generator. Return only JSON"
                },
                {
                    role: "user",
                    content: `Generate 10 multiple-choice questions from ${subject}, chapters: ${chapters}. 
          Each question should have 4 options and one correct answer.
          Return in JSON format like this:
          [
            {"question": "...", "options":["A","B","C","D"], "answer": "B"}
          ]`
                }
            ]
        });

        console.log("Response is heare", response);

        let quiz = response.choices[0].message.content;
        console.log("Quiz is heare", quiz);
        quiz = quiz.replace(/```json/g, "").replace(/```/g, "").trim();
        res.json(JSON.parse(quiz));
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Failed to generate quiz" });
    }
});
 //fixt bug



app.get("/", (req, res) => {
    res.send("StudentHub server is running!");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
