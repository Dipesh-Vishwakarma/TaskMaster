import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Search, Filter, Pin, Archive as ArchiveIcon, Trash2 } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import TaskCard from '../components/TaskCard';
import TaskEditor from '../components/TaskEditor';
import ThemeSwitcher from '../components/ThemeSwitcher';

const TasksPage = () => {
  const { filter } = useParams();
  const { tasks, fetchTasks, togglePin, toggleArchive, deleteTask } = useTaskStore();
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    const params: any = {};

    if (filter === 'pinned') {
      params.is_pinned = true;
      params.is_archived = false;
    } else if (filter === 'archive') {
      params.is_archived = true;
    } else if (filter === 'active') {
      params.status = 'Active';
      params.is_archived = false;
    } else if (filter === 'to-do') {
      params.status = 'To Do';
      params.is_archived = false;
    } else if (filter === 'in-progress') {
      params.status = 'In Progress';
      params.is_archived = false;
    } else if (filter === 'hold') {
      params.status = 'Hold';
      params.is_archived = false;
    } else if (filter === 'backlog') {
      params.status = 'Backlog';
      params.is_archived = false;
    } else if (filter === 'closed') {
      params.status = 'Closed';
      params.is_archived = false;
    } else {
      params.is_archived = false;
    }

    if (searchQuery) {
      params.search = searchQuery;
    }
    if (statusFilter) {
      params.status = statusFilter;
    }
    if (priorityFilter) {
      params.priority = priorityFilter;
    }

    fetchTasks(params);
  }, [filter, searchQuery, statusFilter, priorityFilter, fetchTasks]);

  const getTitle = () => {
    if (filter === 'pinned') return 'Pinned Tasks';
    if (filter === 'archive') return 'Archived Tasks';
    if (filter === 'active') return 'Active Tasks';
    if (filter === 'to-do') return 'To Do';
    if (filter === 'in-progress') return 'In Progress';
    if (filter === 'hold') return 'On Hold';
    if (filter === 'backlog') return 'Backlog';
    if (filter === 'closed') return 'Closed Tasks';
    return 'All Tasks';
  };

  const handlePin = async (taskId: number, isPinned: boolean) => {
    await togglePin(taskId, !isPinned);
  };

  const handleArchive = async (taskId: number, isArchived: boolean) => {
    await toggleArchive(taskId, !isArchived);
  };

  const handleDelete = async (taskId: number) => {
    await deleteTask(taskId);
    setDeleteConfirm(null);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">{getTitle()}</h1>
          <p className="text-text-secondary">{tasks.length} tasks found</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <button
            onClick={() => {
              setSelectedTask(null);
              setShowEditor(true);
            }}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Create Task
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-text"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl border transition flex items-center gap-2 ${
              showFilters ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text'
            }`}
          >
            <Filter size={20} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-text"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Hold">Hold</option>
              <option value="Backlog">Backlog</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-text"
            >
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        )}
      </div>

      {/* Tasks Grid */}
      {tasks.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <h3 className="text-xl font-semibold text-text mb-2">No tasks found</h3>
          <p className="text-text-secondary mb-6">Try adjusting your filters or create a new task.</p>
          <button
            onClick={() => setShowEditor(true)}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all"
          >
            Create Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task.id} className="relative group">
              <TaskCard
                task={task}
                onClick={() => {
                  setSelectedTask(task);
                  setShowEditor(true);
                }}
              />
              
              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePin(task.id, task.is_pinned);
                  }}
                  className={`p-2 rounded-lg shadow-lg transition ${
                    task.is_pinned
                      ? 'bg-primary text-white'
                      : 'bg-surface text-text hover:bg-primary hover:text-white'
                  }`}
                  title={task.is_pinned ? 'Unpin' : 'Pin'}
                >
                  <Pin size={16} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArchive(task.id, task.is_archived);
                  }}
                  className="p-2 bg-surface text-text rounded-lg hover:bg-yellow-500 hover:text-white shadow-lg transition"
                  title={task.is_archived ? 'Restore' : 'Archive'}
                >
                  <ArchiveIcon size={16} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirm(task.id);
                  }}
                  className="p-2 bg-surface text-text rounded-lg hover:bg-red-500 hover:text-white shadow-lg transition"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Editor Modal */}
      {showEditor && (
        <TaskEditor
          task={selectedTask}
          onClose={() => {
            setShowEditor(false);
            setSelectedTask(null);
          }}
          onSave={() => {
            setShowEditor(false);
            setSelectedTask(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-text mb-4">Delete Task?</h3>
            <p className="text-text-secondary mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-3 bg-background text-text rounded-lg hover:bg-opacity-80 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-opacity-90 transition font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;