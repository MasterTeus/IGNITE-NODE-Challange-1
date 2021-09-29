const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  next();
}

app.post("/users", (request, response) => {
  const { username, name } = request.body;

  const body = {
    id: uuid(),
    username,
    name,
    todos: [],
  };

  users.push(body);

  return response.status(201).json(body);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;

  const user = users.filter((user) => user.username === username)[0];

  return response.status(201).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;
  const { title, deadline } = request.body;

  const todo = {
    id: uuid(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  const userTodos = users.filter((user) => user.username === username)[0];

  userTodos.todos.push(todo);

  return response.status(201).json(userTodos);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const userFiltred = users.find((user) => user.username === username);

  const todo = userFiltred.todos.find((user) => user.id === id);

  todo.title = title;
  todo.deadline = deadline;

  return response.status(201).json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
