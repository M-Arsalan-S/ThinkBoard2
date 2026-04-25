import express from "express";
import cors from "cors"; // its a browser security rule
import dotenv from "dotenv"; // for using env variable
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// connectDB();

// middleware - famous use case is auth check, here we do rate limiting
// app.use(cors()); OR  (must be at the beginning)

if(process.env.NODE_ENV !== "production"){
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }));
}

app.use(express.json());
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req,res) => {
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    });
}

// What is an Endpoint/Route?
// It's a combination of URL+HTTP method that lets the client interact with a specific resource.

// Put in routes file
// the functions inside are controllers

// app.get("/api/notes", (req, res) => {
//     res.status(200).send("You got 20 notes");
// });

// app.post("/api/notes", (req, res) => {
//     res.status(201).json({message: "Note created successfully"});
// });

// app.put("/api/notes/:id", (req, res) => {
//     res.status(200).json({message: "Note updated successfully"});
// });

// app.delete("/api/notes/:id", (req, res) => {
//     res.status(200).json({message: "Note deleted successfully"});
// });

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on PORT: ${PORT}`);
    });
})
