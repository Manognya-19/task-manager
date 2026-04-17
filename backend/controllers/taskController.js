const Task = require("../models/Task");
const User = require("../models/User");

/**
 * @desc   Get dashboard data (Admin)
 * @route  GET /api/tasks/dashboard-data
 * @access Private (Admin)
 */
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id; // coming from auth middleware

    const baseFilter = { };

    // ===== Task Counts =====
 const totalTasks = await Task.countDocuments();

const pendingTasks = await Task.countDocuments({
  status: "Pending",
});

const inProgressTasks = await Task.countDocuments({
  status: "In Progress",
});

const completedTasks = await Task.countDocuments({
  status: "Completed",
});

    // ===== Overdue Tasks =====
    const overdueTasks = await Task.countDocuments({
      ...baseFilter,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    // ===== Task Distribution =====
    const taskStatuses = ["Pending", "In Progress", "Completed"];


   const taskDistribution = {
  pending: pendingTasks,
  in_progress: inProgressTasks,
  completed: completedTasks,
};

    taskDistribution.all = totalTasks;

    // ===== Priority Levels =====
    const taskPriorities = ["Low", "Medium", "High"];

    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityLevels = {
  Low: await Task.countDocuments({ priority: "Low" }),
  Medium: await Task.countDocuments({ priority: "Medium" }),
  High: await Task.countDocuments({ priority: "High" }),
};

    // ===== Recent Tasks =====
    const recentTasks = await Task.find(baseFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    
    console.log("TASK DISTRIBUTION:", taskDistribution);
    console.log("PRIORITY:", taskPriorityLevels);
    // ===== Response =====
    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// module.exports = {
//   getDashboardData,
// };

/**
 * @desc   Get dashboard data (User)
 * @route  GET /api/tasks/user-dashboard-data
 * @access Private
 */
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // User-specific statistics
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Pending",
    });
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Completed",
    });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    // Task distribution by status
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] =
        taskDistributionRaw.find(item => item._id === status)?.count || 0;
      return acc;
    }, {});

    // Task distribution by priority
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find(item => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // Recent 10 tasks for the user
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

 /* @desc   Get all tasks
 * @route  GET /api/tasks
 * @access Private
 */
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    
    if (status) {
        filter.status = status;
    }
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate("assignedTo", "name email profileImageUrl");
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo", 
        "name email profileImageUrl"
      );
    }

    // Add completed todoChecklist count to each task
    tasks = await Promise.all(
    tasks.map(async (task) => {
        const checklist = Array.isArray(task.todoChecklist)
        ? task.todoChecklist
        : [];

        const completedCount = checklist.filter(
          (item) => item.completed
        ).length;

        return {
        ...task._doc,
        completedTodoCount: completedCount,
        };
    })
    );

    // Status summary counts
 const baseQuery =
  req.user.role === "admin"
    ? {}
    : { assignedTo: req.user._id };

    const pendingTasks = await Task.countDocuments({
      ...baseQuery,
      status: "Pending",
    });

    const inProgressTasks = await Task.countDocuments({
      ...baseQuery,
      status: "In Progress",
    });

    const completedTasks = await Task.countDocuments({
      ...baseQuery,
      status: "Completed",
    });

    const allTasks = await Task.countDocuments(baseQuery);

    res.json({
      tasks,
      statusSummary: {
        all: allTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc   Get task by ID
 * @route  GET /api/tasks/:id
 * @access Private
 */
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc   Create new task
 * @route  POST /api/tasks
 * @access Private (Admin)
 */
// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Admin only)


const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      todoChecklist,
      attachments
    } = req.body;

    // 🔴 validation
    if (!title || !description || !dueDate) {
      return res.status(400).json({
        message: "Title, description and due date are required"
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo: assignedTo || [],
      todoChecklist: Array.isArray(todoChecklist) ? todoChecklist : [],
      attachments: attachments || [],
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



/**
 * @desc   Update task
 * @route  PUT /api/tasks/:id
 * @access Private
 * **/
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res
          .status(400)
          .json({ message: "assignedTo must be an array of user IDs" });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * @desc   Delete task
 * @route  DELETE /api/tasks/:id
 * @access Private (Admin)
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({message: "Task not found"});
    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc   Update task status
 * @route  PUT /api/tasks/:id/status
 * @access Private
 */
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const assignedUsers = Array.isArray(task.assignedTo)
      ? task.assignedTo
      : [task.assignedTo];

    const isAssigned = assignedUsers.some(
      id => id.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = req.body.status || task.status;

    if (task.status === "Completed") {
      task.todoChecklist.forEach(item => (item.completed = true));
      task.progress = 100;
    }

    await task.save();

    res.json({
      message: "Task status updated",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


 /* @desc   Update task checklist
 * @route  PUT /api/tasks/:id/todo
 * @access Private
 */
// @access Private
const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ Always treat assignedTo as an array
    const assignedUsers = Array.isArray(task.assignedTo)
      ? task.assignedTo
      : [task.assignedTo];

    const isAssigned = assignedUsers.some(
      id => id.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update checklist" });
    }

    // Replace checklist
    task.todoChecklist = todoChecklist;

    // Auto-update progress
    const completedCount = task.todoChecklist.filter(
      item => item.completed
    ).length;

    const totalItems = task.todoChecklist.length;

    task.progress =
      totalItems > 0
        ? Math.round((completedCount / totalItems) * 100)
        : 0;

    // Auto-update status
    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }

    await task.save();

    res.json({
      message: "Checklist updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



module.exports = {
  getDashboardData,
  getUserDashboardData,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
};
