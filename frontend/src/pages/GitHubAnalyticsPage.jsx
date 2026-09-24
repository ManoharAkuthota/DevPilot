import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { useNotification } from '../context/NotificationContext';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { Loader } from '../components/common/Loader';
import { Modal } from '../components/common/Modal';
import {
  GitBranch,
  Star,
  GitFork,
  Search,
  ExternalLink,
  Bot,
  Sparkles,
  UserPlus,
  RefreshCw,
  FolderGit2,
} from 'lucide-react';
import { Doughnut, Line } from 'react-chartjs-2';

export const GitHubAnalyticsPage = () => {
  const { success, error } = useNotification();
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('stars'); // stars, forks, updated
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState('ManoharAkuthota');
  const [tokenInput, setTokenInput] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [aiGeneratingId, setAiGeneratingId] = useState(null);

  const fetchProfileAndRepos = async () => {
    try {
      setLoading(true);
      const profileData = await dashboardService.getGitHubProfile();
      setProfile(profileData);
      setRepos(profileData.repositories || []);
    } catch (err) {
      console.error('Failed to load GitHub data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndRepos();
  }, []);

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!usernameInput) {
      error('Please provide a GitHub username');
      return;
    }
    try {
      setConnecting(true);
      const res = await dashboardService.connectGitHub(usernameInput, tokenInput);
      setProfile(res);
      setRepos(res.repositories || []);
      success(`GitHub account @${res.username} connected and synced!`);
      setConnectModalOpen(false);
    } catch (err) {
      error(err.message || 'Could not connect GitHub account');
    } finally {
      setConnecting(false);
    }
  };

  const handleGenerateAiSummary = async (repoId) => {
    try {
      setAiGeneratingId(repoId);
      const updatedRepo = await dashboardService.generateAiRepoSummary(repoId);
      setRepos((prev) => prev.map((r) => (r.id === repoId ? updatedRepo : r)));
      success('AI Architectural insights generated for repository!');
    } catch (err) {
      error(err.message || 'AI summary generation failed');
    } finally {
      setAiGeneratingId(null);
    }
  };

  // Filter & Sort Repositories
  const filteredRepos = repos
    .filter((r) =>
      r.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (r.language && r.language.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (r.description && r.description.toLowerCase().includes(searchKeyword.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'stars') return (b.starsCount || 0) - (a.starsCount || 0);
      if (sortBy === 'forks') return (b.forksCount || 0) - (a.forksCount || 0);
      return new Date(b.repoUpdatedAt || 0) - new Date(a.repoUpdatedAt || 0);
    });

  // Language Doughnut Chart Data
  let languagesObj = { Java: 35, JavaScript: 25, Python: 20, HTML: 12, CSS: 8 };
  if (profile?.languagesJson) {
    try {
      languagesObj = JSON.parse(profile.languagesJson);
    } catch {}
  }

  const languageChartData = {
    labels: Object.keys(languagesObj),
    datasets: [
      {
        data: Object.values(languagesObj),
        backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899'],
        borderColor: '#0E0E14',
        borderWidth: 2,
      },
    ],
  };

  // Commit Activity Line Chart
  let commitHistory = [12, 18, 24, 30, 28, 42, 38, 45, 55, 62, 58, 64, 72, 80];
  if (profile?.commitActivityJson) {
    try {
      commitHistory = JSON.parse(profile.commitActivityJson);
    } catch {}
  }

  const commitChartData = {
    labels: commitHistory.map((_, i) => `W${i + 1}`),
    datasets: [
      {
        label: 'Weekly Commits',
        data: commitHistory,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: '#34D399',
      },
    ],
  };

  if (loading) {
    return <Loader message="Fetching GitHub telemetry & repositories..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header Profile Section */}
      <div className="p-6 lg:p-8 rounded-24 bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-[#0A0A0F] border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <img
              src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={profile?.username}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-500/50 shadow-2xl"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">@{profile?.username || 'alexvance-ai'}</h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  GitHub Connected
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">{profile?.bio || 'Building cloud-native distributed microservices and AI developer dashboards.'}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                <span><strong className="text-white">{profile?.followers || 482}</strong> followers</span>
                <span><strong className="text-white">{profile?.following || 119}</strong> following</span>
                <span><strong className="text-white">{profile?.contributionsCount || 1894}</strong> annual contributions</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AnimatedButton
              onClick={() => {
                setUsernameInput(profile?.username || '');
                setConnectModalOpen(true);
              }}
              variant="outline"
              size="sm"
              icon={UserPlus}
            >
              Change Account
            </AnimatedButton>
            <AnimatedButton
              onClick={fetchProfileAndRepos}
              variant="ghost"
              size="sm"
              icon={RefreshCw}
            >
              Sync
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Total Stars Earned</p>
              <h3 className="text-2xl font-bold text-white mt-1">{profile?.totalStars || 1240}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Repository Forks</p>
              <h3 className="text-2xl font-bold text-white mt-1">{profile?.totalForks || 315}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <GitFork className="w-5 h-5" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Public Repositories</p>
              <h3 className="text-2xl font-bold text-white mt-1">{profile?.publicRepos || 28}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Total Commits</p>
              <h3 className="text-2xl font-bold text-white mt-1">{profile?.contributionsCount || 1894}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <GitBranch className="w-5 h-5" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Grid: Language Doughnut & Weekly Commits Line */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Language Distribution</h3>
            <p className="text-xs text-slate-400">Breakdown across all public repositories</p>
          </div>
          <div className="h-56 flex items-center justify-center my-4">
            <Doughnut
              data={languageChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#94A3B8', font: { size: 11 } } },
                },
              }}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Commit Activity Heatmap & Velocity</h3>
            <p className="text-xs text-slate-400">Weekly commit cadence and developer throughput</p>
          </div>

          <div className="h-56 my-2">
            <Line
              data={commitChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#64748B' } },
                  y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#64748B' } },
                },
              }}
            />
          </div>

          {/* Matrix Contribution Squares */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Simulated 14-Week Contribution Activity</span>
            <div className="flex gap-1">
              {[1, 3, 2, 4, 3, 5, 4, 2, 5, 4, 3, 5, 4, 5].map((lvl, idx) => {
                const colors = [
                  'bg-white/5',
                  'bg-emerald-950',
                  'bg-emerald-800',
                  'bg-emerald-600',
                  'bg-emerald-500',
                  'bg-emerald-400 shadow-sm shadow-emerald-500/50',
                ];
                return (
                  <span
                    key={idx}
                    title={`Week ${idx + 1}: High commit activity`}
                    className={`w-3.5 h-3.5 rounded-sm ${colors[lvl]}`}
                  />
                );
              })}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Repositories Explorer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div>
          <h2 className="text-xl font-bold text-white">Repositories Explorer</h2>
          <p className="text-xs text-slate-400">Search, inspect architecture, and generate AI insights</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter repositories..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="stars" className="bg-[#0E0E14]">Sort by Stars</option>
            <option value="forks" className="bg-[#0E0E14]">Sort by Forks</option>
            <option value="updated" className="bg-[#0E0E14]">Sort by Recent Update</option>
          </select>
        </div>
      </div>

      {/* Repositories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRepos.map((repo) => (
          <GlassCard key={repo.id} className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <a
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base font-bold text-white hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{repo.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{repo.description}</p>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono shrink-0">
                  {repo.language || 'Multi-stack'}
                </span>
              </div>

              {/* AI Architecture Insight Box */}
              {repo.aiSummary && (
                <div className="mt-4 p-3.5 rounded-xl bg-purple-500/[0.06] border border-purple-500/20 text-xs text-purple-200/90 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-purple-300 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Architectural Assessment</span>
                  </div>
                  {repo.aiSummary}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400" /> {repo.starsCount || 0}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5 text-slate-400" /> {repo.forksCount || 0}
                </span>
              </div>

              <AnimatedButton
                onClick={() => handleGenerateAiSummary(repo.id)}
                loading={aiGeneratingId === repo.id}
                variant="outline"
                size="sm"
                icon={Bot}
              >
                AI Insights
              </AnimatedButton>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Connect GitHub Account Modal */}
      <Modal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        title="Connect GitHub Account"
        subtitle="Sync repositories, stars, and language telemetry with DevPilot"
      >
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
              GitHub Username *
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="e.g. torvalds or your-handle"
              required
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
              Personal Access Token (Optional)
            </label>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_... (For higher rate limits)"
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
            />
            <p className="text-[11px] text-slate-500 mt-1">Leave empty for public data fetch.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <AnimatedButton
              type="button"
              onClick={() => setConnectModalOpen(false)}
              variant="ghost"
              size="sm"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              type="submit"
              loading={connecting}
              variant="gradient"
              size="sm"
            >
              Sync GitHub Telemetry
            </AnimatedButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
