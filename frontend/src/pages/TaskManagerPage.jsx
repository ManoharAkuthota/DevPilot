import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { useNotification } from '../context/NotificationContext';
import { TASK_STATUSES, TASK_PRIORITIES } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { Loader } from '../components/common/Loader';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import {
  CheckSquare,
  Plus,
  Search,
  Calendar as CalendarIcon,
  LayoutGrid,
  Filter,
  Clock,
  MessageSquare,
  Trash2,
  Edit2,
  Tag,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const TaskManagerPage = () => {
  const { success, error } = useNotification();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'calendar'

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeTaskDetail, setActiveTaskDetail] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [taskStatus, setTaskStatus] = useState('TODO');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskLabels, setTaskLabels] = useState('');
  const [taskEstimatedHours, setTaskEstimatedHours] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getTasks();
      setTasks(data || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Drag and Drop handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskIdStr = e.dataTransfer.getData('text/plain');
    if (!taskIdStr) return;
    const taskId = Number(taskIdStr);

    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask || targetTask.status === newStatus) return;

    // Optimistic UI Update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await dashboardService.updateTaskStatus(taskId, newStatus);
      success(`Task moved to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      error('Failed to update task position');
      fetchTasks();
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle) {
      error('Task title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await dashboardService.createTask({
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        status: taskStatus,
        dueDate: taskDueDate || null,
        labels: taskLabels,
        estimatedHours: taskEstimatedHours ? parseFloat(taskEstimatedHours) : null,
      });

      setTasks((prev) => [created, ...prev]);
      success('Task created successfully');
      setCreateModalOpen(false);
      resetForm();
    } catch (err) {
      error(err.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await dashboardService.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (activeTaskDetail?.id === taskId) setActiveTaskDetail(null);
      success('Task removed');
    } catch (err) {
      error('Failed to delete task');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !activeTaskDetail) return;

    try {
      setCommentLoading(true);
      const comment = await dashboardService.addTaskComment(activeTaskDetail.id, newComment);
      const updatedComments = [...(activeTaskDetail.comments || []), comment];

      const updatedTask = { ...activeTaskDetail, comments: updatedComments };
      setActiveTaskDetail(updatedTask);
      setTasks((prev) => prev.map((t) => (t.id === activeTaskDetail.id ? updatedTask : t)));
      setNewComment('');
      success('Comment added');
    } catch (err) {
      error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const resetForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('MEDIUM');
    setTaskStatus('TODO');
    setTaskDueDate('');
    setTaskLabels('');
    setTaskEstimatedHours('');
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.labels && t.labels.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  if (loading) {
    return <Loader message="Loading Jira Kanban board..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Task Manager</h1>
          <p className="text-xs text-slate-400">Jira & Linear style Kanban board with sprint tracking</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="p-1 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'calendar' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <AnimatedButton
            onClick={() => setCreateModalOpen(true)}
            variant="gradient"
            size="sm"
            icon={Plus}
          >
            Create Task
          </AnimatedButton>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-20 bg-white/[0.02] border border-white/10">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by keyword or label..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL" className="bg-[#0E0E14]">All Priorities</option>
            <option value="URGENT" className="bg-[#0E0E14]">Urgent</option>
            <option value="HIGH" className="bg-[#0E0E14]">High</option>
            <option value="MEDIUM" className="bg-[#0E0E14]">Medium</option>
            <option value="LOW" className="bg-[#0E0E14]">Low</option>
          </select>
        </div>
      </div>

      {/* View Mode: Kanban Board */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {TASK_STATUSES.map((status) => {
            const columnTasks = filteredTasks.filter((t) => t.status === status.id);

            return (
              <div
                key={status.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status.id)}
                className="rounded-24 bg-[#0A0A0E]/60 border border-white/[0.07] backdrop-blur-xl p-4 min-h-[500px] flex flex-col justify-between"
              >
                <div>
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">{columnTasks.length}</span>
                  </div>

                  {/* Tasks List in Column */}
                  <div className="space-y-3.5">
                    {columnTasks.map((task) => {
                      const priorityConfig = TASK_PRIORITIES.find((p) => p.id === task.priority);

                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onClick={() => setActiveTaskDetail(task)}
                          className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-blue-500/40 cursor-pointer transition-all duration-200 shadow-sm group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                              {task.title}
                            </h4>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border shrink-0 ${
                                priorityConfig?.badgeColor || ''
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          {task.description && (
                            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {/* Tags */}
                          {task.labels && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {task.labels.split(',').map((lbl, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono"
                                >
                                  #{lbl.trim()}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Card Footer info */}
                          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{formatDate(task.dueDate)}</span>
                            </div>

                            <div className="flex items-center gap-1 text-slate-400">
                              <MessageSquare className="w-3 h-3" />
                              <span>{task.comments?.length || 0}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {columnTasks.length === 0 && (
                      <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-white/10 rounded-xl">
                        Drop task here
                      </div>
                    )}
                  </div>
                </div>

                {/* Column quick add */}
                <button
                  onClick={() => {
                    setTaskStatus(status.id);
                    setCreateModalOpen(true);
                  }}
                  className="w-full mt-4 py-2 flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Task
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode: Calendar View */}
      {viewMode === 'calendar' && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <h3 className="text-base font-bold text-white">Sprint Timeline Calendar</h3>
            <span className="text-xs text-slate-400">Organized by Due Date</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
              const dayTasks = tasks.filter((t, i) => i % 7 === idx);
              return (
                <div key={day} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 min-h-[220px]">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{day}</p>
                  <div className="space-y-2">
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setActiveTaskDetail(t)}
                        className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] font-semibold text-white cursor-pointer hover:border-blue-500/50"
                      >
                        <p className="truncate">{t.title}</p>
                        <span className="text-[9px] text-blue-300">{t.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Sprint Task"
        subtitle="Add a Jira-grade issue or feature task to your Kanban backlog"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Title *</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Implement OpenTelemetry Distributed Tracing"
              required
              className="w-full px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Description</label>
            <textarea
              rows={3}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Provide technical context, acceptance criteria, and architecture dependencies..."
              className="w-full px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none"
              >
                <option value="LOW" className="bg-[#0E0E14]">Low</option>
                <option value="MEDIUM" className="bg-[#0E0E14]">Medium</option>
                <option value="HIGH" className="bg-[#0E0E14]">High</option>
                <option value="URGENT" className="bg-[#0E0E14]">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Initial Column</label>
              <select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none"
              >
                <option value="TODO" className="bg-[#0E0E14]">To Do</option>
                <option value="IN_PROGRESS" className="bg-[#0E0E14]">In Progress</option>
                <option value="REVIEW" className="bg-[#0E0E14]">In Review</option>
                <option value="DONE" className="bg-[#0E0E14]">Done</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Due Date</label>
              <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Estimated Hours</label>
              <input
                type="number"
                step="0.5"
                value={taskEstimatedHours}
                onChange={(e) => setTaskEstimatedHours(e.target.value)}
                placeholder="e.g. 8.0"
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Labels (Comma Separated)</label>
            <input
              type="text"
              value={taskLabels}
              onChange={(e) => setTaskLabels(e.target.value)}
              placeholder="e.g. Backend, Security, P1"
              className="w-full px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <AnimatedButton
              type="button"
              onClick={() => setCreateModalOpen(false)}
              variant="ghost"
              size="sm"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              type="submit"
              loading={isSubmitting}
              variant="gradient"
              size="sm"
            >
              Create Task
            </AnimatedButton>
          </div>
        </form>
      </Modal>

      {/* Task Detail & Comments Modal */}
      <Modal
        isOpen={!!activeTaskDetail}
        onClose={() => setActiveTaskDetail(null)}
        title={activeTaskDetail?.title || 'Task Details'}
        subtitle={`Status: ${activeTaskDetail?.status} • Priority: ${activeTaskDetail?.priority}`}
      >
        {activeTaskDetail && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Description</p>
              <p className="text-sm text-slate-200 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
                {activeTaskDetail.description || 'No description provided.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <div>Due: <strong className="text-white">{formatDate(activeTaskDetail.dueDate)}</strong></div>
              <div>Estimated: <strong className="text-white">{activeTaskDetail.estimatedHours || 4}h</strong></div>
              {activeTaskDetail.labels && (
                <div>Tags: <strong className="text-blue-400">{activeTaskDetail.labels}</strong></div>
              )}
            </div>

            {/* Comments Thread */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Collaboration Comments</h4>

              <div className="space-y-3 max-h-48 overflow-y-auto">
                {activeTaskDetail.comments?.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex gap-3">
                    <img
                      src={c.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={c.authorName}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{c.authorName}</span>
                        <span className="text-[10px] text-slate-500">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{c.content}</p>
                    </div>
                  </div>
                ))}
                {(!activeTaskDetail.comments || activeTaskDetail.comments.length === 0) && (
                  <p className="text-xs text-slate-500 italic">No comments posted yet.</p>
                )}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a team update or comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
                />
                <AnimatedButton
                  type="submit"
                  loading={commentLoading}
                  variant="primary"
                  size="sm"
                >
                  Comment
                </AnimatedButton>
              </form>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <button
                onClick={() => handleDeleteTask(activeTaskDetail.id)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete Task
              </button>

              <AnimatedButton
                onClick={() => setActiveTaskDetail(null)}
                variant="outline"
                size="sm"
              >
                Close
              </AnimatedButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
