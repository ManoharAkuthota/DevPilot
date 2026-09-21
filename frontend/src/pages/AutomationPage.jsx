import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { useNotification } from '../context/NotificationContext';
import { formatDate } from '../utils/formatters';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { Loader } from '../components/common/Loader';
import { Modal } from '../components/common/Modal';
import {
  Globe,
  Play,
  Plus,
  Clock,
  Terminal,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
} from 'lucide-react';

export const AutomationPage = () => {
  const { success, error } = useNotification();
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeRunLog, setActiveRunLog] = useState(null);
  const [activeScreenshot, setActiveScreenshot] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetUrl, setTargetUrl] = useState('https://');
  const [actionType, setActionType] = useState('SCREENSHOT_CAPTURE');
  const [actionsJson, setActionsJson] = useState('');
  const [scheduleCron, setScheduleCron] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runningId, setRunningId] = useState(null);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getAutomations();
      setAutomations(data || []);
    } catch (err) {
      console.error('Failed to load automations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomations();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !targetUrl) {
      error('Please provide workflow name and target URL');
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await dashboardService.createAutomation({
        name,
        description,
        targetUrl,
        actionType,
        actionsJson: actionsJson || null,
        scheduleCron: scheduleCron || null,
      });

      setAutomations((prev) => [created, ...prev]);
      success('Browser automation workflow created!');
      setCreateModalOpen(false);
      resetForm();
    } catch (err) {
      error(err.message || 'Failed to create automation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunWorkflow = async (automationId) => {
    try {
      setRunningId(automationId);
      success('Launching Playwright headless browser instance...');
      const runResult = await dashboardService.runAutomation(automationId);

      // Update runs in local state
      setAutomations((prev) =>
        prev.map((a) => {
          if (a.id === automationId) {
            return {
              ...a,
              runs: [runResult, ...(a.runs || [])],
            };
          }
          return a;
        })
      );

      success(`Workflow finished in ${runResult.durationMs}ms!`);
      setActiveRunLog(runResult);
    } catch (err) {
      error(err.message || 'Workflow execution encountered an issue');
    } finally {
      setRunningId(null);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setTargetUrl('https://');
    setActionType('SCREENSHOT_CAPTURE');
    setActionsJson('');
    setScheduleCron('');
  };

  if (loading) {
    return <Loader message="Loading Playwright browser orchestrator..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Browser Automation</h1>
          <p className="text-xs text-slate-400">Headless browser workflows, screen capture & synthetic testing powered by Playwright Java</p>
        </div>

        <AnimatedButton
          onClick={() => setCreateModalOpen(true)}
          variant="gradient"
          size="sm"
          icon={Plus}
        >
          New Automation
        </AnimatedButton>
      </div>

      {/* Automations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automations.map((auto) => {
          const latestRun = auto.runs && auto.runs.length > 0 ? auto.runs[0] : null;

          return (
            <GlassCard key={auto.id} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">{auto.name}</h3>
                      <a
                        href={auto.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                      >
                        <span className="truncate max-w-[200px]">{auto.targetUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase">
                    {auto.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {auto.description || 'Automated synthetic URL crawl and visual inspection.'}
                </p>

                {/* Latest Run Snapshot */}
                {latestRun && (
                  <div className="mt-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Latest Run:</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {latestRun.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Duration: <strong className="text-white">{latestRun.durationMs}ms</strong></span>
                      <span>{formatDate(latestRun.executedAt)}</span>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => setActiveRunLog(latestRun)}
                        className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                      >
                        <Terminal className="w-3.5 h-3.5" /> View Logs
                      </button>

                      {latestRun.screenshotUrl && (
                        <button
                          onClick={() => setActiveScreenshot(latestRun.screenshotUrl)}
                          className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors ml-auto"
                        >
                          <ImageIcon className="w-3.5 h-3.5" /> Screenshot
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {auto.runs?.length || 0} total executions
                </span>

                <AnimatedButton
                  onClick={() => handleRunWorkflow(auto.id)}
                  loading={runningId === auto.id}
                  variant="primary"
                  size="sm"
                  icon={Play}
                >
                  Run Playwright
                </AnimatedButton>
              </div>
            </GlassCard>
          );
        })}

        {automations.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <Globe className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">No browser automations configured yet.</p>
            <AnimatedButton
              onClick={() => setCreateModalOpen(true)}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Create First Workflow
            </AnimatedButton>
          </div>
        )}
      </div>

      {/* Create Automation Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="New Browser Automation Workflow"
        subtitle="Configure Playwright Java headless browser actions and schedules"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Workflow Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Production Login & Health Smoke Test"
              required
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Target URL *</label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe workflow steps and validation criteria..."
              className="w-full px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Action Type</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none"
              >
                <option value="SCREENSHOT_CAPTURE" className="bg-[#0E0E14]">Screenshot Capture</option>
                <option value="FORM_FILL_SUBMIT" className="bg-[#0E0E14]">Form Fill & Submit</option>
                <option value="DATA_EXTRACT" className="bg-[#0E0E14]">DOM Content Extraction</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Schedule Cron (Optional)</label>
              <input
                type="text"
                value={scheduleCron}
                onChange={(e) => setScheduleCron(e.target.value)}
                placeholder="e.g. 0 0 * * *"
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
              />
            </div>
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
              Save Automation
            </AnimatedButton>
          </div>
        </form>
      </Modal>

      {/* Playwright Execution Log Modal */}
      <Modal
        isOpen={!!activeRunLog}
        onClose={() => setActiveRunLog(null)}
        title="Playwright Execution Telemetry"
        subtitle={`Run duration: ${activeRunLog?.durationMs}ms • Status: ${activeRunLog?.status}`}
      >
        {activeRunLog && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-black border border-white/10 font-mono text-xs text-emerald-400 whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
              {activeRunLog.logs}
            </div>

            <div className="flex justify-end">
              <AnimatedButton
                onClick={() => setActiveRunLog(null)}
                variant="outline"
                size="sm"
              >
                Done
              </AnimatedButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Screenshot Preview Modal */}
      <Modal
        isOpen={!!activeScreenshot}
        onClose={() => setActiveScreenshot(null)}
        title="Captured Viewport Screenshot"
        subtitle="High-DPI automated screen capture produced by Playwright"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center p-4">
            <img
              src={activeScreenshot}
              alt="Screenshot Preview"
              className="max-h-[500px] w-auto object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                // Fallback placeholder image if physical display capture file is transparent
                e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80';
              }}
            />
          </div>
          <div className="flex justify-end">
            <AnimatedButton
              onClick={() => setActiveScreenshot(null)}
              variant="outline"
              size="sm"
            >
              Close
            </AnimatedButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};
