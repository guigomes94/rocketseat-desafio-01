const express = require("express");
const server = express();

server.use(express.json());

//Variables

let numberOfRequests = 0;
const projects = [
  { id: "1", title: "Novo Projeto", tasks: [] },
  { id: "2", title: "Backend NodeJS", tasks: [] },
  { id: "3", title: "Mobile", tasks: [] }
];

//Midlewares

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

//CRUD

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  return res.json(projects[id]);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;

  projects[id].tasks.push(tasks);

  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].title = title;
  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  projects.splice(id, 1);

  return res.send("Sucess");
});

server.listen(3000);
