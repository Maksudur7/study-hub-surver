import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";

const app = express();
const PORT = 5000;

// ✅ Fix CORS
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.options("*", cors()); // preflight handler

app.use(express.json());

// MongoDB setup
const uri = "mongodb+srv://maksudurrahamanmishu7_db_user:x22ezW1c0S1lW4dp@cluster0.b3nlp4l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const addNewClassesCollection = client.db("studentHub").collection("studentHub");

        app.post("/studentHub", async (req, res) => {
            const newClass = req.body;
            const result = await addNewClassesCollection.insertOne(newClass);
            res.status(201).json(result);
        });

        app.get("/studentHub", async (req, res) => {
            const result = await addNewClassesCollection.find().toArray();
            res.json(result);
        });

        app.get("/", (req, res) => {
            res.send("StudentHub server is running!");
        });

    } catch (err) {
        console.error(err);
    }
}

run();

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
