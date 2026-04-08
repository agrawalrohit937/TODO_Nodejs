const Todo = require("../models/todoModel");

// Create Todo
exports.createTodo = async (req, res) => {
  const todo = await Todo.create({
    title: req.body.title,
    user: req.user._id,
  });
  res.json(todo);
};

// Get User Todos
exports.getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user._id });
  res.json(todos);
};

// Update
exports.updateTodo = async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(todo);
};

// Delete
exports.deleteTodo = async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};