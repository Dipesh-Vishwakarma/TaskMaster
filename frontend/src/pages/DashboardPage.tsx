import { useEffect, useState } from 'react';
import { Plus, CheckSquare, Clock, PlayCircle, Pause, XCircle, ListTodo } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import TaskEditor from '../components/TaskEditor';
import TaskCard from '../components/TaskCard';
import ThemeSwitcher from '../components/ThemeSwitcher';

const DashboardPage = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = {
    total: tasks.filter(t => !t.is_archived).length,
    active: tasks.filter(t => t.status === 'Active' && !t.is_archived).length,
    todo: tasks.filter(t => t.status === 'To Do' && !t.is_archived).length,
    inProgress: tasks.filter(t => t.status === 'In Progress' && !t.is_archived).length,
    hold: tasks.filter(t => t.status === 'Hold' && !t.is_archived).length,
    backlog: tasks.filter(t => t.status === 'Backlog' && !t.is_archived).length,
    closed: tasks.filter(t => t.status === 'Closed' && !t.is_archived).length,
  };

  const recentTasks = tasks.filter(t => !t.is_archived).slice(0, 6);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Dashboard</h1>
          <p className="text-text-secondary">Welcome back! Here's your task overview.</p>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <CheckSquare size={24} />
            <div className="text-3xl font-bold">{stats.total}</div>
          </div>
          <div className="text-sm opacity-90">Total Tasks</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <PlayCircle size={24} />
            <div className="text-3xl font-bold">{stats.active}</div>
          </div>
          <div className="text-sm opacity-90">Active</div>
        </div>

        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <ListTodo size={24} />
            <div className="text-3xl font-bold">{stats.todo}</div>
          </div>
          <div className="text-sm opacity-90">To Do</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <PlayCircle size={24} />
            <div className="text-3xl font-bold">{stats.inProgress}</div>
          </div>
          <div className="text-sm opacity-90">In Progress</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Pause size={24} />
            <div className="text-3xl font-bold">{stats.hold}</div>
          </div>
          <div className="text-sm opacity-90">Hold</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={24} />
            <div className="text-3xl font-bold">{stats.backlog}</div>
          </div>
          <div className="text-sm opacity-90">Backlog</div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <XCircle size={24} />
            <div className="text-3xl font-bold">{stats.closed}</div>
          </div>
          <div className="text-sm opacity-90">Closed</div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div>
        <h2 className="text-2xl font-bold text-text mb-4">Recent Tasks</h2>
        {recentTasks.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-12 text-center">
            <CheckSquare size={64} className="mx-auto mb-4 text-text-secondary opacity-50" />
            <h3 className="text-xl font-semibold text-text mb-2">No tasks yet</h3>
            <p className="text-text-secondary mb-6">Create your first task to get started!</p>
            <button
              onClick={() => setShowEditor(true)}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all"
            >
              Create Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => {
                  setSelectedTask(task);
                  setShowEditor(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

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
            fetchTasks();
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;