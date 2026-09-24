import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { formatDate } from '../utils/formatters';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { Modal } from '../components/common/Modal';
import {
  User,
  GitBranch,
  Star,
  ExternalLink,
  Download,
  Flame,
  Award,
  Briefcase,
  Code2,
  FileText,
  Mail,
  Printer,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { success } = useNotification();
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  const rawSkills = user?.skills || 'Java 21 & Spring Boot:95,React 19 & Next.js:92,Python & AI/ML:88,Cloud Databases (TiDB/MySQL):92,Docker & CI/CD:88,System Architecture:94';
  const parsedSkills = rawSkills.split(',').map((item) => {
    const [name, level] = item.split(':');
    return { name: name.trim(), level: level ? parseInt(level) : 85 };
  });

  const techStackList = (user?.techStack || 'Java 21, Spring Boot 3, React 19, Python, TiDB Cloud, Docker, TypeScript, Tailwind CSS, Playwright, Machine Learning').split(',');

  const handlePrintResume = () => {
    window.print();
    success('Print dialog opened for formatted developer resume!');
  };

  const handleDownloadMarkdownResume = () => {
    const resumeText = `# ${user?.fullName || user?.username} - Full-Stack & AI Software Engineer
Email: ${user?.email}
Portfolio: ${user?.portfolioUrl || 'https://github.com/ManoharAkuthota'}
GitHub: https://github.com/${user?.githubUsername || 'ManoharAkuthota'}
Productivity Score: ${user?.productivityScore || 96}%

## Professional Summary
${user?.bio}

## Core Tech Stack
${techStackList.join(', ')}

## Key Skills
${parsedSkills.map((s) => `- ${s.name}: ${s.level}%`).join('\n')}

Generated with DevPilot AI Developer Copilot Dashboard.
`;
    const blob = new Blob([resumeText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user?.username || 'Developer'}_Resume.md`;
    a.click();
    URL.revokeObjectURL(url);
    success('Resume downloaded in Markdown format!');
  };

  return (
    <div className="space-y-8">
      {/* Profile Banner */}
      <div className="p-6 lg:p-8 rounded-24 bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-[#0A0A0F] border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <img
              src={user?.avatarUrl || 'https://avatars.githubusercontent.com/u/171120476?v=4'}
              alt={user?.fullName || 'Manohar Akuthota'}
              className="w-24 h-24 rounded-2xl object-cover ring-2 ring-blue-500/50 shadow-2xl"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  {user?.fullName || 'Manohar Akuthota'}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                  Full-Stack & AI Engineer
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">{user?.bio}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-500" /> {user?.email}</span>
                {user?.portfolioUrl && (
                  <a href={user.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline">
                    Portfolio <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {user?.githubUsername && (
                  <a href={`https://github.com/${user.githubUsername}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-purple-400 hover:underline">
                    GitHub @{user.githubUsername} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AnimatedButton
              onClick={() => setResumeModalOpen(true)}
              variant="gradient"
              size="sm"
              icon={FileText}
            >
              Formatted Resume
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Grid: Skills Proficiency & Tech Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Proficiency */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <h3 className="text-base font-bold text-white">Skills Proficiency</h3>
            </div>
            <span className="text-xs text-slate-400">Verified by Copilot Analytics</span>
          </div>

          <div className="space-y-4">
            {parsedSkills.map((s, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-200">{s.name}</span>
                  <span className="text-blue-400">{s.level}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${s.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Tech Stack & Badges */}
        <GlassCard className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                <h3 className="text-base font-bold text-white">Verified Tech Stack</h3>
              </div>
              <span className="text-xs text-slate-400">{techStackList.length} technologies</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {techStackList.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-blue-500/40 text-xs font-semibold text-slate-200 transition-colors"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>

            {/* Productivity Metric callout */}
            <div className="mt-8 p-4 rounded-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-blue-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Daily Productivity Score: {user?.productivityScore || 94}%</h4>
                  <p className="text-xs text-slate-300/80 mt-0.5">Calculated from commit frequency, code reviews, and Kanban velocity.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Member since {formatDate(user?.createdAt || new Date())}</span>
            <span className="text-emerald-400 font-semibold">Status: Active Contributor</span>
          </div>
        </GlassCard>
      </div>

      {/* Formatted Resume Preview Modal */}
      <Modal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        title="Developer Resume Preview"
        subtitle="Formatted resume ready for export or immediate printing"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6 bg-white/[0.02] p-6 rounded-xl border border-white/5 text-slate-200 text-xs leading-relaxed">
          <div className="border-b border-white/10 pb-4 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white">{user?.fullName || user?.username}</h2>
              <p className="text-xs text-blue-400 font-semibold">Full-Stack & AI Software Engineer</p>
              <p className="text-[11px] text-slate-400 mt-1">{user?.email} • {user?.portfolioUrl || 'https://github.com/ManoharAkuthota'}</p>
            </div>
            <span className="text-[10px] px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold">
              Productivity: {user?.productivityScore || 94}%
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Summary</h4>
            <p>{user?.bio}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Core Technical Stack</h4>
            <p className="text-slate-300">{techStackList.join(' • ')}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Competencies & Ratings</h4>
            <div className="grid grid-cols-2 gap-2">
              {parsedSkills.map((s, idx) => (
                <div key={idx} className="flex justify-between border-b border-white/5 py-1">
                  <span>{s.name}</span>
                  <span className="text-blue-400 font-semibold">{s.level}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <AnimatedButton
            onClick={handleDownloadMarkdownResume}
            variant="outline"
            size="sm"
            icon={Download}
          >
            Download Markdown
          </AnimatedButton>
          <AnimatedButton
            onClick={handlePrintResume}
            variant="gradient"
            size="sm"
            icon={Printer}
          >
            Print / PDF
          </AnimatedButton>
        </div>
      </Modal>
    </div>
  );
};
