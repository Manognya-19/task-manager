const express = require("express");
const {
  getDashboardData,
  getUserDashboardData,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
} = require("../controllers/taskController");

const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// Dashboard routes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);

// Task management routes
router.get("/", protect, getTasks);                 // Get all tasks
router.get("/:id", protect, getTaskById);           // Get task by ID
router.post("/", protect, adminOnly, createTask);   // Create task (Admin only)
router.put("/:id", protect, updateTask);             // Update task
router.delete("/:id", protect, adminOnly, deleteTask); // Delete task (Admin only)
router.put("/:id/status", protect, updateTaskStatus);  // Update task status
router.put("/:id/todo", protect, updateTaskChecklist); // Update checklist

module.exports = router;
