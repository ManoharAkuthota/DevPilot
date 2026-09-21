import React, { useState, useEffect, useRef } from 'react';
import { dashboardService } from '../services/dashboardService';
import { formatBytes, formatUptime } from '../utils/formatters';
import { GlassCard } from '../components/common/GlassCard';
import { StatCard } from '../components/common/StatCard';
import { Loader } from '../components/common/Loader';
import { AnimatedButton } from '../components/common/AnimatedButton';
import {
  Activity,
  Cpu,
  Database,
  HardDrive,
  RefreshCw,
  Play,
  Pause,
  Clock,
  Layers,
  Terminal,
} from 'lucide-react';
import { Line } from 'react-chartjs-2';

export const SystemMonitorPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(true);
  const [cpuHistory, setCpuHistory] = useState([12, 16, 14, 19, 15, 22, 18, 14, 20, 16]);
  const [ramHistory, setRamHistory] = useState([42, 44, 43, 46, 45, 48, 46, 45, 47, 46]);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchMetrics = async () => {
    try {
      const data = await dashboardService.getLiveSystemMetrics();
      setMetrics(data);
      setLastRefreshed(new Date());

      // Append to live charts (rolling 15 points)
      setCpuHistory((prev) => [...prev.slice(-14), data.cpuUsagePct || 14]);
      setRamHistory((prev) => [...prev.slice(-14), data.memoryUsagePct || 45]);
    } catch (err) {
      console.error('System metric polling error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  // 3-second live auto-refresh timer
  useEffect(() => {
    let interval = null;
    if (isAutoRefreshing) {
      interval = setInterval(() => {
        fetchMetrics();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoRefreshing]);

  const cpuChartData = {
    labels: cpuHistory.map((_, i) => `${(cpuHistory.length - 1 - i) * 3}s`),
    datasets: [
      {
        label: 'CPU Usage %',
        data: cpuHistory,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const ramChartData = {
    labels: ramHistory.map((_, i) => `${(ramHistory.length - 1 - i) * 3}s`),
    datasets: [
      {
        label: 'RAM Allocation %',
        data: ramHistory,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: '#64748B', font: { size: 10 } },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: '#64748B', font: { size: 10 } },
      },
    },
  };

  if (loading && !metrics) {
    return <Loader message="Connecting to system diagnostic kernel..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-24 bg-gradient-to-r from-blue-950/30 via-slate-900/40 to-[#0A0A0F] border border-white/10 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">System Monitor</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time OS telemetry • Polling every 3s • Last updated at {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatedButton
            onClick={() => setIsAutoRefreshing(!isAutoRefreshing)}
            variant={isAutoRefreshing ? 'outline' : 'primary'}
            size="sm"
            icon={isAutoRefreshing ? Pause : Play}
          >
            {isAutoRefreshing ? 'Pause Live Poll' : 'Resume Live Poll'}
          </AnimatedButton>

          <AnimatedButton
            onClick={fetchMetrics}
            variant="ghost"
            size="sm"
            icon={RefreshCw}
          >
            Refresh Now
          </AnimatedButton>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard glow glowColor="blue" className="p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase text-slate-400">CPU Workload</p>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics?.cpuUsagePct || 14.2}%</div>
          <div className="mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${Math.min(100, metrics?.cpuUsagePct || 14)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">{metrics?.availableProcessors || 8} Logical Cores Available</p>
        </GlassCard>

        <GlassCard glow glowColor="purple" className="p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase text-slate-400">RAM Allocation</p>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics?.memoryUsagePct || 46.5}%</div>
          <div className="mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${Math.min(100, metrics?.memoryUsagePct || 46)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {metrics?.memoryUsedMb || 4200} MB / {metrics?.memoryTotalMb || 8192} MB
          </p>
        </GlassCard>

        <GlassCard glow glowColor="emerald" className="p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase text-slate-400">Disk Storage</p>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics?.diskUsagePct || 54.2}%</div>
          <div className="mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${Math.min(100, metrics?.diskUsagePct || 54)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {metrics?.diskUsedGb || 240} GB used of {metrics?.diskTotalGb || 512} GB
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase text-slate-400">JVM & System Uptime</p>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{formatUptime(metrics?.uptimeSeconds)}</div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Threads: <strong className="text-white">{metrics?.activeThreads || 48}</strong></span>
            <span>OS: <strong className="text-white">{metrics?.osName || 'Windows'}</strong></span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Java {metrics?.javaVersion || '21'}</p>
        </GlassCard>
      </div>

      {/* Real-time Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">CPU Utilization History</h3>
              <p className="text-xs text-slate-400">Recent 45 seconds rolling load telemetry</p>
            </div>
            <span className="text-[10px] text-blue-400 font-mono">Live 3s</span>
          </div>
          <div className="h-56">
            <Line data={cpuChartData} options={chartOptions} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Memory Allocation History</h3>
              <p className="text-xs text-slate-400">Recent 45 seconds JVM heap and process memory</p>
            </div>
            <span className="text-[10px] text-purple-400 font-mono">Live 3s</span>
          </div>
          <div className="h-56">
            <Line data={ramChartData} options={chartOptions} />
          </div>
        </GlassCard>
      </div>

      {/* Top Active Processes Table */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-bold text-white">Top Active Operating Processes</h3>
          </div>
          <span className="text-xs text-slate-400">{metrics?.topProcesses?.length || 0} active processes inspected</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">PID</th>
                <th className="py-2.5 px-3">Process Name</th>
                <th className="py-2.5 px-3">CPU %</th>
                <th className="py-2.5 px-3">Memory (MB)</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200 font-mono">
              {metrics?.topProcesses?.map((proc) => (
                <tr key={proc.pid} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 px-3 text-slate-400">{proc.pid}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">{proc.name}</td>
                  <td className="py-2.5 px-3 text-blue-400 font-bold">{proc.cpuUsagePct}%</td>
                  <td className="py-2.5 px-3">{proc.memoryMb} MB</td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans">{proc.user}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {proc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
