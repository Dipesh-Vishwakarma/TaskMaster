import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Circle, 
  Clock, 
  Pause, 
  Archive, 
  Pin,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ListTodo,
  PlayCircle,
  XCircle
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useState } from 'react';
import logo from '../images/TaskMaster.png';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CheckSquare, label: 'All Tasks', path: '/tasks' },
    { icon: Circle, label: 'Active', path: '/tasks/active' },
    { icon: ListTodo, label: 'To Do', path: '/tasks/to-do' },
    { icon: PlayCircle, label: 'In Progress', path: '/tasks/in-progress' },
    { icon: Pause, label: 'Hold', path: '/tasks/hold' },
    { icon: Clock, label: 'Backlog', path: '/tasks/backlog' },
    { icon: XCircle, label: 'Closed', path: '/tasks/closed' },
    { icon: Pin, label: 'Pinned', path: '/tasks/pinned' },
    { icon: Archive, label: 'Archive', path: '/tasks/archive' },
  ];

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center gap-3 mb-2">
          <img src={logo} alt="TaskMaster" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TaskMaster
          </h1>
        </div>
        <p className="text-sm text-text-secondary">Welcome, {user?.full_name}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                  : 'text-text hover:bg-surface'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}

        <div className="pt-4 border-t border-border mt-4">
          <NavLink
            to="/settings"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                  : 'text-text hover:bg-surface'
              }`
            }
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </NavLink>

          <NavLink
            to="/profile"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                  : 'text-text hover:bg-surface'
              }`
            }
          >
            <User size={20} />
            <span className="font-medium">Profile</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-text hover:bg-surface transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface shadow-lg text-text"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 bottom-0 w-64 bg-surface shadow-2xl transform transition-transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <NavContent />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-surface border-r border-border">
        <NavContent />
      </div>
    </>
  );
};

export default Sidebar;