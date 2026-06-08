import { asyncHandler } from '../../middleware/error.middleware.js';
import prisma from '../../config/db.js';

export const listUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          tasks: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json({
    message: 'Users list',
    users,
  });
});

export const listAllTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (page - 1) * limit;

  const where = status ? { status } : {};

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
    }),
    prisma.task.count({ where }),
  ]);

  return res.status(200).json({
    message: 'All tasks',
    tasks,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});
