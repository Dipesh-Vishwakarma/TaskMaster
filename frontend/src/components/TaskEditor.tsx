import { useState } from 'react';
import { X, Save, Plus, Trash2, Check, Upload, Download, FileText, AlertCircle } from 'lucide-react';
import type { Task, TaskCreate, TaskUpdate } from '../types';
import { useTaskStore } from '../stores/taskStore';

interface TaskEditorProps {
  task?: Task;
  onClose: () => void;
  onSave: () => void;
}

const TaskEditor = ({ task, onClose, onSave }: TaskEditorProps) => {
  const { createTask, updateTask, addChecklistItem, updateChecklistItem, deleteChecklistItem, uploadAttachment, deleteAttachment } = useTaskStore();
  
  const [formData, setFormData] = useState<TaskCreate | TaskUpdate>({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'To Do',
    priority: task?.priority || 'Medium',
    points: task?.points || 0,
    due_date: task?.due_date || undefined,
  });

  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let createdTask = task;
    
    if (task) {
      await updateTask(task.id, formData);
    } else {
      createdTask = await createTask(formData as TaskCreate);
    }
    
    // Upload pending files if task was just created
    if (!task && createdTask && pendingFiles.length > 0) {
      for (const file of pendingFiles) {
        try {
          await uploadAttachment(createdTask.id, file);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }
    
    onSave();
  };

  const handleAddChecklistItem = async () => {
    if (!task || !newChecklistItem.trim()) return;
    
    await addChecklistItem(task.id, newChecklistItem);
    setNewChecklistItem('');
  };

  const handleToggleChecklistItem = async (itemId: number, isCompleted: boolean) => {
    await updateChecklistItem(itemId, { is_completed: !isCompleted });
  };

  const handleDeleteChecklistItem = async (itemId: number) => {
    await deleteChecklistItem(itemId);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError('');

    for (const file of Array.from(files)) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`${file.name} exceeds 10MB limit. Please choose a smaller file.`);
        continue;
      }

      if (task) {
        // If editing existing task, upload immediately
        setUploading(true);
        try {
          await uploadAttachment(task.id, file);
          setUploadError('');
        } catch (error: any) {
          setUploadError(error.response?.data?.detail || `Failed to upload ${file.name}`);
        } finally {
          setUploading(false);
        }
      } else {
        // If creating new task, store files for later upload
        setPendingFiles(prev => [...prev, file]);
      }
    }

    // Reset input
    e.target.value = '';
  };

  const handleRemovePendingFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteAttachment = async (attachmentId: number) => {
    await deleteAttachment(attachmentId);
  };

  const isImage = (filename: string) => {
    return /\.(png|jpg|jpeg|webp|gif)$/i.test(filename);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
          <h2 className="text-2xl font-bold text-text">
            {task ? 'Edit Task' : 'Create Task'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-background rounded-lg transition">
            <X size={24} className="text-text" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-text mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text"
              required
              placeholder="Enter task title..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-text mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text resize-none"
              placeholder="Add detailed description..."
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text"
              >
                <option>Active</option>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Hold</option>
                <option>Backlog</option>
                <option>Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
          </div>

          {/* Points and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-2">Points</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-2">Due Date</label>
              <input
                type="date"
                value={formData.due_date ? new Date(formData.due_date).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text"
              />
            </div>
          </div>

          {/* Checklist (only for existing tasks) */}
          {task && (
            <div>
              <label className="block text-sm font-semibold text-text mb-2">Checklist</label>
              <div className="space-y-2 mb-3">
                {task.checklists.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 bg-background p-3 rounded-lg hover:bg-surface transition">
                    <button
                      type="button"
                      onClick={() => handleToggleChecklistItem(item.id, item.is_completed)}
                      className={`w-5 h-5 border-2 rounded flex items-center justify-center transition ${
                        item.is_completed ? 'bg-primary border-primary' : 'border-border'
                      }`}
                    >
                      {item.is_completed && <Check size={16} className="text-white" />}
                    </button>
                    <span className={`flex-1 ${item.is_completed ? 'line-through text-text-secondary' : 'text-text'}`}>
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteChecklistItem(item.id)}
                      className="p-1 hover:bg-surface rounded transition text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChecklistItem())}
                  placeholder="Add checklist item..."
                  className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text"
                />
                <button
                  type="button"
                  onClick={handleAddChecklistItem}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Attachments */}
          <div>
            <label className="block text-sm font-semibold text-text mb-2">
              Attachments {!task && '(will be uploaded after task creation)'}
            </label>
            
            {/* Upload Error */}
            {uploadError && (
              <div className="mb-3 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Upload Error</p>
                  <p className="text-sm">{uploadError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadError('')}
                  className="text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 rounded p-1"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Existing Attachments */}
            {task && task.attachments.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                {task.attachments.map((attachment) => (
                  <div key={attachment.id} className="relative bg-background p-3 rounded-lg border border-border group hover:shadow-lg transition">
                    {isImage(attachment.filename) ? (
                      <img
                        src={`/uploads/${attachment.filename}`}
                        alt={attachment.original_filename}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="w-full h-32 bg-surface rounded mb-2 flex items-center justify-center">
                        <FileText size={32} className="text-text-secondary" />
                      </div>
                    )}
                    <p className="text-xs text-text truncate font-medium">{attachment.original_filename}</p>
                    <p className="text-xs text-text-secondary">{formatFileSize(attachment.file_size || 0)}</p>
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <a
                        href={`/uploads/${attachment.filename}`}
                        download={attachment.original_filename}
                        className="p-1.5 bg-primary text-white rounded hover:bg-opacity-90 shadow-lg"
                      >
                        <Download size={16} />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteAttachment(attachment.id)}
                        className="p-1.5 bg-red-500 text-white rounded hover:bg-opacity-90 shadow-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pending Files (for new tasks) */}
            {!task && pendingFiles.length > 0 && (
              <div className="mb-3 space-y-2">
                <p className="text-sm text-text-secondary">Files ready to upload:</p>
                {pendingFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-background p-3 rounded-lg border border-border">
                    <FileText size={20} className="text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text truncate">{file.name}</p>
                      <p className="text-xs text-text-secondary">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePendingFile(index)}
                      className="p-1 hover:bg-surface rounded text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-background border-2 border-dashed border-border rounded-lg hover:border-primary transition cursor-pointer group">
              <Upload size={20} className="text-text-secondary group-hover:text-primary transition" />
              <div className="text-center">
                <span className="text-text-secondary group-hover:text-primary transition font-medium">
                  {uploading ? 'Uploading...' : 'Upload Images & Files'}
                </span>
                <p className="text-xs text-text-secondary mt-1">Max 10MB per file</p>
              </div>
              <input
                type="file"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip"
                multiple
              />
            </label>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-gradient-to-r from-primary/5 to-secondary/5">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-background text-text rounded-lg hover:bg-opacity-80 transition font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition font-semibold flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Save size={20} />
            {task ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditor;