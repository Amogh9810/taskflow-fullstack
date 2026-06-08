import prisma from '../../config/db.js';

export const listTasks = async (userId, userRole, filters = {}) => {
  const { page = 1, limit = 10, status } = filters;
  const skip = (page - 1) * limit;

  const where =
    userRole === 'ADMIN'
      ? status
        ? { status }
        : {}
      : {
          userId,
          ...(status && { status }),
        };

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
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: Number(limit),
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getTaskById = async (taskId, userId, userRole) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  if (userRole !== 'ADMIN' && task.userId !== userId) {
    const error = new Error(
      'Forbidden: you can only access your own tasks'
    );
    error.statusCode = 403;
    throw error;
  }

  return task;
};

export const createTask = async (data, userId) => {
  const task = await prisma.task.create({
    data: {
      ...data,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return task;
};

export const updateTask = async (
  taskId,
  userId,
  userRole,
  data
) => {
  await getTaskById(taskId, userId, userRole);

  const task = await prisma.task.update({
    where: {
      id: taskId,
    },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return task;
};

export const deleteTask = async (
  taskId,
  userId,
  userRole
) => {
  await getTaskById(taskId, userId, userRole);

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  return {
    message: 'Task deleted successfully',
  };
};