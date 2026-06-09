const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// --------------------
// MEMORY (temporary but stable)
// --------------------
let TASK_QUEUE = [];
let LOGS = [];

// --------------------
// BRAIN (REAL + FALLBACK)
// --------------------
async function brain(input) {
  // TRY LOCAL AI (Ollama)
  try {
    const res = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: `
You are Claw, an autonomous reasoning system.
Break the input into simple actionable tasks.

Input: ${input}

Return ONLY bullet tasks.
`,
      stream: false
    });

    return res.data.response
      .split("\n")
      .filter(Boolean)
      .map((t, i) => ({
        id: Date.now() + i,
        task: t.replace("-", "").trim(),
        source: "local-ai"
      }));
  } catch (e) {
    // FALLBACK BRAIN (ALWAYS WORKS)
    const text = input.toLowerCase();

    let tasks = [];

    if (text.includes("build")) {
      tasks = ["analyze requirements", "design system", "plan implementation"];
    } else if (text.includes("money")) {
      tasks = ["find opportunity", "create strategy", "define execution plan"];
    } else if (text.includes("fix")) {
      tasks = ["diagnose issue", "identify root cause", "apply fix plan"];
    } else {
      tasks = ["parse input", "generate structured plan"];
    }

    return tasks.map((t, i) => ({
      id: Date.now() + i,
      task: t,
      source: "fallback"
    }));
  }
}

// --------------------
// AUTONOMOUS WORKER
// --------------------
setInterval(() => {
  if (TASK_QUEUE.length > 0) {
    const task = TASK_QUEUE.shift();

    const result = {
      task: task.task,
      status: "completed",
      timestamp: new Date().toISOString()
    };

    LOGS.push(result);

    console.log("EXECUTED:", result);
  }
}, 3000);

// --------------------
// API
// --------------------
app.get("/", (req, res) => {
  res.send("CLAW CORE ENGINE ONLINE 🚀");
});

// send input → system thinks → creates tasks
app.post("/run", async (req, res) => {
  const input = req.body?.input || "";

  const tasks = await brain(input);

  TASK_QUEUE.push(...tasks);

  res.json({
    input,
    tasks,
    queue_size: TASK_QUEUE.length
  });
});

// check current tasks
app.get("/tasks", (req, res) => {
  res.json(TASK_QUEUE);
});

// check execution history
app.get("/logs", (req, res) => {
  res.json(LOGS);
});

// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Claw Core running on", PORT);
});
