import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { GlassCard } from '../components/common/GlassCard';
import { StatCard } from '../components/common/StatCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { Loader } from '../components/common/Loader';
import {
  Sparkles,
  GitBranch,
  CheckSquare,
  Bot,
  Activity,
  ArrowRight,
  Plus,
  Play,
  Flame,
  CheckCircle2,
  Clock,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [gitProfile, setGitProfile] = useState(null);
  const [sysMetrics, setSysMetrics] = useState(null);
  const [aiChats, setAiChats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, gitData, sysData, aiData] = await Promise.allSettled([
          dashboardService.getTasks(),
          dashboardService.getGitHubProfile(),
          dashboardService.getLiveSystemMetrics(),
          dashboardService.getAiHistory(),
        ]);

        if (tasksData.status === 'fulfilled') setTasks(tasksData.value || []);
        if (gitData.status === 'fulfilled') setGitProfile(gitData.value || null);
        if (sysData.status === 'fulfilled') setSysMetrics(sysData.value || null);
        if (aiData.status === 'fulfilled') setAiChats(aiData.value || []);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader message="Assembling DevPilot workspace telemetry..." />;
  }

  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const reviewCount = tasks.filter((t) => t.status === 'REVIEW').length;
  const doneCount = tasks.filter((t) => t.status === 'DONE').length;

  const productivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Productivity Score',
        data: [78, 82, 88, 85, 92, 90, user?.productivityScore || 94],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#60A5FA',
        pointRadius: 4,
      },
      {
        label: 'Tasks Velocity',
        data: [4, 6, 8, 7, 11, 9, 12],
        borderColor: '#8B5CF6',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: '#94A3B8', font: { size: 11 } },
      },
      tooltip: {
        backgroundColor: '#0E0E14',
        titleColor: '#F8FAFC',
        bodyColor: '#94A3B8',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748B', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748B', font: { size: 11 } },
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-24 bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-[#0A0A0F] border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-blue-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <Flame className="w-4 h-4" />
            <span>Developer Streak: 18 Consecutive Days</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.fullName || user?.username || 'Architect'} 👋
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1 max-w-xl">
            Copilot intelligence is synchronized. You have {inProgressCount} active tasks in progress and 1 headless test run completed.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Link to="/tasks">
            <AnimatedButton variant="outline" size="sm" icon={Plus}>
              New Task
            </AnimatedButton>
          </Link>
          <Link to="/ai">
            <AnimatedButton variant="gradient" size="sm" icon={Sparkles}>
              Ask Copilot
            </AnimatedButton>
          </Link>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Productivity Index"
          value={`${user?.productivityScore || 94}%`}
          subtitle="Top 5% among engineering teams"
          trend="+8.4%"
          trendDirection="up"
          icon={Flame}
          color="blue"
        />
        <StatCard
          title="GitHub Public Stars"
          value={gitProfile?.totalStars || 1240}
          subtitle={`${gitProfile?.publicRepos || 28} synced repositories`}
          trend="+14 stars"
          trendDirection="up"
          icon={GitBranch}
          color="purple"
        />
        <StatCard
          title="Sprint Active Tasks"
          value={tasks.length}
          subtitle={`${doneCount} marked done this sprint`}
          trend={`${inProgressCount} active`}
          trendDirection="up"
          icon={CheckSquare}
          color="emerald"
        />
        <StatCard
          title="System CPU Load"
          value={`${sysMetrics?.cpuUsagePct || 14.2}%`}
          subtitle={`${sysMetrics?.memoryUsedMb || 4200} MB RAM Allocated`}
          trend="Optimal"
          trendDirection="up"
          icon={Activity}
          color="amber"
        />
      </div>

      {/* Grid: Live Productivity Chart & Task Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Line Chart */}
        <GlassCard className="p-6 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Productivity & Sprint Velocity</h3>
              <p className="text-xs text-slate-400">7-day performance tracking and task completion velocity</p>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
              Live Stream
            </span>
          </div>

          <div className="h-64 w-full">
            <Line data={productivityData} options={chartOptions} />
          </div>
        </GlassCard>

        {/* Task Manager Summary Widget */}
        <GlassCard className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Kanban Task Status</h3>
                <p className="text-xs text-slate-400">Current sprint status distribution</p>
              </div>
              <Link to="/tasks" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                Board <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-xs font-medium text-slate-300">To Do</span>
                </div>
                <span className="text-xs font-bold text-white">{todoCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/[0.04] border border-blue-500/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-xs font-medium text-blue-200">In Progress</span>
                </div>
                <span className="text-xs font-bold text-blue-400">{inProgressCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/[0.04] border border-purple-500/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span className="text-xs font-medium text-purple-200">In Review</span>
                </div>
                <span className="text-xs font-bold text-purple-400">{reviewCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-medium text-emerald-200">Done</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">{doneCount}</span>
              </div>
            </div>
          </div>

          <Link to="/tasks" className="mt-6 block">
            <AnimatedButton variant="outline" size="sm" className="w-full">
              Open Kanban Board
            </AnimatedButton>
          </Link>
        </GlassCard>
      </div>

      {/* Grid: AI Assistant Widget & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Copilot Quick Assistant */}
        <GlassCard glow glowColor="purple" className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Ollama AI Assistant</h3>
                <p className="text-xs text-slate-400">Target Model: Llama 3.1 Local (Zero Cost)</p>
              </div>
            </div>
            <Link to="/ai">
              <AnimatedButton variant="ghost" size="sm" icon={ExternalLink}>
                Chat
              </AnimatedButton>
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quick Prompt Templates</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { title: 'Detect Code Bugs', icon: '🔍', prompt: 'Analyze this code for race conditions & leaks' },
                { title: 'Refactor to Clean Code', icon: '⚡', prompt: 'Refactor method to eliminate nesting' },
                { title: 'SQL Index Helper', icon: '🗄️', prompt: 'Optimize high-traffic query indexes' },
                { title: 'Spring Boot Virtual Threads', icon: '🍃', prompt: 'Explain Loom virtual threads in Spring Boot 3' },
              ].map((tmpl, idx) => (
                <Link
                  key={idx}
                  to={`/ai?prompt=${encodeURIComponent(tmpl.prompt)}`}
                  className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-purple-500/30 transition-all text-left group"
                >
                  <span className="text-sm mr-1.5">{tmpl.icon}</span>
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white">{tmpl.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Recent Activities Feed */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white">Recent Telemetry Feed</h3>
              <p className="text-xs text-slate-400">Real-time developer events across modules</p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Live</span>
          </div>

          <div className="mt-4 space-y-3">
            {[
              {
                icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
                title: 'JWT Refresh Token Rotation verified',
                time: '15m ago',
                tag: 'Security',
              },
              {
                icon: <GitBranch className="w-4 h-4 text-blue-400" />,
                title: 'Commit pushed to alexvance-ai/devpilot-core',
                time: '1h ago',
                tag: 'GitHub',
              },
              {
                icon: <Bot className="w-4 h-4 text-purple-400" />,
                title: 'AI generated SQL query index recommendations',
                time: '2h ago',
                tag: 'AI Assistant',
              },
              {
                icon: <Activity className="w-4 h-4 text-amber-400" />,
                title: 'Playwright synthetic screenshot check completed',
                time: '3h ago',
                tag: 'Automation',
              },
            ].map((act, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  {act.icon}
                  <div>
                    <p className="text-xs font-medium text-slate-200">{act.title}</p>
                    <span className="text-[10px] text-slate-500">{act.time}</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                  {act.tag}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
