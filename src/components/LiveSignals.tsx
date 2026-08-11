import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  HelpCircle, 
  RefreshCw, 
  Check, 
  X, 
  Gauge, 
  ArrowUpRight, 
  ArrowDownRight, 
  GitCommit 
} from 'lucide-react';
import { AnalysisResponse, SignalType } from '../types';

interface LiveSignalsProps {
  analysis: AnalysisResponse;
  onSimulateTick: (direction: 'up' | 'down' | 'random', swing: 'small' | 'large') => Promise<void>;
  onResetData: () => Promise<void>;
  isSimulating: boolean;
}

export default function LiveSignals({ 
  analysis, 
  onSimulateTick, 
  onResetData, 
  isSimulating 
}: LiveSignalsProps) {
  const { currentPrice, indicators, signal, explanation, ruleDetails } = analysis;
  const { ma20, ma50, rsi14 } = indicators;

  // Get Styling presets based on signal type
  const getSignalStyles = (sig: SignalType) => {
    switch (sig) {
      case 'BUY':
        return {
          bg: 'bg-[#12141A] border-[#0ECB81]/40 text-[#0ECB81]',
          badge: 'bg-[#0ECB81] text-[#0A0B0D] font-black',
          text: 'text-[#0ECB81]',
          iconColor: 'text-[#0ECB81]',
          grad: 'from-[#0ECB81]/15 to-transparent',
          glow: 'shadow-[0_0_20px_rgba(14,203,129,0.15)]'
        };
      case 'SELL':
        return {
          bg: 'bg-[#12141A] border-[#F6465D]/40 text-[#F6465D]',
          badge: 'bg-[#F6465D] text-white font-black',
          text: 'text-[#F6465D]',
          iconColor: 'text-[#F6465D]',
          grad: 'from-[#F6465D]/15 to-transparent',
          glow: 'shadow-[0_0_20px_rgba(246,70,93,0.15)]'
        };
      default:
        return {
          bg: 'bg-[#12141A] border-[#F0B90B]/40 text-[#F0B90B]',
          badge: 'bg-[#F0B90B] text-[#0A0B0D] font-black',
          text: 'text-[#F0B90B]',
          iconColor: 'text-[#F0B90B]',
          grad: 'from-[#F0B90B]/15 to-transparent',
          glow: 'shadow-[0_0_20px_rgba(240,185,11,0.15)]'
        };
    }
  };

  const style = getSignalStyles(signal);

  // Sub-clause verification helpers for active rule validation
  const checkBuyCondition = () => {
    if (ma20 === null || ma50 === null || rsi14 === null) return { overMA: false, normalRSI: false };
    return {
      overMA: currentPrice > ma20 && currentPrice > ma50,
      normalRSI: rsi14 >= 50 && rsi14 <= 70
    };
  };

  const checkSellCondition = () => {
    if (ma20 === null || ma50 === null || rsi14 === null) return { underMA: false, bearishRSI: false };
    return {
      underMA: currentPrice < ma20 && currentPrice < ma50,
      bearishRSI: rsi14 >= 30 && rsi14 <= 60
    };
  };

  const buyCheck = checkBuyCondition();
  const sellCheck = checkSellCondition();

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="live-signals-module">
      
      {/* 1. Large Signal Status Card (Left 7-columns) */}
      <div className={`md:col-span-12 xl:col-span-8 flex flex-col bg-gradient-to-b ${style.grad} bg-[#12141A] rounded-2xl border ${style.bg} shadow-2xl ${style.glow} p-6 transition-all duration-300`} id="signal-state-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Gauge className="w-5 h-5 text-white" />
            <h3 className="font-sans font-bold text-white text-base" id="engine-card-header">Indicator Decision Engine</h3>
          </div>
          <span className="font-mono text-[9px] text-[#848E9C] bg-[#1E2129] px-2.5 py-1 border border-[#2A2D35] rounded-sm" id="engine-clock">
            Real-time Logic
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1 py-1" id="signal-flex-view">
          {/* Signal Highlight Token */}
          <div className="flex flex-col items-center justify-center bg-[#0F1115] border border-[#2A2D35] p-5 rounded-2xl shadow-inner min-w-[170px]" id="badge-token">
            <span className="text-[10px] uppercase font-bold text-[#848E9C] tracking-wider mb-2 font-sans">Active Signal</span>
            <span className={`px-6 py-2 rounded-xl font-bold text-2xl tracking-widest ${style.badge} shadow-lg`} id="active-signal-badge">
              {signal}
            </span>
          </div>

          <div className="flex-1 space-y-3.5" id="signal-explanations">
            <div className="space-y-1">
              <h4 className="text-xs uppercase font-bold text-[#848E9C] tracking-wide font-sans">Condition Evaluated</h4>
              <p className="text-[11px] font-mono font-medium text-white bg-[#0F1115] border border-[#2A2D35] py-2 px-3 rounded-lg" id="evaluated-expression">
                {ruleDetails.expression}
              </p>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-xs uppercase font-bold text-[#848E9C] tracking-wide font-sans">Educational Explanation</h4>
              <p className="text-sm font-sans font-medium text-[#E0E0E0] leading-relaxed text-justify" id="signal-educational-summary">
                {explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Sub-clause evaluation logs */}
        <div className="mt-5 border-t border-[#2A2D35] pt-4" id="indicator-verification-grid">
          <h4 className="text-xs font-bold text-[#848E9C] uppercase tracking-wide font-sans mb-3">Mathematical Condition Auditing</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            {/* BUY Rules Checks */}
            <div className="p-3 bg-[#0F1115]/80 border border-[#2A2D35] rounded-xl space-y-2" id="buy-clauses-box">
              <p className="font-bold text-white">Clause [1]: BUY Rules (Bullish Confirmation)</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between" id="buy-cb-1">
                  <span className="text-[#848E9C] text-[11px]">Price (${currentPrice}) &gt; MA20 (${ma20}) &amp; MA50 ({ma50})</span>
                  {buyCheck.overMA ? <Check className="w-4 h-4 text-[#0ECB81]" /> : <X className="w-4 h-4 text-[#F6465D]" />}
                </div>
                <div className="flex items-center justify-between" id="buy-cb-2">
                  <span className="text-[#848E9C] text-[11px]">RSI14 ({rsi14}) between [40, 70]</span>
                  {buyCheck.normalRSI ? <Check className="w-4 h-4 text-[#0ECB81]" /> : <X className="w-4 h-4 text-[#F6465D]" />}
                </div>
              </div>
            </div>

            {/* SELL Rules Checks */}
            <div className="p-3 bg-[#0F1115]/80 border border-[#2A2D35] rounded-xl space-y-2" id="sell-clauses-box">
              <p className="font-bold text-white">Clause [2]: SELL Rules (Bearish Confirmation)</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between" id="sell-cb-1">
                  <span className="text-[#848E9C] text-[11px]">Price (${currentPrice}) &lt; MA20 (${ma20}) &amp; MA50 (${ma50})</span>
                  {sellCheck.underMA ? <Check className="w-4 h-4 text-[#0ECB81]" /> : <X className="w-4 h-4 text-[#F6465D]" />}
                </div>
                <div className="flex items-center justify-between" id="sell-cb-2">
                  <span className="text-[#848E9C] text-[11px]">RSI14 ({rsi14}) between [30, 60]</span>
                  {sellCheck.bearishRSI ? <Check className="w-4 h-4 text-[#0ECB81]" /> : <X className="w-4 h-4 text-[#F6465D]" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Simulator Controller panel (Right 5-columns) */}
      <div className="md:col-span-12 xl:col-span-4 bg-[#12141A] rounded-2xl border border-[#2A2D35] shadow-xl p-6 flex flex-col justify-between" id="simulator-controller-card">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-bold text-white text-base" id="simulation-header">Thesis Defense Simulator</h3>
            <span className="text-[10px] bg-[#1E2129] text-[#848E9C] font-mono px-2 py-0.5 rounded border border-[#2A2D35]" id="sim-live-tag">
              Sim Block
            </span>
          </div>
          <p className="text-xs text-[#848E9C] mt-1 font-sans leading-relaxed mb-4 text-justify" id="sim-instructions">
            Adjust prices directly inside the simulator to demonstrate how the custom analysis engine recalculates Moving Averages (MA) and RSI boundaries to output proper BUY, SELL, or HOLD transitions.
          </p>

          <div className="space-y-2.5" id="sim-trigger-buttons">
            <button
              onClick={() => onSimulateTick('up', 'large')}
              disabled={isSimulating}
              className="w-full flex items-center justify-between p-3 border border-[#0ECB81]/25 bg-[#0ECB81]/5 hover:bg-[#0ECB81]/15 text-[#0ECB81] font-semibold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
              id="simulate-jump-up-btn"
            >
              <span className="flex items-center space-x-2">
                <ArrowUpRight className="w-4 h-4" />
                <span>Force Gold Surge (Long Buy-Side)</span>
              </span>
              <span className="font-mono text-[11px] font-bold">+$18.50</span>
            </button>

            <button
              onClick={() => onSimulateTick('down', 'large')}
              disabled={isSimulating}
              className="w-full flex items-center justify-between p-3 border border-[#F6465D]/25 bg-[#F6465D]/5 hover:bg-[#F6465D]/15 text-[#F6465D] font-semibold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
              id="simulate-dump-down-btn"
            >
              <span className="flex items-center space-x-2">
                <ArrowDownRight className="w-4 h-4" />
                <span>Force Gold Dump (Short Sell-Side)</span>
              </span>
              <span className="font-mono text-[11px] font-bold">-$18.50</span>
            </button>

            <div className="grid grid-cols-2 gap-2" id="sim-fine-tuner-buttons">
              <button
                onClick={() => onSimulateTick('up', 'small')}
                disabled={isSimulating}
                className="flex items-center justify-center p-3 border border-[#2A2D35] bg-[#1E2129]/60 hover:bg-[#1E2129] text-[#E0E0E0] text-xs rounded-xl transition cursor-pointer disabled:opacity-50"
                id="fine-tune-up-btn"
              >
                <TrendingUp className="w-3.5 h-3.5 mr-1 text-[#0ECB81]" />
                <span>Nudge UP (+$4)</span>
              </button>
              <button
                onClick={() => onSimulateTick('down', 'small')}
                disabled={isSimulating}
                className="flex items-center justify-center p-3 border border-[#2A2D35] bg-[#1E2129]/60 hover:bg-[#1E2129] text-[#E0E0E0] text-xs rounded-xl transition cursor-pointer disabled:opacity-50"
                id="fine-tune-down-btn"
              >
                <TrendingDown className="w-3.5 h-3.5 mr-1 text-[#F6465D]" />
                <span>Nudge DOWN (-$4)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-[#2A2D35] flex items-center justify-between gap-3 text-xs" id="sim-resets">
          <button
            onClick={() => onSimulateTick('random', 'small')}
            disabled={isSimulating}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 bg-[#1E2129] hover:bg-[#2A2D35] text-[#E0E0E0] font-medium rounded-lg transition"
            id="random-tick-btn"
          >
            <GitCommit className="w-3.5 h-3.5 text-[#F0B90B]" />
            <span>Random Tick</span>
          </button>
          
          <button
            onClick={onResetData}
            disabled={isSimulating}
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 border border-[#2A2D35] hover:bg-[#1E2129] text-[#848E9C] hover:text-white rounded-lg transition"
            title="Reset to pre-loaded thesis candle dataset"
            id="reset-history-btn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

    </div>
  );
}
