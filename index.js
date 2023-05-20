const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Toys are Loading");
});

app.listen(port, (req, res) => {
  console.log(`Toy factory listening on port ${port}`);
});
