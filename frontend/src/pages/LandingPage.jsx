import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Terminal,
  Bot,
  Globe,
  Activity,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Star,
  Zap,
  Code2,
  Layers,
  Cpu,
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { ParticleBackground } from '../components/layout/ParticleBackground';

export const LandingPage = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemoClick = async () => {
    try {
      setDemoLoading(true);
      await demoLogin();
      navigate('/dashboard');
    } catch {
      navigate('/login');
    } finally {
      setDemoLoading(false);
    }
  };

  const faqs = [
    {
      q: 'How does DevPilot connect with local Ollama models?',
      a: 'DevPilot connects directly to your localhost Ollama service (defaulting to http://localhost:11434 and Llama 3.1). If Ollama is offline, DevPilot seamlessly activates an intelligent local fallback engine with zero downtime.',
    },
    {
      q: 'Can I execute headless browser automation without Chrome installed?',
      a: 'Yes! DevPilot integrates Microsoft Playwright Java on the backend, which manages lightweight browser binaries and executes automated web workflows and viewport screen capture headlessly.',
    },
    {
      q: 'What makes the Kanban board enterprise-ready?',
      a: 'The Task Manager supports drag-and-drop state updates, priority flags, tag taxonomy, comment collaboration threads, due dates, and instantaneous database synchronization.',
    },
    {
      q: 'Is Docker supported out of the box?',
      a: 'Yes, DevPilot provides production multi-stage Dockerfiles for both Spring Boot and React, along with a unified docker-compose.yml including MySQL and Ollama.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-100 selection:bg-blue-500/30 overflow-x-hidden relative">
      <ParticleBackground />

      {/* Top Navigation */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#09090B]/70 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              DevPilot
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workspace" className="hover:text-white transition-colors">Architecture</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <AnimatedButton variant="ghost" size="sm">Sign In</AnimatedButton>
            </Link>
            <AnimatedButton
              onClick={handleDemoClick}
              loading={demoLoading}
              variant="gradient"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
            >
              Live Demo
            </AnimatedButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation AI Developer Copilot Dashboard</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none"
        >
          Orchestrate Code, Tasks, & AI <br />
          <span className="neon-text-gradient">With Hyper-Precision.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          DevPilot combines Jira-like Kanban task workflows, local Ollama Llama 3.1 AI assistants, Playwright browser automation, and live system monitoring in a single glassmorphic workspace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <AnimatedButton
            onClick={handleDemoClick}
            loading={demoLoading}
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
          >
            Launch Interactive Dashboard
          </AnimatedButton>
          <Link to="/register">
            <AnimatedButton variant="outline" size="lg">
              Create Free Account
            </AnimatedButton>
          </Link>
        </motion.div>

        {/* Floating Workspace Preview */}
        <motion.div
          id="workspace"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 relative mx-auto max-w-5xl"
        >
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-30 animate-pulse-slow" />
          
          <div className="relative rounded-24 bg-[#0A0A0F] border border-white/15 shadow-2xl overflow-hidden text-left p-6 lg:p-8">
            {/* Window bar */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs font-mono text-slate-400">devpilot-workspace: ~/projects/copilot</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Llama 3.1 Local (0ms latency)
                </span>
              </div>
            </div>

            {/* Grid preview of modules */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-2">
                  <Activity className="w-4 h-4" /> Live System Telemetry
                </div>
                <div className="text-2xl font-bold text-white">12.4% CPU</div>
                <div className="text-xs text-slate-400 mt-1">4.2 GB / 16 GB RAM • 60 FPS UI</div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-2">
                  <CheckSquare className="w-4 h-4" /> Active Sprint
                </div>
                <div className="text-2xl font-bold text-white">6 Tasks Active</div>
                <div className="text-xs text-slate-400 mt-1">4 In Progress • 2 Review Completed</div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                  <Globe className="w-4 h-4" /> Browser Automation
                </div>
                <div className="text-2xl font-bold text-white">Playwright Java</div>
                <div className="text-xs text-slate-400 mt-1">Status: 200 OK • Screenshot Cached</div>
              </div>
            </div>

            {/* Floating Code Snippet */}
            <div className="mt-6 p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
              <span className="text-purple-400">@Service</span><br />
              <span className="text-blue-400">public class</span> <span className="text-yellow-300">DevPilotCopilotEngine</span> &#123;<br />
              &nbsp;&nbsp;<span className="text-blue-400">public</span> <span className="text-emerald-400">CompletableFuture&lt;Telemetry&gt;</span> <span className="text-blue-300">orchestrate</span>() &#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">// Autonomous zero-latency inference loop</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">return</span> ollamaBridge.streamTokens(<span className="text-emerald-300">"llama3.1"</span>, contextPrompt);<br />
              &nbsp;&nbsp;&#125;<br />
              &#125;
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-16 border-y border-white/[0.08] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">10x</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">Developer Velocity</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">99.9%</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">Uptime Reliability</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">&lt; 20ms</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">API Response Latency</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">100%</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">Local & Private (Ollama)</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Enterprise Capabilities</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">Engineered for High-Output Engineers</h2>
          <p className="text-slate-400 mt-4 text-base">Everything a modern software developer needs to build, debug, and monitor production applications.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard glow glowColor="blue" className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Ollama AI Copilot</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Integrated with local Llama 3.1 models for zero-cost private code refactoring, SQL query tuning, bug diagnosis, and Spring/React assistance.
            </p>
          </GlassCard>

          <GlassCard glow glowColor="purple" className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Jira-Grade Kanban</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Intuitive drag-and-drop task boards with priority flags, comment threads, sprint categorization, and due date alerts.
            </p>
          </GlassCard>

          <GlassCard glow glowColor="emerald" className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Playwright Automation</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Automate website navigations, form fillings, and visual screenshot regressions directly from your Spring Boot backend.
            </p>
          </GlassCard>

          <GlassCard glow glowColor="blue" className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
              <GitBranch className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">GitHub Analytics</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Real-time commit telemetry, contribution heatmap matrices, language distribution charts, and 1-click AI project architecture summaries.
            </p>
          </GlassCard>

          <GlassCard glow glowColor="purple" className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">System Heartbeat</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Live 3-second auto-refreshing monitor capturing CPU load, memory usage, disk allocation, active threads, and top processes.
            </p>
          </GlassCard>

          <GlassCard glow glowColor="emerald" className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Enterprise Security</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Spring Security 6 with stateless JWT access and refresh token rotation, BCrypt encryption, CORS isolation, and role authorization.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Developer Love</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Trusted by Cloud & AI Engineers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: 'DevPilot completely replaced three fragmented tools for me. Having my local Ollama models and Kanban tasks in one glassmorphic dashboard is unmatched.',
              author: 'Elena Rostova',
              role: 'Principal Architect @ CloudVanguard',
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
            },
            {
              quote: 'The Playwright Java integration saves us hours in synthetic smoke testing. DevPilot captures screenshots and logs them without breaking a sweat.',
              author: 'Marcus Chen',
              role: 'Staff DevOps Lead @ HyperScale',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
            },
            {
              quote: 'The dark glassmorphism theme and 60fps animations feel like software built in 2026. Absolutely stunning engineering execution.',
              author: 'Sarah Jenkins',
              role: 'Lead Frontend Engineer @ NexaAI',
              avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
            },
          ].map((t, idx) => (
            <GlassCard key={idx} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">"{t.quote}"</p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/10">
                <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover ring-1 ring-blue-500/50" />
                <div>
                  <h4 className="text-sm font-bold text-white">{t.author}</h4>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto border-t border-white/[0.08]">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Got Questions?</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <GlassCard
              key={i}
              hover={false}
              className="p-5 cursor-pointer"
              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-white">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                    activeFaq === i ? 'rotate-180 text-blue-400' : ''
                  }`}
                />
              </div>
              {activeFaq === i && (
                <p className="mt-4 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </p>
              )}
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="border-t border-white/[0.08] py-16 bg-[#070709] px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-white">DevPilot</span>
            <span className="text-xs text-slate-500">© 2025 DevPilot Technologies Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#workspace" className="hover:text-white">Architecture</a>
            <Link to="/login" className="hover:text-white">Sign In</Link>
            <Link to="/register" className="text-blue-400 hover:underline">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
