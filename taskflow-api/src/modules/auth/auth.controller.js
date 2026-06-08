import { z } from 'zod';
import { asyncHandler } from '../../middleware/error.middleware.js';
import * as authService from './auth.service.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const register = asyncHandler(async (req, res) => {
  const validated = await registerSchema.parseAsync(req.body);
  const user = await authService.registerUser(validated);
  return res.status(201).json({
    message: 'User registered successfully',
    user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const validated = await loginSchema.parseAsync(req.body);
  const result = await authService.loginUser(validated.email, validated.password);
  return res.status(200).json({
    message: 'Login successful',
    ...result,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  return res.status(200).json(user);
});
