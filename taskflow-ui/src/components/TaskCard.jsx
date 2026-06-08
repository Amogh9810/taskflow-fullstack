const priorityColors = {
  LOW: 'border-blue-500',
  MEDIUM: 'border-yellow-500',
  HIGH: 'border-orange-500',
  CRITICAL: 'border-red-500',
};

const statusColors = {
  TODO: 'badge-primary',
  IN_PROGRESS: 'badge-warning',
  DONE: 'badge-success',
  ARCHIVED: 'badge-danger',
};

const statusLabels = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
  ARCHIVED: 'Archived',
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';

  return (
    <div className={`card border-l-4 ${priorityColors[task.priority] || 'border-l-gray-500'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{task.title}</h3>
          {task.description && <p className="text-muted text-sm mt-1 line-clamp-2">{task.description}</p>}
        </div>
        <div className="flex gap-2 ml-4">
          <button onClick={() => onEdit(task)} className="btn btn-secondary text-xs px-2 py-1">
            Edit
          </button>
          <button onClick={() => onDelete(task.id)} className="btn btn-danger text-xs px-2 py-1">
            Delete
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-light">
        <div className="flex gap-2 items-center">
          <span className={`badge ${statusColors[task.status]}`}>{statusLabels[task.status]}</span>
          <span className="text-xs text-muted">{dueDate}</span>
        </div>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="text-xs bg-surface-light text-white rounded px-2 py-1 border border-surface-light focus:border-primary outline-none"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
    </div>
  );
}
