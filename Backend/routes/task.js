const express = require('express');
const { getActiveTasks, getArchivedTasks, getTree, createTask, updateTask, moveTask, deleteTask } = require('../controllers/task');
const router = express.Router();

router.get('/active', getActiveTasks);
router.get('/archived', getArchivedTasks);
router.get('/tree', getTree);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.patch('/:id/move', moveTask);
router.delete('/:id', deleteTask);

module.exports = router;