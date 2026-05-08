import React from 'react';
import type { Source } from '../types';
import ReactMarkdown from 'react-markdown';

interface Props {
  text: string;
  sources: Source[];
  related: string[];
  onRelated: (q: string) => void;
}

export const BotMessage: React.FC<Props> = ({ text, sources, related, onRelated }) => {
  return (
    <div className="bot-message">
      {/* Main content */}
      <div className="bot-bubble">
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <h2 className="bot-h2">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="bot-h3">{children}</h3>
            ),
            p: ({ children }) => <p className="bot-p">{children}</p>,
            ul: ({ children }) => <ul className="bot-ul">{children}</ul>,
            ol: ({ children }) => <ol className="bot-ol">{children}</ol>,
            li: ({ children }) => <li className="bot-li">{children}</li>,
            strong: ({ children }) => <strong className="bot-strong">{children}</strong>,
            code: ({ children }) => <code className="bot-code">{children}</code>,
          }}
        >
          {text}
        </ReactMarkdown>
      </div>

      {/* Sources panel */}
      {sources.length > 0 && (
        <div className="sources-panel">
          <div className="sources-title">
            <i className="ti ti-books" aria-hidden="true" />
            Zdroje a reference
          </div>
          <div className="sources-links">
            {sources.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="source-link">
                <i className="ti ti-external-link" aria-hidden="true" />
                {s.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ČAK Disclaimer */}
      <div className="disclaimer">
        <i className="ti ti-alert-triangle" aria-hidden="true" />
        <span>
          Toto jsou obecné informace, nikoliv závazná právní rada. Pro váš konkrétní případ doporučujeme
          konzultaci s advokátem —{' '}
          <a href="https://www.cak.cz" target="_blank" rel="noopener noreferrer">
            seznam advokátů na cak.cz
          </a>
          .
        </span>
      </div>

      {/* Related questions carousel */}
      {related.length > 0 && (
        <div className="related-section">
          <div className="related-title">Možná vás zajímá také</div>
          <div className="related-scroll">
            {related.map((q, i) => (
              <button key={i} className="related-chip" onClick={() => onRelated(q)}>
                <i className="ti ti-message-question" aria-hidden="true" />
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
