const express = require('express');
const router = express.Router();
const { getUsers, getUserById, resetUserPassword } = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, getUserById);
router.put('/reset-password', protect, adminOnly, resetUserPassword);



module.exports = router;
