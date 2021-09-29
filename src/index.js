const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

// Middlewares
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(401).json({ error: "User not found" });
  }

  request.user = user;

  return next();
}
function checksExistsTodos(request, response, next) {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(401).json({ error: "Is todo not exist" });
  }

  request.todo = todo;

  return next();
}

// Routes
app.post("/users", (request, response) => {
  const { username, name } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({
      error: "User already exists",
    });
  }

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
  const { user } = request;

  return response.status(201).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuid(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).json(user);
});

app.put(
  "/todos/:id",
  checksExistsUserAccount,
  checksExistsTodos,
  (request, response) => {
    const { title, deadline } = request.body;
    const { todo } = request;

    todo.title = title;
    todo.deadline = deadline;

    return response.status(201).json(todo);
  }
);

app.patch(
  "/todos/:id/done",
  checksExistsUserAccount,
  checksExistsTodos,
  (request, response) => {
    const { todo } = request;

    todo.done = true;

    return response.status(201).send();
  }
);

app.delete(
  "/todos/:id",
  checksExistsUserAccount,
  checksExistsTodos,
  (request, response) => {
    const { todo, user } = request;

    user.todos.splice(todo, 1);

    return response.status(204).json(user.todos);
  }
);

module.exports = app;
