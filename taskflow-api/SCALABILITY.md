# TaskFlow Scalability Architecture

This document outlines strategies for scaling TaskFlow to handle enterprise-level workloads with millions of users and tasks.

## Current Architecture Limitations

The monolithic Express.js backend works well for small to medium deployments but reaches capacity limits around 10k-100k concurrent users. The single database instance becomes the bottleneck as read/write operations grow exponentially.

## Phase 1: Caching Layer (Easy Win)

### Redis Integration

Add Redis for caching frequently accessed data:

```javascript
import redis from 'redis';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

// Cache GET /tasks/:id
export const getTaskById = async (taskId, userId, userRole) => {
  const cacheKey = `task:${taskId}`;
  const cached = await redisClient.get(cacheKey);
  
  if (cached) return JSON.parse(cached);
  
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  await redisClient.setex(cacheKey, 3600, JSON.stringify(task)); // 1 hour TTL
  
  return task;
};

// Invalidate cache on update
export const updateTask = async (taskId, data) => {
  const task = await prisma.task.update({ where: { id: taskId }, data });
  await redisClient.del(`task:${taskId}`);
  return task;
};
```

**Impact**: 10-100x faster reads, reduced database load by 60-80% on read-heavy workloads.

## Phase 2: Database Read Replicas

### PostgreSQL Replication

Use read replicas for scaling read operations:

```javascript
const writePool = new Pool({ connectionString: process.env.DATABASE_URL }); // Primary
const readPool = new Pool({ connectionString: process.env.READ_REPLICA_URL }); // Replica

// Route reads to replica, writes to primary
export const listTasks = async (userId, role, filters) => {
  return readPool.query(
    'SELECT * FROM "Task" WHERE userId = $1 ORDER BY createdAt DESC LIMIT $2 OFFSET $3',
    [userId, filters.limit, (filters.page - 1) * filters.limit]
  );
};

export const updateTask = async (taskId, data) => {
  return writePool.query(
    'UPDATE "Task" SET title = $1, status = $2 WHERE id = $3 RETURNING *',
    [data.title, data.status, taskId]
  );
};
```

**Setup**: Create replica in RDS, update connection strings in `.env`  
**Impact**: Handle 10x more read traffic without additional compute

## Phase 3: Microservices Decomposition

### Service Boundaries

```
┌─────────────────────────────────────────────┐
│           API Gateway (Kong/Express)         │
├─────────────────┬─────────────┬──────────────┤
│                 │             │              │
│  Auth Service   │ Task Service│ Admin Service│
│  (Node.js)      │ (Node.js)   │ (Node.js)    │
│                 │             │              │
└────────┬────────┴──────┬──────┴──────────┬───┘
         │               │                 │
      PostgreSQL      PostgreSQL       PostgreSQL
    (Auth DB)       (Tasks DB)        (Analytics DB)
```

### Auth Service Isolation

```javascript
// auth-service/src/index.js
import express from 'express';
import prisma from './db';

const app = express();

app.post('/register', async (req, res) => {
  // Register logic - only handles auth
});

app.post('/login', async (req, res) => {
  // Login logic
});

app.listen(3001); // Separate port
```

Benefits:
- Auth service can scale independently
- Database can be optimized for user lookups
- Easier to implement SSO/OAuth
- Decouples auth from task logic

### Task Service with Event-Driven Updates

```javascript
// task-service/src/index.js
import Bull from 'bull';

const taskQueue = new Bull('tasks', process.env.REDIS_URL);

// Process async task operations
taskQueue.process(async (job) => {
  const { type, data } = job.data;
  
  if (type === 'create') {
    return await createTask(data);
  } else if (type === 'delete-user-tasks') {
    return await prisma.task.deleteMany({ where: { userId: data.userId } });
  }
});

// Emit task created event
taskQueue.add({ type: 'create', data: taskData }, { delay: 100 });
```

## Phase 4: Message Queues

### Task Notifications via BullMQ

```javascript
import { Queue, Worker } from 'bullmq';

const notificationQueue = new Queue('notifications', {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// Emit event when task status changes
export const updateTask = async (taskId, data) => {
  const task = await prisma.task.update({ where: { id: taskId }, data });
  
  if (data.status === 'DONE') {
    await notificationQueue.add({
      userId: task.userId,
      message: `Task "${task.title}" completed!`,
      type: 'task-completed',
    });
  }
  
  return task;
};

// Worker processes notifications
new Worker('notifications', async (job) => {
  const { userId, message, type } = job.data;
  
  // Send email, SMS, push notification, etc.
  await sendNotification(userId, message);
}, { connection });
```

**Impact**: Non-blocking operations, better responsiveness, 1000+ notifications/sec

## Phase 5: Containerization & Orchestration

### Docker Setup

```dockerfile
# Dockerfile for auth-service
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm ci --only=production
COPY src .
EXPOSE 3001
CMD ["node", "index.js"]
```

### Docker Compose for Local Development

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: taskflow
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  auth-service:
    build: ./taskflow-auth-service
    ports:
      - "3001:3001"
    depends_on:
      - postgres

  task-service:
    build: ./taskflow-task-service
    ports:
      - "3002:3002"
    depends_on:
      - postgres
      - redis

  api-gateway:
    build: ./taskflow-gateway
    ports:
      - "3000:3000"
    depends_on:
      - auth-service
      - task-service
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: task-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: task-service
  template:
    metadata:
      labels:
        app: task-service
    spec:
      containers:
      - name: task-service
        image: taskflow/task-service:latest
        ports:
        - containerPort: 3002
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
```

## Phase 6: Performance Optimizations

### Database Query Optimization

```javascript
// Bad: N+1 query problem
const users = await prisma.user.findMany();
for (const user of users) {
  user.taskCount = await prisma.task.count({ where: { userId: user.id } });
}

// Good: Single query with aggregation
const users = await prisma.user.findMany({
  include: {
    _count: {
      select: { tasks: true },
    },
  },
});

// Better: Database aggregation
const taskCounts = await prisma.task.groupBy({
  by: ['userId'],
  _count: true,
});
```

### Connection Pooling

```javascript
// Use PgBouncer for connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Elasticsearch for Full-Text Search

```javascript
import { Client } from '@elastic/elasticsearch';

const esClient = new Client({ node: process.env.ELASTICSEARCH_URL });

// Index tasks
export const createTask = async (data, userId) => {
  const task = await prisma.task.create({ data: { ...data, userId } });
  
  await esClient.index({
    index: 'tasks',
    id: task.id,
    body: {
      title: task.title,
      description: task.description,
      userId,
    },
  });
  
  return task;
};

// Full-text search
export const searchTasks = async (query) => {
  const results = await esClient.search({
    index: 'tasks',
    body: {
      query: {
        multi_match: {
          query,
          fields: ['title^2', 'description'],
        },
      },
    },
  });
  
  return results.hits.hits.map((hit) => hit._source);
};
```

## Scaling Milestones

| Concurrent Users | Database | Cache | Services | Deployment |
|------------------|----------|-------|----------|------------|
| 1K-10K | Single RDS | None | Monolith | Single EC2 |
| 10K-100K | RDS + Read Replicas | Redis | Monolith | Auto-scaling |
| 100K-1M | Multi-region RDS | Redis Cluster | Microservices | Kubernetes |
| 1M+ | Sharded DB | Redis Cluster | Event-Driven | Multi-region K8s |

## Monitoring & Observability

```javascript
import prometheus from 'prom-client';
import newrelic from 'newrelic';

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status'],
  buckets: [10, 30, 100, 300, 1000, 3000],
});

// Track request metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDuration.labels(req.method, req.route.path, res.statusCode).observe(duration);
  });
  next();
});

// APM monitoring with New Relic
app.get('/tasks', newrelic.createWebTransaction('/tasks', async (req, res) => {
  const tasks = await listTasks(req.user.id, req.user.role);
  res.json(tasks);
}));
```

## Estimated Timeline

- **Week 1-2**: Redis caching + read replicas
- **Week 3-4**: Microservices (Auth, Task services)
- **Week 5-6**: Message queues for async operations
- **Week 7-8**: Docker/Kubernetes setup
- **Ongoing**: Performance optimization and monitoring

## Conclusion

By progressively implementing these scaling strategies, TaskFlow can grow from supporting thousands of users to millions while maintaining sub-100ms response times. The key is to start simple, measure bottlenecks, and scale incrementally rather than over-engineering from day one.
