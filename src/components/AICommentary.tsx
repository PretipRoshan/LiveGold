import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface AICommentaryProps {
  onRefreshCommentary: () => Promise<void>;
  commentary: string;
  isGenerating: boolean;
  hasApiKey: boolean;
}

export default function AICommentary({ 
  onRefreshCommentary, 
  commentary, 
  isGenerating,
  hasApiKey
}: AICommentaryProps) {
  const [showHelperExplanation, setShowHelperExplanation] = useState(false);

  // Helper to parse simple markdown to clean JSX elements (supporting bold, headers, lists)
  const renderFormattedText = (rawText: string) => {
    if (!rawText) return <p className="text-[#848E9C] italic">No market summary requested yet. Tap generating below.</p>;

    const paragraphs = rawText.split('\n\n').filter(p => p.trim());
    return paragraphs.map((para, pIdx) => {
      // Headers
      if (para.startsWith('### ')) {
        return <h4 key={pIdx} className="font-sans font-bold text-white text-base mt-4 mb-2">{para.replace('### ', '')}</h4>;
      }
      if (para.startsWith('## ')) {
        return <h3 key={pIdx} className="font-sans font-extrabold text-white text-lg mt-5 mb-2.5">{para.replace('## ', '')}</h3>;
      }
      if (para.startsWith('# ')) {
        return <h2 key={pIdx} className="font-sans font-black text-white text-xl mt-6 mb-3 border-b border-[#2A2D35] pb-1">{para.replace('# ', '')}</h2>;
      }

      // Handle Bullet list items
      if (para.startsWith('- ') || para.startsWith('* ')) {
        const items = para.split('\n').map(l => l.replace(/^[-*]\s+/, '').trim()).filter(Boolean);
        return (
          <ul key={pIdx} className="list-disc pl-5 my-3 space-y-1.5 text-[#E0E0E0] font-sans text-sm">
            {items.map((it, iIdx) => {
              // Extract bold items
              const boldRegex = /\*\*(.*?)\*\*/g;
              const parts = [];
              let lastIndex = 0;
              let match;
              while ((match = boldRegex.exec(it)) !== null) {
                if (match.index > lastIndex) {
                  parts.push(it.substring(lastIndex, match.index));
                }
                parts.push(<strong key={match.index} className="text-white font-bold">{match[1]}</strong>);
                lastIndex = boldRegex.lastIndex;
              }
              if (lastIndex < it.length) {
                parts.push(it.substring(lastIndex));
              }
              return <li key={iIdx}>{parts.length > 0 ? parts : it}</li>;
            })}
          </ul>
        );
      }

      // Handle raw paragraph text with internal bold formatting
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(para)) !== null) {
        if (match.index > lastIndex) {
          parts.push(para.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="text-white font-bold">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < para.length) {
        parts.push(para.substring(lastIndex));
      }

      return (
        <p key={pIdx} className="text-[#E0E0E0] font-sans text-sm leading-relaxed mb-4 text-justify">
          {parts.length > 0 ? parts : para}
        </p>
      );
    });
  };

  return (
    <div className="bg-[#12141A] rounded-2xl border border-[#2A2D35] shadow-2xl p-6 animate-fade-in" id="ai-room-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="bg-[#1E2129] p-2 border border-[#2A2D35] rounded-lg text-[#F0B90B]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-bold text-white text-base" id="ai-commentary-header">Gemini AI Academic Tutor & Analyst</h3>
          </div>
          <p className="text-xs text-[#848E9C] mt-1.5 font-sans" id="ai-commentary-subtitle">Supporting beginner users with deep educational trend diagnostics</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHelperExplanation(!showHelperExplanation)}
            className="flex items-center space-x-1 text-xs text-[#848E9C] hover:text-[#F0B90B] p-2 rounded hover:bg-[#1E2129] transition cursor-pointer"
            id="help-toggle-btn"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How it works</span>
          </button>

          <button
            disabled={isGenerating}
            onClick={onRefreshCommentary}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#F0B90B] hover:bg-[#DFAB0A] disabled:opacity-50 text-[#0A0B0D] font-sans text-xs font-bold rounded-xl shadow-lg transition-all focus:outline-none cursor-pointer"
            id="dispatch-commentary-btn"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Triggering Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Market Commentary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showHelperExplanation && (
        <div className="mb-6 p-4 bg-[#0F1115] rounded-xl border border-[#2A2D35] text-xs text-[#848E9C] leading-relaxed space-y-2.5 font-sans fade-in" id="helper-explanation-box">
          <p className="font-bold text-white">How is this commentary generated?</p>
          <p>This module demonstrates full-stack LLM (Large Language Model) integration in a decision support system as required by SUC's curriculum.</p>
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>The custom Node/Express backend retrieves current analytical parameters computed dynamically by the mathematical indicator engine (Close, MA20, MA50, and RSI14).</li>
            <li>It formats a precise prompts schema detailing the indicator boundaries and active signal results.</li>
            <li>It securely queries Google's <strong>gemini-3.5-flash</strong> model via server-side credentials to bypass browser client vulnerability.</li>
            <li>The response returns structured educational breakdowns, helping beginners learn how technical signals map to actual math concepts in the trend.</li>
          </ol>
        </div>
      )}

      {!hasApiKey && (
        <div className="mb-5 p-4 bg-[#2B2816] rounded-xl border border-[#F0B90B]/30 flex items-start space-x-3 text-xs text-[#F0B90B] font-sans" id="no-key-warning">
          <ShieldCheck className="w-5 h-5 text-[#F0B90B] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Missing Server-side API Credentials</p>
            <p className="leading-relaxed text-[#DFAB0A]">The backend detected no <strong>GEMINI_API_KEY</strong> inside environment variables. It has provided an informative fallback explanation. To enable live dynamic analysis, register your Google AI Studio API Secret in <strong>Settings &gt; Secrets</strong> and restart the dev server.</p>
          </div>
        </div>
      )}

      {/* Actual Commentary Output Area */}
      <div 
        className="bg-[#0F1115] rounded-2xl border border-[#2A2D35] p-6 min-h-[160px] shadow-inner font-sans prose prose-slate max-w-none text-[#E0E0E0] select-text selection:bg-[#F0B90B]/20" 
        id="commentary-output-container"
      >
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-3" id="ai-loading-stage">
            <Loader2 className="w-8 h-8 text-[#F0B90B] animate-spin" />
            <div className="text-center">
              <p className="text-xs font-bold text-white animate-pulse">Running advanced full-stack analysis...</p>
              <p className="text-[10px] text-[#848E9C] mt-1">Passing current MA20, MA50, and RSI thresholds to Gemini 3.5 Flash</p>
            </div>
          </div>
        ) : (
          <div className="fade-in" id="ai-resolved-text">
            {renderFormattedText(commentary)}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-[#848E9C] font-sans border-t border-[#2A2D35] pt-3" id="ai-commentary-footer">
        <span>Model Target: <strong className="font-bold text-white font-mono text-[10px]">gemini-3.5-flash</strong></span>
        <span>Securely processed via Express SSL</span>
      </div>
    </div>
  );
}
