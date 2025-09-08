// api/index.js
import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ----------------- MongoDB setup -----------------
const userName = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${userName}:${password}@cluster0.b3nlp4l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let client;
async function getClient() {
    if (!client) {
        client = new MongoClient(uri, {
            serverApi: { version: ServerApiVersion.v1 },
        });
        await client.connect();
    }
    return client;
}

// ----------------- OpenAI setup -----------------
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ----------------- Routes -----------------

// Root
app.get("/", (req, res) => {
    res.send("StudentHub server is running!");
});

// studentHub
app.post("/studentHub", async (req, res) => {
    try {
        const client = await getClient();
        const collection = client.db("studentHub").collection("studentHub");
        const result = await collection.insertOne(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/studentHub", async (req, res) => {
    try {
        const client = await getClient();
        const collection = client.db("studentHub").collection("studentHub");
        const result = await collection.find().toArray();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// addTranslation
app.post("/addTranslation", async (req, res) => {
    try {
        const client = await getClient();
        const collection = client.db("studentHub").collection("addTranslation");
        const result = await collection.insertOne(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/addTranslation", async (req, res) => {
    try {
        const client = await getClient();
        const collection = client.db("studentHub").collection("addTranslation");
        const result = await collection.find().toArray();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// quizData
app.post("/quizData", async (req, res) => {
    try {
        const client = await getClient();
        const collection = client.db("studentHub").collection("quizData");
        const result = await collection.insertOne(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/quizData", async (req, res) => {
    try {
        const client = await getClient();
        const collection = client.db("studentHub").collection("quizData");
        const result = await collection.find().sort({ createdAt: -1 }).toArray();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete("/quizData/:id", async (req, res) => {
    try {
        const client = await getClient();
        const collection = client.db("studentHub").collection("quizData");
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.patch("/quizData/:id", async (req, res) => {
    try {
        const client = await getClient();
        const collection = client.db("studentHub").collection("quizData");
        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// addTask
app.post("/addTask", async (req, res) => {
    try {
        const client = await getClient();
        const collection = client.db("studentHub").collection("addTask");
        const result = await collection.insertOne(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/addTask", async (req, res) => {
    try {
        const client = await getClient();
        const collection = client.db("studentHub").collection("addTask");
        const result = await collection.find().toArray();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete("/addTask/:id", async (req, res) => {
    try {
        const client = await getClient();
        const collection = client.db("studentHub").collection("addTask");
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.patch("/addTask/:id", async (req, res) => {
    try {
        const client = await getClient();
        const collection = client.db("studentHub").collection("addTask");
        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// addGole
app.post("/addGole", async (req, res) => {
    try {
        const client = await getClient();
        const collection = client.db("studentHub").collection("addGole");
        const result = await collection.insertOne(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/addGole", async (req, res) => {
    try {
        const client = await getClient();
        const collection = client.db("studentHub").collection("addGole");
        const result = await collection.find().toArray();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete("/addGole/:id", async (req, res) => {
    try {
        const client = await getClient();
        const collection = client.db("studentHub").collection("addGole");
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// generate-quiz
app.post("/generate-quiz", async (req, res) => {
    const { subject, chapters } = req.body;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a quiz generator. Return only JSON" },
                {
                    role: "user",
                    content: `Generate 10 multiple-choice questions from ${subject}, chapters: ${chapters}. Each question should have 4 options and one correct answer. Return in JSON format like this: [{"question":"...","options":["A","B","C","D"],"answer":"B"}]`,
                },
            ],
        });

        let quiz = response.choices[0].message.content;
        quiz = quiz.replace(/```json/g, "").replace(/```/g, "").trim();
        res.json(JSON.parse(quiz));
    } catch (err) {
        res.status(500).json({ error: "Failed to generate quiz", details: err.message });
    }
});

// ----------------- Export serverless handler -----------------
export const handler = serverless(app);
