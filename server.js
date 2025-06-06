const express = require("express");
const cors = require("cors");
const app = express();

const connectDB = require("./connect");    
const data = require("./tasks");          

app.use(express.static("client"));
app.use(cors());            
app.use(express.json());     

app.get("/tm/tasks", async (req, res) => {
  try {
    const task = await data.find();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

app.post("/tm/tasks", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: "Task name cannot be empty." });

    const newTask = await data.create({ name: name.trim() });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/tm/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await data.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Task not found" });

    res.json({ success: true, removedTask: deleted });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove task", details: error.message });
  }
});

app.patch("/tm/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const updates = {};

  if (req.body.name !== undefined) {
    if (!req.body.name.trim()) return res.status(400).json({ error: "Task name cannot be empty." });
    updates.name = req.body.name.trim();
  }

  if (req.body.completed !== undefined) updates.completed = Boolean(req.body.completed);

  if (Object.keys(updates).length === 0) return res.status(400).json({ error: "No valid fields to update." });

  try {
    const updatedTask = await data.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const port = 8080;
const appName = "Task Manager";

(async function () {
  try {
    await connectDB();    
    app.listen(port, () => {
      console.log(`${appName} is listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Failed to connect to DB:", error);
  }
})();
