import React, { useState } from 'react';
import { TransitChatMessage } from '../types';
import { Sparkles, Send, Bot, User, X, RefreshCw } from 'lucide-react';

interface TransitAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPassType: (passType: any) => void;
}

export const TransitAssistant: React.FC<TransitAssistantProps> = ({
  isOpen,
  onClose,
  onSelectPassType,
}) => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<TransitChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Hello! I am your Cloud Transit AI Assistant powered by server-side Gemini AI. How can I assist you with bus pass selection, concessions, dynamic fare calculations, or cloud anti-loss security?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: '🎓 Student 50% Off Pass', action: 'pass_student' },
        { label: '🛡️ How anti-theft works?', action: 'ask_security' },
        { label: '⚡ How auto-scaler handles rush hour?', action: 'ask_autoscale' },
      ]
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: TransitChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      const data = await res.json();

      const aiMsg: TransitChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text: data.text || 'I am ready to help with your transit pass requirements.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          text: 'Connected to local fallback engine. For full student concessions, use our verified 50% discount option in the booking wizard.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[560px]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center font-bold">
              <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Cloud Transit AI Assistant</h3>
              <p className="text-[11px] text-indigo-100 font-mono">Powered by Gemini 2.5 Flash API</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div className={`max-w-[80%] space-y-2 ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none p-3 shadow-md'
                  : 'bg-slate-800 text-slate-100 rounded-2xl rounded-tl-none p-3 border border-slate-700/80'
              }`}>
                <p className="leading-relaxed">{m.text}</p>
                <div className="text-[9px] opacity-60 text-right">{m.timestamp}</div>

                {m.suggestedActions && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-700/50">
                    {m.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(act.label)}
                        className="bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-200 text-[10px] px-2.5 py-1 rounded-full border border-indigo-400/30 font-semibold transition"
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-slate-400 text-xs">
              <Bot className="h-4 w-4 text-indigo-400 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Ask about bus passes, fares, or cloud auto-scaling..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleSendMessage()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition shadow-md"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
