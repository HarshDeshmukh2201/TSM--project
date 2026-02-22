import Task from '../models/Task.js';

export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user._id, onTime: null });
    res.status(201).json(task);
  } catch (err) { next(err); }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    res.status(200).json(task);
  } catch (err) { next(err); }
};

export const markDone = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if the task is completed on time
    const currentDate = new Date();
    const dueDate = new Date(task.dueDate);
    
    task.completed = true;
    
    task.onTime = currentDate <= dueDate;
    
    task.completedAt = currentDate;
    
    const updatedTask = await task.save();
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.status(204).end();
  } catch (err) { next(err); }
};

export const listTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
    res.status(200).json(tasks);
  } catch (err) { next(err); }
};

export const dueTasks = async (req, res, next) => {
  try {
    const today = new Date();
    const tasks = await Task.find({ user: req.user._id, dueDate: { $lte: today }, completed: false });
    res.status(200).json(tasks);
  } catch (err) { next(err); }
};

export const priorityChart = async (req, res, next) => {
  try {
    const data = await Task.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    res.status(200).json(data);
  } catch (err) { next(err); }
};

export const completionChart = async (req, res, next) => {
  try {
    const data = await Task.aggregate([
      { $match: { user: req.user._id, completed: true } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
        count: { $sum: 1 }
      } },
      { $sort: { _id: 1 } }
    ]);
    res.status(200).json(data);
  } catch (err) { next(err); }
};