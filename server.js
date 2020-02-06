const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(bodyParser.json())
app.use(cors());
const connectionString="mongodb+srv://webapp:test@cluster0-kvhsk.mongodb.net/db-a1?retryWrites=true&w=majority";
//const connectionString="mongodb://localhost/db-a1"
const manager = require("./manager.js");
const m = manager(connectionString);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// Get all
app.get("/api/cars", (req, res) => {
  m.carGetAll()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Get one
app.get("/api/cars/:id", (req, res) => {
  m.carGetById(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error)
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Add new
app.post("/api/cars", (req, res) => {
  m.carAdd(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Edit existing
app.put("/api/cars/:id", (req, res) => {
  m.carEdit(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Delete item
app.delete("/api/cars/:id", (req, res) => {
  m.carDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

app.use((req, res) => {
  res.status(404).send("Resource not found");
});

m.connect().then(() => {
  app.listen(HTTP_PORT, () => { console.log("Ready to handle requests on port " + HTTP_PORT) });
})
  .catch((err) => {
    console.log("Unable to start the server:\n" + err);
    process.exit();
  });
