const catchAsyncError = require("../middleware/catchAsyncError");
const Task = require("../models/task");
const ErrorHandler = require("../utils/errorHandler");

exports.createTask = catchAsyncError(async (req, res, next) => {
  console.log("caaled")
  console.log(req)
  console.log(req.body)
  const  data  = req.body;
  const { title, description, parentTask } = data
  console.log(title)
  if (title.length < 3) {
    return next(new ErrorHandler("Title too short", 400));
  }
  if (description && description.length > 200) {
    return next(new ErrorHandler("Description too long", 400));
  }

  const parentTaskDetails = await Task.findById(parentTask);

  if (parentTask && !parentTaskDetails) {
    return next(new ErrorHandler("Invalid parent task", 400));
  }

  const task = await Task.create({ title, description, parentTask });
  res.status(201).json(task);
});

exports.getActiveTasks = catchAsyncError(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const tasks = await Task.find({ archived: false })
    .skip((page - 1) * limit)
    .limit(parseInt(limit)).populate("parentTask");

  if (!tasks || tasks?.length === 0) {
    return next(new ErrorHandler("No active tasks found", 404));
  }

  res.json(tasks);
});

exports.getArchivedTasks = catchAsyncError(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const tasks = await Task.find({ archived: true })
    .skip((page - 1) * limit)
    .limit(parseInt(limit)).populate("parentTask");

  if (!tasks || tasks?.length === 0) {
    return next(new ErrorHandler("No Arhived tasks found", 404));
  }

  res.json(tasks);
});

exports.updateTask = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, parentTask, completed } = req.body;
  const updates = {};

  if (title !== undefined) {
    if (title.length < 3) {
      return next(new ErrorHandler("Title too short", 404));
    }
    updates.title = title;
  }
  if (description !== undefined) {
    if (description.length > 200) {
      return next(new ErrorHandler("Description too long", 404));
    }
    updates.description = description;
  }
  if (typeof completed === "boolean") updates.completed = completed;

  if (parentTask !== undefined) {
    const parentTaskDetails = await Task.findById(parentTask);
    if (parentTask && !parentTaskDetails) {   

      return next(new ErrorHandler("Invalid parent task", 400));
    }   
    const circularReference = await hasCircularReference(id, parentTask);
    if (circularReference) {   
      return next(new ErrorHandler("Circular reference not allowed", 400));
    } 
    updates.parentTask = parentTask;
  }

  const updated = await Task.findByIdAndUpdate(id, updates, { new: true });

  res.json(updated);
});

const hasCircularReference = catchAsyncError(async (taskId, parentTask) => {
  let current = parentTask;
  while (current) {
    if (current.toString() === taskId.toString()) return true;
    const parent = await Task.findById(current);
    current = parent?.parentTask;
  }
  return false;
});

exports.moveTask = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { newParentId } = req.body;

  const circularRefernce = await hasCircularReference(id, newParentId);
  if (circularRefernce) {
    return next(new ErrorHandler("Circular reference not allowed", 400));
  }
  const updated = await Task.findByIdAndUpdate(
    id,
    { parentTask: newParentId },
    { new: true }
  );
  res.json(updated);
});

const deleteSubtasks = catchAsyncError(async (taskId) => {
  const subtasks = await Task.find({ parentTask: taskId });

    for (const subtask of subtasks) {
    await deleteSubtasks(subtask._id);
    }
  await Task.findByIdAndDelete(taskId);
});

exports.deleteTask = catchAsyncError(async (req, res, next) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return next(new ErrorHandler("Task not found", 404));
    }

    await deleteSubtasks(req.params.id);
    res.status(204).send({
        message: "Task and its subtasks deleted successfully"
    });
});

exports.getTree = catchAsyncError(async (req, res, next) => {
    const allTasks = await Task.find().populate("parentTask");
    res.json(allTasks)
});


exports.createCronOpetion = catchAsyncError(async () => {
  const tasks = await Task.find({ completed: true, archived: false });
  for (let task of tasks) {
    task.archived = true;
    task.archivedAt = new Date();
    await task.save();
  }
  console.log(`Archived ${tasks.length} completed tasks.`);
})
