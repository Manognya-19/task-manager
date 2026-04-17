// controllers/userController.js
const bcrypt = require("bcryptjs");
const User = require('../models/User');
const Task = require('../models/Task');

/**
 * @desc    Get all users (Admin only) and add their task counts
 * @route   GET /api/users
 * @access  Private (admin)
 */
const getUsers = async (req, res) => {
  try {
    // Fetch users with role 'member' (exclude password field)
    const users = await User.find().select('-password');

    // For each user compute counts for different task statuses
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        // ensure we have the id value for queries
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: 'Pending',
        });

        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: 'In Progress',
        });

        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: 'Completed',
        });

        // convert mongoose doc to plain object so we can spread
        // const userObj = user.toObject();

        return {
          ...user._doc,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    res.json(usersWithTaskCounts);
  } catch (error) {
   res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get single user by id
 * @route   GET /api/users/:id
 * @access  Private
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔐 Reset Password (Admin Only)
const resetUserPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // update user password
    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  resetUserPassword
};
