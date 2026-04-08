const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");

router.use(auth); // 🔥 Protect all routes

router.post("/", createTodo);
router.get("/", getTodos);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;