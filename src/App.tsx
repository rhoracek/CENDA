import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Message, ApiMessage } from './types';
import { callClaude, parseResponse } from './api';
import { BotMessage } from './components/BotMessage';
import { WelcomeScreen } from './components/WelcomeScreen';

const TOPICS = [
  { icon: 'ti-gavel', label: 'Exekuce', q: 'Exekuce a dluhy' },
  { icon: 'ti-heart-broken', label: 'Rozvod', q: 'Rozvod a rodinné právo' },
  { icon: 'ti-briefcase', label: 'Práce', q: 'Pracovní právo a výpověď' },
  { icon: 'ti-home', label: 'Bydlení', q: 'Bydlení a nájemní právo' },
  { icon: 'ti-currency-crown', label: 'Insolvence', q: 'Insolvence a oddlužení' },
  { icon: 'ti-file-text', label: 'Dědictví', q: 'Dědictví a pozůstalost' },
  { icon: 'ti-shield', label: 'Trestní právo', q: 'Trestní právo' },
  { icon: 'ti-map-pin', label: 'Sousedé', q: 'Sousedské spory' },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  };

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    const history: ApiMessage[] = [...messages, userMsg].map(m => ({ role: m.role, content: m.raw ?? m.content }));
    try {
      const raw = await callClaude(history);
      const { mainText, sources, related } = parseResponse(raw);
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'assistant', content: mainText, sources, related, raw }]);
    } catch {
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'assistant', content: '## Chyba připojení\n\nNepodařilo se připojit k serveru.', sources: [], related: ['Jsem v exekuci, co mám dělat?','Jak podat žalobu?','Kdy se promlčí pohledávka?'] }]);
    }
    setLoading(false);
  }, [messages, loading]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <div className="app-root">
      <div className="app-bg-radial" />
      <header className="app-header">
        <div className="header-avatar">Č</div>
        <div className="header-info">
          <h1>Virtuální poradna ČENDA</h1>
          <p><span className="status-dot" />AI právní poradce pro občany ČR · obecné informace</p>
        </div>
        <button className="clear-btn" onClick={() => setMessages([])} title="Nový dotaz">
          <i className="ti ti-refresh" aria-hidden="true" /> Nový dotaz
        </button>
      </header>
      <div className="topics-bar">
        {TOPICS.map(t => (
          <button key={t.q} className="topic-chip" onClick={() => sendMessage(t.q)}>
            <i className={`ti ${t.icon}`} aria-hidden="true" />{t.label}
          </button>
        ))}
      </div>
      <div className="messages-area">
        {messages.length === 0 ? (
          <WelcomeScreen onSelect={sendMessage} />
        ) : (
          <>
            {messages.map(m => (
              <div key={m.id} className={m.role === 'user' ? 'msg-user-wrap' : 'msg-bot-wrap'}>
                {m.role === 'user' ? (
                  <div className="msg-user-bubble">{m.content}</div>
                ) : (
                  <>
                    <div className="msg-bot-header">
                      <div className="msg-bot-avatar">Č</div>
                      <span className="msg-bot-name">ČENDA · právní poradce</span>
                    </div>
                    <BotMessage text={m.content} sources={m.sources??[]} related={m.related??[]} onRelated={sendMessage} />
                  </>
                )}
              </div>
            ))}
            {loading && (
              <div className="msg-bot-wrap">
                <div className="msg-bot-header">
                  <div className="msg-bot-avatar">Č</div>
                  <span className="msg-bot-name">ČENDA odpovídá…</span>
                </div>
                <div className="typing-indicator">
                  <span className="typing-dot"/><span className="typing-dot"/><span className="typing-dot"/>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <div className="input-row">
          <textarea ref={textareaRef} value={input} onChange={e=>{setInput(e.target.value);autoResize();}} onKeyDown={handleKey} placeholder="Napište svůj právní dotaz…" rows={1} disabled={loading} />
          <button className="send-btn" onClick={() => sendMessage(input)} disabled={loading || !input.trim()} title="Odeslat">
            <i className="ti ti-send" aria-hidden="true" />
          </button>
        </div>
        <p className="footer-note">ČENDA poskytuje obecné informace. Toto není závazná právní rada — pro konkrétní případ kontaktujte advokáta.</p>
      </div>
    </div>
  );
}
