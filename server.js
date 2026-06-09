const express = require("express");

const app = express();
app.use(express.json());

// --------------------
// STATE (in-memory fast system)
// --------------------
let TASK_QUEUE = [];
let LOGS = [];

// --------------------
// HIGH-PERFORMANCE BRAIN (non-blocking, optimized)
// --------------------
function brain(input) {
  const text = (input || "").toLowerCase();

  const taskMap = [
    {
      match: ["build", "create", "make"],
      tasks: [
        "analyze requirements",
        "design system architecture",
        "generate execution plan"
      ]
    },
    {
      match: ["money", "business", "profit", "startup"],
      tasks: [
        "identify opportunity",
        "analyze market angle",
        "create monetization strategy"
      ]
    },
    {
      match: ["fix", "error", "bug", "issue"],
      tasks: [
        "diagnose problem",
        "locate root cause",
        "apply fix strategy"
      ]
    },
    {
      match: ["optimize", "speed", "performance"],
      tasks: [
        "analyze bottlenecks",
        "improve execution flow",
        "reduce latency"
      ]
    }
  ];

  for (const rule of taskMap) {
    if (rule.match.some(k => text.includes(k))) {
      return rule.tasks.map((t, i) => ({
        id: Date.now() + i,
        task: t,
        source: "claw-v3"
      }));
    }
  }

  // default intelligent fallback
  return [
    "parse input",
    "structure request",
    "generate step-by-step plan"
  ].map((t, i) => ({
    id: Date.now() + i,
    task: t,
    source: "claw-v3-default"
  }));
}

// --------------------
// NON-BLOCKING WORKER (REAL TIME SIMULATION)
// --------------------
function processQueue() {
  if (TASK_QUEUE.length === 0) return;

  const task = TASK_QUEUE.shift();

  const result = {
    task: task.task,
    status: "completed",
    timestamp: new Date().toISOString()
  };

  LOGS.push(result);

  console.log("EXECUTED:", result);
}

// fast loop without blocking event loop
setInterval(processQueue, 1000);

// --------------------
// API
// --------------------
app.get("/", (req, res) => {
  res.send("CLAW CORE v3 ONLINE ⚡ REAL-TIME ENGINE ACTIVE");
});

// main entry
app.post("/run", (req, res) => {
  const input = req.body?.input || "";

  const tasks = brain(input);

  TASK_QUEUE.push(...tasks);

  res.json({
    input,
    tasks,
    queue_size: TASK_QUEUE.length,
    status: "queued"
  });
});

// live queue
app.get("/tasks", (req, res) => {
  res.json({
    queue: TASK_QUEUE,
    length: TASK_QUEUE.length
  });
});

// execution logs
app.get("/logs", (req, res) => {
  res.json({
    logs: LOGS.slice(-50),
    total: LOGS.length
  });
});

// health check (IMPORTANT for Railway stability)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    queue: TASK_QUEUE.length,
    uptime: process.uptime()
  });
});

// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Claw v3 running on port", PORT);
});
