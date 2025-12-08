import express from "express";
import axios from "axios";

const router = express.Router();

// Get list of available models from Ollama
router.get("/models", async (req, res) => {
    try {
        const response = await axios.get(`${process.env.AI_API_URL}/api/tags`);
        const models = response.data.models || [];
        res.json({
            models: models.map((m) => ({ name: m.name, size: m.size })),
        });
    } catch (err) {
        console.error("Failed to fetch models:", err.message);
        res.status(500).json({
            message: "Failed to fetch models",
            error: err.message,
        });
    }
});

// Pull a model if not available
router.post("/pull", async (req, res) => {
    const { model } = req.body;

    if (!model) {
        return res.status(400).json({ message: "Model name is required" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
        const pullStream = await axios({
            method: "POST",
            url: `${process.env.AI_API_URL}/api/pull`,
            data: { name: model, stream: true },
            responseType: "stream",
        });

        pullStream.data.on("data", (chunk) => {
            res.write(`data: ${chunk.toString()}\n\n`);
        });

        pullStream.data.on("end", () => {
            res.write("data: [DONE]\n\n");
            res.end();
        });

        pullStream.data.on("error", (err) => {
            res.write(`data: ERROR: ${err.message}\n\n`);
            res.end();
        });
    } catch (err) {
        console.error("Failed to pull model:", err.message);
        res.write(`data: ERROR: ${err.message}\n\n`);
        res.end();
    }
});

router.post("/stream", async (req, res) => {
    const { model, messages } = req.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
        const ollamaStream = await axios({
            method: "POST",
            url: `${process.env.AI_API_URL}/api/chat`,
            data: {
                model,
                messages,
                stream: true,
            },
            responseType: "stream",
        });

        ollamaStream.data.on("data", (chunk) => {
            res.write(`data: ${chunk.toString()}\n\n`);
        });

        ollamaStream.data.on("end", () => {
            res.write("data: [DONE]\n\n");
            res.end();
        });

        ollamaStream.data.on("error", (err) => {
            res.write(`data: ERROR: ${err.message}\n\n`);
            res.end();
        });
    } catch (err) {
        console.error(err);
        res.write(`data: ERROR: ${err.message}\n\n`);
        res.end();
    }
});

export default router;
