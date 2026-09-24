import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { useNotification } from '../context/NotificationContext';
import { PROMPT_TEMPLATES } from '../utils/constants';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { Loader } from '../components/common/Loader';
import {
  Bot,
  Send,
  Sparkles,
  Copy,
  Check,
  Code2,
  Trash2,
  Plus,
  MessageSquare,
  Cpu,
  Download,
  Key,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Settings,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const AiAssistantPage = () => {
  const [searchParams] = useSearchParams();
  const { success, error } = useNotification();

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [promptInput, setPromptInput] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('GENERAL');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Cloud AI Provider & Key State
  const [provider, setProvider] = useState(() => localStorage.getItem('devpilot_ai_provider') || 'gemini');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('devpilot_ai_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  const chatEndRef = useRef(null);

  useEffect(() => {
    const initialPrompt = searchParams.get('prompt');
    if (initialPrompt) {
      setPromptInput(initialPrompt);
    }
    loadHistory();
  }, [searchParams]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const history = await dashboardService.getAiHistory();
      setChats(history || []);
      if (history && history.length > 0) {
        loadChat(history[0].id);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const chat = await dashboardService.getAiChat(chatId);
      setCurrentChatId(chat.id);
      setMessages(chat.messages || []);
      setSelectedTemplate(chat.categoryTemplate || 'GENERAL');
    } catch (err) {
      console.error('Failed to load chat:', err);
    }
  };

  const handleStartNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setPromptInput('');
    setCodeSnippet('');
    setShowCodeSnippet(false);
    setSelectedTemplate('GENERAL');
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    try {
      await dashboardService.deleteAiChat(chatId);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (currentChatId === chatId) {
        handleStartNewChat();
      }
      success('Conversation deleted');
    } catch {
      error('Failed to delete chat');
    }
  };

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    if (tempApiKey.trim()) {
      localStorage.setItem('devpilot_ai_key', tempApiKey.trim());
      success('Cloud AI API Key saved!');
    } else {
      localStorage.removeItem('devpilot_ai_key');
      success('Cloud AI API Key cleared. Using built-in engine.');
    }
    setShowKeyModal(false);
  };

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    localStorage.setItem('devpilot_ai_provider', newProvider);
    success(`AI engine switched to ${getProviderLabel(newProvider)}`);
  };

  const getProviderLabel = (p) => {
    switch (p) {
      case 'gemini': return 'Google Gemini 1.5 Flash';
      case 'groq': return 'Groq Llama 3.3 70B';
      case 'ollama': return 'Local Ollama';
      default: return 'Smart Engine';
    }
  };

  const handleSendPrompt = async (e) => {
    e?.preventDefault();
    if (!promptInput.trim()) return;

    const userPrompt = promptInput;
    const userCode = codeSnippet;

    // Optimistic user message preview
    const tempUserMsg = {
      id: Date.now(),
      role: 'user',
      content: userCode ? `${userPrompt}\n\n\`\`\`${selectedLanguage}\n${userCode}\n\`\`\`` : userPrompt,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setPromptInput('');
    setCodeSnippet('');
    setShowCodeSnippet(false);
    setSending(true);

    try {
      const response = await dashboardService.sendAiPrompt({
        chatId: currentChatId,
        prompt: userPrompt,
        categoryTemplate: selectedTemplate,
        codeSnippet: userCode || null,
        language: selectedLanguage,
        provider: provider,
        apiKey: apiKey || undefined,
      });

      setCurrentChatId(response.id);
      setMessages(response.messages || []);

      // Update chats history list
      setChats((prev) => {
        const existing = prev.find((c) => c.id === response.id);
        if (existing) {
          return prev.map((c) => (c.id === response.id ? response : c));
        }
        return [response, ...prev];
      });
    } catch (err) {
      error(err.message || 'AI Copilot inference error');
    } finally {
      setSending(false);
    }
  };

  const handleCopyCode = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    success('Response copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;
    const transcript = messages
      .map((m) => `[${m.role.toUpperCase()} - ${new Date(m.createdAt).toLocaleTimeString()}]:\n${m.content}\n`)
      .join('\n----------------------------------------\n\n');

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DevPilot_Chat_${currentChatId || 'export'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    success('Conversation exported to file');
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-6">
      {/* Sidebar: Chat History & Model Status */}
      <div className="w-full lg:w-72 flex flex-col rounded-24 bg-[#0A0A0E]/80 border border-white/[0.08] backdrop-blur-xl p-4 shrink-0 justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">AI History</span>
            </div>
            <button
              onClick={handleStartNewChat}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <AnimatedButton
            onClick={handleStartNewChat}
            variant="outline"
            size="sm"
            className="w-full mb-3"
            icon={Plus}
          >
            New Conversation
          </AnimatedButton>

          {/* History list */}
          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-360px)]">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => loadChat(chat.id)}
                className={`p-2.5 rounded-xl text-xs font-medium cursor-pointer flex items-center justify-between group transition-all ${
                  currentChatId === chat.id
                    ? 'bg-purple-600/20 text-white border border-purple-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                  <span className="truncate">{chat.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {chats.length === 0 && !loadingHistory && (
              <p className="text-xs text-slate-500 text-center py-6">No previous chats recorded.</p>
            )}
          </div>
        </div>

        {/* Model Status Card */}
        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{getProviderLabel(provider)}</span>
            </div>
            <button
              onClick={() => {
                setTempApiKey(apiKey);
                setShowKeyModal(true);
              }}
              className="text-[10px] text-purple-300 hover:text-white underline underline-offset-2 flex items-center gap-0.5"
            >
              <Key className="w-2.5 h-2.5" /> {apiKey ? 'Key Set' : 'Add Key'}
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`} />
            <span>{apiKey ? 'Cloud API Active' : 'Smart Context Engine'}</span>
          </div>

          <div className="pt-1 flex gap-1">
            <button
              onClick={() => handleProviderChange('gemini')}
              className={`flex-1 py-1 text-[10px] rounded font-semibold transition-colors ${
                provider === 'gemini' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Gemini
            </button>
            <button
              onClick={() => handleProviderChange('groq')}
              className={`flex-1 py-1 text-[10px] rounded font-semibold transition-colors ${
                provider === 'groq' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Groq
            </button>
            <button
              onClick={() => handleProviderChange('ollama')}
              className={`flex-1 py-1 text-[10px] rounded font-semibold transition-colors ${
                provider === 'ollama' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Ollama
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col rounded-24 bg-[#0A0A0E]/80 border border-white/[0.08] backdrop-blur-xl overflow-hidden">
        {/* Chat Header Toolbar */}
        <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">DevPilot AI Copilot</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                  {getProviderLabel(provider)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Contextual Code Architecture, Bug Detection, & Test Generator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTempApiKey(apiKey);
                setShowKeyModal(true);
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-purple-400" />
              <span>{apiKey ? 'API Key Active' : 'Set Cloud Key'}</span>
            </button>

            {messages.length > 0 && (
              <button
                onClick={handleExportChat}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                title="Export Transcript"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Live
            </span>
          </div>
        </div>

        {/* Quick Category Templates Bar */}
        <div className="px-6 py-2 border-b border-white/5 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Templates:</span>
          {PROMPT_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => {
                setSelectedTemplate(tmpl.id);
                setPromptInput(tmpl.prompt);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                selectedTemplate === tmpl.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tmpl.title}
            </button>
          ))}
        </div>

        {/* Messages Stream Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/10">
                <Bot className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">How can DevPilot assist your code today?</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Connect your code to Google Gemini 1.5 Flash or Groq Llama 3.3 for instant bug diagnosis, unit test generation, SQL index optimization, and Spring Boot / React architectures.
              </p>

              {/* Instant Developer Quick Actions */}
              <div className="grid grid-cols-2 gap-2.5 mt-6 w-full text-left">
                <button
                  onClick={() => {
                    setSelectedTemplate('BUG_DETECT');
                    setPromptInput('Analyze this code for potential memory leaks, unhandled exceptions, and race conditions.');
                    setShowCodeSnippet(true);
                  }}
                  className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-all text-xs group"
                >
                  <div className="font-semibold text-white group-hover:text-purple-300 flex items-center gap-1.5">
                    <span>🐛 Find Bugs & Leaks</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Detect edge cases & null safety</p>
                </button>

                <button
                  onClick={() => {
                    setSelectedTemplate('UNIT_TEST');
                    setPromptInput('Generate an exhaustive unit test suite with positive, negative, and edge test cases.');
                    setShowCodeSnippet(true);
                  }}
                  className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-all text-xs group"
                >
                  <div className="font-semibold text-white group-hover:text-purple-300 flex items-center gap-1.5">
                    <span>🧪 Generate Unit Tests</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">JUnit 5 & Jest suites</p>
                </button>

                <button
                  onClick={() => {
                    setSelectedTemplate('REFACTOR');
                    setPromptInput('Refactor this code to follow clean architecture, high cohesion, and low cyclomatic complexity.');
                    setShowCodeSnippet(true);
                  }}
                  className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-all text-xs group"
                >
                  <div className="font-semibold text-white group-hover:text-purple-300 flex items-center gap-1.5">
                    <span>⚡ Refactor & Optimize</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Clean functional pipelines</p>
                </button>

                <button
                  onClick={() => {
                    setSelectedTemplate('SQL_HELPER');
                    setPromptInput('Write an optimized, indexed TiDB Serverless SQL query for high-throughput pagination.');
                    setShowCodeSnippet(false);
                  }}
                  className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-all text-xs group"
                >
                  <div className="font-semibold text-white group-hover:text-purple-300 flex items-center gap-1.5">
                    <span>🗄️ TiDB & SQL Query</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Index covered queries</p>
                </button>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id || idx}
                className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-3xl rounded-20 p-5 ${
                    isUser
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-white/[0.04] border border-white/10 text-slate-200'
                  }`}
                >
                  <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {!isUser && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString()}
                      </span>
                      <button
                        onClick={() => handleCopyCode(msg.content, idx)}
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                      >
                        {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                    <Code2 className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {sending && (
            <div className="flex gap-4 items-center text-xs text-purple-400 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <span>DevPilot is generating architecture solution with {getProviderLabel(provider)}...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Code Snippet Drawer (Collapsible) */}
        {showCodeSnippet && (
          <div className="px-4 py-3 bg-[#0A0A0E] border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-semibold text-slate-300">Code Snippet / Error Stack Trace</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] text-slate-300 focus:outline-none"
                >
                  <option value="java" className="bg-slate-900">Java</option>
                  <option value="typescript" className="bg-slate-900">TypeScript / React</option>
                  <option value="python" className="bg-slate-900">Python</option>
                  <option value="sql" className="bg-slate-900">SQL</option>
                  <option value="go" className="bg-slate-900">Go</option>
                </select>
                <button
                  type="button"
                  onClick={() => setShowCodeSnippet(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="Paste code snippet or error trace here..."
              className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-purple-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 resize-y"
            />
          </div>
        )}

        {/* Prompt Input Form */}
        <div className="p-4 border-t border-white/10 bg-[#0E0E14] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <button
              type="button"
              onClick={() => setShowCodeSnippet(!showCodeSnippet)}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              <span>{showCodeSnippet ? 'Hide Code Snippet' : '+ Attach Code Snippet'}</span>
              {showCodeSnippet ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
            <span className="hidden sm:inline">Enter to submit | Shift+Enter for new line</span>
          </div>

          <form onSubmit={handleSendPrompt} className="relative">
            <textarea
              rows={2}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendPrompt();
                }
              }}
              placeholder={`Ask DevPilot Copilot with ${getProviderLabel(provider)}...`}
              className="w-full pl-4 pr-12 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 resize-none transition-colors"
            />

            <button
              type="submit"
              disabled={sending || !promptInput.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-all shadow-md shadow-purple-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Cloud API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-24 bg-[#12121A] border border-white/15 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Connect Free Cloud AI</h3>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              DevPilot connects directly to <strong>Google Gemini 1.5 Flash</strong> or <strong>Groq Cloud</strong>. Both offer completely free API tiers without credit card requirements.
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-200">API Key ({getProviderLabel(provider)})</label>
                  <a
                    href={provider === 'gemini' ? 'https://aistudio.google.com/app/apikey' : 'https://console.groq.com/keys'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium underline"
                  >
                    Get Free Key <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder={provider === 'gemini' ? 'AIzaSy...' : 'gsk_...'}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-purple-500/60"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
