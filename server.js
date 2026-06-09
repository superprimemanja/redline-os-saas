const express = require("express");
const app = express();

app.use(express.json());

// ✅ THIS FIXES YOUR BLANK PAGE
app.get("/", (req, res) => {
  res.send("CLAW / REDLINE OS IS LIVE 🚀");
});

// test route
app.post("/run", (req, res) => {
  const input = req.body?.input || "none";

  res.json({
    system: "CLAW",
    input,
    status: "working"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Running on port", PORT);
});
