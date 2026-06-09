const express = require("express");
const app = express();

app.use(express.json());

// simple task engine
function claw(input) {
  return {
    input,
    tasks: [
      "analyze input",
      "break into steps",
      "execute plan"
    ]
  };
}

// API
app.post("/run", (req, res) => {
  const result = claw(req.body.input);

  res.json({
    system: "CLAW CORE",
    result
  });
});

app.listen(3000, () => {
  console.log("CLAW RUNNING");
});
