import express from 'express';
import {
  createTask,
  updateTask,
  markDone,
  deleteTask,
  listTasks,
  dueTasks,
  priorityChart,
  completionChart
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/done', markDone);
router.delete('/:id', deleteTask);
router.get('/', listTasks);
router.get('/due', dueTasks);
router.get('/charts/priority', priorityChart);
router.get('/charts/completion', completionChart);

export default router;