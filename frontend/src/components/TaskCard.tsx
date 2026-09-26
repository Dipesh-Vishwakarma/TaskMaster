import { Pin, Calendar, Star, CheckSquare, Paperclip } from 'lucide-react';
import type { Task } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const priorityColors = {
  Low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  High: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  Critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusColors = {
  'Active': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'To Do': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  'In Progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'Backlog': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  'Closed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const completedChecklist = task.checklists.filter(item => item.is_completed).length;
  const totalChecklist = task.checklists.length;

  return (
    <div
      onClick={onClick}
      className="relative bg-gradient-to-br from-surface to-background border border-border rounded-xl p-5 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 group"
      style={{
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* 3D Effect Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {task.is_pinned && (
        <div className="absolute top-3 right-3 z-10">
          <Pin size={18} className="text-primary fill-primary drop-shadow-lg" />
        </div>
      )}

      <div className="relative z-10">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-text mb-2 pr-8 group-hover:text-primary transition-colors">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-text-secondary line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${statusColors[task.status as keyof typeof statusColors] || statusColors['To Do']}`}>
            {task.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
            {task.priority}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-text-secondary">
          {task.points > 0 && (
            <div className="flex items-center gap-1">
              <Star size={16} className="text-amber-500 fill-amber-500" />
              <span className="font-semibold">{task.points} pts</span>
            </div>
          )}

          {totalChecklist > 0 && (
            <div className="flex items-center gap-1">
              <CheckSquare size={16} className="text-primary" />
              <span className="font-semibold">{completedChecklist}/{totalChecklist}</span>
            </div>
          )}

          {task.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip size={16} className="text-secondary" />
              <span className="font-semibold">{task.attachments.length}</span>
            </div>
          )}
        </div>

        {task.due_date && (
          <div className="flex items-center gap-1 text-xs text-text-secondary mt-3">
            <Calendar size={14} />
            <span>Due {new Date(task.due_date).toLocaleDateString()}</span>
          </div>
        )}

        <div className="text-xs text-text-secondary mt-3 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          Updated {formatDistanceToNow(task.updated_at)}
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default TaskCard;