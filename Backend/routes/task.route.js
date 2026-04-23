const express = require('express');
const router = express.Router();

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/task.controller');
const { authUser } = require('../middlewares/auth.middleware');

router.get('/', authUser, getTasks);
router.post('/', authUser, createTask);
router.put('/:id', authUser, updateTask);
router.delete('/:id', authUser, deleteTask);

module.exports = router;
