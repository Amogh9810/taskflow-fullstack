import { z } from 'zod';
import { asyncHandler } from '../../middleware/error.middleware.js';
import * as taskService from './task.service.js';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be at most 100 characters'),
  description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  dueDate: z.string().datetime().optional(),
});

const updateTaskSchema = createTaskSchema.partial();

export const listTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const result = await taskService.listTasks(req.user.id, req.user.role, {
    page: parseInt(page),
    limit: parseInt(limit),
    status,
  });
  return res.status(200).json(result);
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.user.id, req.user.role);
  return res.status(200).json(task);
});

export const createTask = asyncHandler(async (req, res) => {
  const validated = await createTaskSchema.parseAsync(req.body);
  const task = await taskService.createTask(validated, req.user.id);
  return res.status(201).json({
    message: 'Task created successfully',
    task,
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const validated = await updateTaskSchema.parseAsync(req.body);
  const task = await taskService.updateTask(req.params.id, req.user.id, req.user.role, validated);
  return res.status(200).json({
    message: 'Task updated successfully',
    task,
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const result = await taskService.deleteTask(req.params.id, req.user.id, req.user.role);
  return res.status(200).json(result);
});
