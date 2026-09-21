import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
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
} from 'lucide-react';

export const AiAssistantPage = () => {
  const [searchParams] = useSearchParams();
  const { success, error } = useNotification();

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [promptInput, setPromptInput] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('GENERAL');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);

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

  const handleSendPrompt = async (e) => {
    e?.preventDefault();
    if (!promptInput.trim()) return;

    const userPrompt = promptInput;
    const userCode = codeSnippet;

    // Optimistic user message preview
    const tempUserMsg = {
      id: Date.now(),
      role: 'user',
      content: userCode ? `${userPrompt}\n\n\`\`\`\n${userCode}\n\`\`\`` : userPrompt,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setPromptInput('');
    setCodeSnippet('');
    setSending(true);

    try {
      const response = await dashboardService.sendAiPrompt({
        chatId: currentChatId,
        prompt: userPrompt,
        categoryTemplate: selectedTemplate,
        codeSnippet: userCode || null,
        language: 'typescript',
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
    success('Code snippet copied to clipboard!');
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
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">AI Conversations</span>
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
          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-320px)]">
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
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
          <div className="flex items-center gap-2 font-bold mb-1">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Ollama: Llama 3.1</span>
          </div>
          <p className="text-[11px] text-purple-300/80">Local Inference Gateway active at http://localhost:11434</p>
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
              <h2 className="text-sm font-bold text-white">DevPilot AI Developer Copilot</h2>
              <p className="text-[11px] text-slate-400">Contextual Code Architecture & Reasoning Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
              Ready
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
            <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <Bot className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">How can DevPilot assist your code?</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Ask to explain algorithms, detect subtle multi-threaded bugs, optimize SQL indexing, or generate full Spring Boot and React components.
              </p>
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
                  className={`max-w-2xl rounded-20 p-5 ${
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
                        <span>{copiedIndex === idx ? 'Copied' : 'Copy Response'}</span>
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
              <span>DevPilot is generating architecture solution with Llama 3.1...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Prompt Input Form */}
        <div className="p-4 border-t border-white/10 bg-[#0E0E14]">
          <form onSubmit={handleSendPrompt} className="space-y-3">
            <div className="relative">
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
                placeholder="Ask DevPilot Copilot... (Shift+Enter for newline, Enter to submit)"
                className="w-full pl-4 pr-12 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 resize-none transition-colors"
              />

              <button
                type="submit"
                disabled={sending || !promptInput.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
