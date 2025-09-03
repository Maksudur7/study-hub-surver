import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";

const app = express();
const PORT = 5000;


app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());


const uri = "mongodb+srv://maksudurrahamanmishu7_db_user:WsjWoiktLwTSXjE6@cluster0.b3nlp4l.mongodb.net/studentHub?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let quizDataCollection;
let studentHubCollection;
let addTranslationCollection;

async function run() {
    try {
        await client.connect();
        const db = client.db("studentHub");

        studentHubCollection = db.collection("studentHub");
        addTranslationCollection = db.collection("addTranslation");
        quizDataCollection = db.collection("quizData");

        console.log("MongoDB connected and collections initialized!");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
    }
}
run();


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
    const result = await quizDataCollection.find().toArray();
    res.json(result);
});

app.get("/", (req, res) => {
    res.send("StudentHub server is running!");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
