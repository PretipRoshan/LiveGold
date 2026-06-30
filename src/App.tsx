import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Terminal, 
  Sparkles, 
  Mail, 
  LineChart, 
  RotateCcw,
} from 'lucide-react';
import { AnalysisResponse, AlertLog } from './types';
import LiveSignals from './components/LiveSignals';
import CustomCharts from './components/CustomCharts';
import AICommentary from './components/AICommentary';
import AlertSim from './components/AlertSim';
import TradingViewWidget from './components/TradingViewWidget';

export default function App() {
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<'terminal' | 'tradingview' | 'ai' | 'alerts'>('terminal');

  // Dynamic API state definitions
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([]);
  const [commentary, setCommentary] = useState<string>('');

  // Loading indicators
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  // 1. Initial Data Load fetching from local Express endpoints
  const fetchGoldData = async () => {
    try {
      const res = await fetch('/api/gold-data');
      if (!res.ok) throw new Error('Failed to retrieve analyzer indicators feed.');
      const data: AnalysisResponse = await res.ok ? await res.json() : null;
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAlertLogs = async () => {
    try {
      const res = await fetch('/api/alert-logs');
      if (res.ok) {
        const logs = await res.json();
        setAlertLogs(logs);
      }
    } catch (err) {
      console.error('Alert logs fetch error: ', err);
    }
  };

  // Check if API commentary key is present
  const fetchCommentary = async (refresh: boolean = false) => {
    if (refresh) setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/market-commentary');
      if (res.ok) {
        const body = await res.json();
        setCommentary(body.commentary || '');
        if (body.isMock) {
          setHasApiKey(false);
        } else {
          setHasApiKey(true);
        }
      }
    } catch (err) {
      console.error(err);
      setCommentary('An error occurred while calling the server-side analysis engine endpoint.');
    } finally {
      if (refresh) setIsGeneratingAI(false);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true);
      await Promise.all([fetchGoldData(), fetchAlertLogs(), fetchCommentary(false)]);
      setIsLoading(false);
    };
    bootstrap();
  }, []);

  // 2. Interactive simulator dispatch triggers
  const handleSimulateTick = async (direction: 'up' | 'down' | 'random', swing: 'small' | 'large') => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/simulate-tick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction, swing })
      });
      if (res.ok) {
        const updated: AnalysisResponse = await res.json();
        setAnalysis(updated);

        // Dynamic notification broadcast on trend shifts!
        if (updated.signal !== analysis?.signal) {
          await handleDispatchAlert(
            'examiner-panel@southern.edu.my',
            `[SYSTEM CROSSOVER] Golden Signal just shifted to **${updated.signal}** at $${updated.currentPrice}/oz with standard indicators complying.`
          );
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetData = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/reset-data', { method: 'POST' });
      if (res.ok) {
        const body = await res.json();
        setAnalysis(body.analysis);
        await fetchAlertLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleDispatchAlert = async (target: string, message: string) => {
    try {
      const res = await fetch('/api/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, message })
      });
      if (res.ok) {
        const body = await res.json();
        setAlertLogs(body.allLogs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerAI = async () => {
    await fetchCommentary(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0B0D]" id="loading-splash">
        <div className="text-center space-y-4 p-8 bg-[#12141A] rounded-2xl border border-[#2A2D35] max-w-sm mx-auto shadow-xl" id="loading-card">
          <RotateCcw className="w-10 h-10 text-[#F0B90B] animate-spin mx-auto animate-pulse" />
          <div className="space-y-2">
            <h3 className="font-sans font-bold text-white text-base uppercase tracking-wider">Initializing DSS Terminal Node</h3>
            <p className="font-sans text-xs text-[#848E9C]">Loading historical gold databases & math evaluation layers</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#E0E0E0] font-sans flex flex-col justify-between" id="app-wrapper">
      {/* 1. HEADER */}
      <header className="sticky top-0 z-40 bg-[#12141A]/95 backdrop-blur-md border-b border-[#2A2D35] py-4 px-6 md:px-12" id="app-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4" id="header-container">
          <div className="space-y-2" id="brand-group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-[#F0B90B] to-[#FFE082] rounded-md shadow-[0_0_15px_rgba(240,185,11,0.3)] flex items-center justify-center text-[#0A0B0D] font-bold italic text-xl shrink-0">G</div>
              <div className="flex flex-col leading-tight">
                <h1 className="font-sans font-bold tracking-tight text-white text-base md:text-lg uppercase" id="system-main-heading">
                  Gold Analytica <span className="text-[#F0B90B] font-light">DSS</span>
                </h1>
                <span className="text-[10px] text-[#848E9C] uppercase tracking-widest font-semibold italic">CS Diploma Project</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] font-sans" id="academic-affiliation-bar">
              <span className="bg-[#2B2816] text-[#F0B90B] px-2 py-0.5 rounded font-semibold border border-[#F0B90B]/30 flex items-center tracking-wide">
                <Building2 className="w-3 h-3 mr-1" />
                Student Capstone Submission
              </span>
              <span className="text-[#474D57] font-medium">|</span>
              <span className="text-[#848E9C] font-semibold">Real-Time Decision Support System</span>
            </div>
          </div>

          {analysis && (
            <div className="flex items-center space-x-4 bg-[#1E2129] border border-[#2A2D35] rounded-xl px-5 py-2.5 shadow-inner" id="live-feed-ticker">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0ECB81] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0ECB81] shadow-[0_0_6px_#0ECB81]"></span>
                </span>
                <span className="text-[10px] text-[#848E9C] font-mono tracking-wider font-semibold uppercase">API STREAM</span>
              </div>
              <div className="w-[1px] h-6 bg-[#2A2D35]" />
              <div className="font-sans select-none text-right" id="ticker-prices">
                <span className="text-[10px] text-[#848E9C] block font-bold leading-none uppercase tracking-tighter">XAU / USD</span>
                <span className="text-base font-black text-[#0ECB81] font-mono tracking-tight leading-none">${analysis.currentPrice.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 2. TABS */}
      <nav className="max-w-7xl w-full mx-auto px-6 md:px-12 mt-6" id="view-tabs-navigation">
        <div className="flex items-center overflow-x-auto space-x-1 border-b border-[#2A2D35] pb-px scrollbar-none" id="tabs-deck">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center space-x-2 py-2.5 px-4 shadow-sm rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
              activeTab === 'terminal'
                ? 'border-[#F0B90B] text-[#F0B90B] bg-[#12141A] border-t border-x border-[#2A2D35]'
                : 'border-transparent text-[#848E9C] hover:text-[#E0E0E0] hover:bg-[#12141A]/50'
            }`}
            id="tab-btn-terminal"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>DSS Terminal</span>
          </button>

          <button
            onClick={() => setActiveTab('tradingview')}
            className={`flex items-center space-x-2 py-2.5 px-4 shadow-sm rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
              activeTab === 'tradingview'
                ? 'border-[#F0B90B] text-[#F0B90B] bg-[#12141A] border-t border-x border-[#2A2D35]'
                : 'border-transparent text-[#848E9C] hover:text-[#E0E0E0] hover:bg-[#12141A]/50'
            }`}
            id="tab-btn-tv"
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>TradingView live</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center space-x-2 py-2.5 px-4 shadow-sm rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
              activeTab === 'ai'
                ? 'border-[#F0B90B] text-[#F0B90B] bg-[#12141A] border-t border-x border-[#2A2D35]'
                : 'border-transparent text-[#848E9C] hover:text-[#E0E0E0] hover:bg-[#12141A]/50'
            }`}
            id="tab-btn-ai"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#F0B90B]" />
            <span>AI Commentary Lounge</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center space-x-2 py-2.5 px-4 shadow-sm rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
              activeTab === 'alerts'
                ? 'border-[#F0B90B] text-[#F0B90B] bg-[#12141A] border-t border-x border-[#2A2D35]'
                : 'border-transparent text-[#848E9C] hover:text-[#E0E0E0] hover:bg-[#12141A]/50'
            }`}
            id="tab-btn-alerts"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Alert Simulator</span>
          </button>
        </div>
      </nav>

      {/* 3. CONTENT */}
      <main className="max-w-7xl w-full mx-auto px-6 md:px-12 py-6 flex-1" id="main-content-area">
        {activeTab === 'terminal' && analysis && (
          <div className="space-y-6 fade-in" id="dashboard-terminal-view">
            
            {/* MA20 & Indicator Overview */}
            <section
              className="bg-[#12141A] rounded-2xl border border-[#2A2D35] shadow-xl p-6 md:p-8 space-y-4 text-[#E0E0E0] font-sans max-w-7xl mx-auto"
              id="ma20-indicator-overview"
            >
              <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                <div>
                  <span className="text-[10px] bg-[#2B2816] text-[#F0B90B] px-2 py-0.5 rounded uppercase tracking-wider font-semibold font-mono border border-[#F0B90B]/20">
                    Indicator Engine Overview
                  </span>
                  <h2 className="text-xl font-extrabold text-white mt-2 font-sans" id="ma20-overview-title">
                    MA20 (20-day Simple Moving Average) + Signal Logic
                  </h2>
                  <p className="text-xs text-[#848E9C] mt-1">How the math engine evaluates trend alignment and momentum to trigger BUY / SELL / HOLD.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0ECB81] shadow-[0_0_18px_rgba(14,203,129,0.35)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F0B90B] shadow-[0_0_18px_rgba(240,185,11,0.35)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F6465D] shadow-[0_0_18px_rgba(246,70,93,0.35)]" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 space-y-3">
                  <h3 className="font-bold text-white text-sm flex items-center">
                    <span className="w-1.5 h-3.5 bg-[#F0B90B] rounded mr-2" />
                    What is MA20?
                  </h3>
                  <p className="text-xs leading-relaxed text-[#848E9C]">
                    MA20 is the <span className="text-[#E0E0E0] font-semibold">20-day Simple Moving Average</span>: it smooths the gold closing price by averaging the last 20 daily closes.
                    When price is above MA20, the recent window is typically behaving bullish; when price is below MA20, it typically behaves bearish.
                  </p>

                  <div className="p-4 bg-[#0F1115]/50 border border-[#2A2D35] rounded-xl space-y-2">
                    <p className="text-[11px] text-[#848E9C] font-bold uppercase tracking-wider">Live values</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <p className="text-[#848E9C]">Current Price</p>
                        <p className="text-white font-mono font-bold">${analysis.currentPrice.toFixed(2)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[#848E9C]">MA20</p>
                        <p className="text-white font-mono font-bold">
                          {analysis.indicators.ma20 === null ? 'Calculating...' : `$${analysis.indicators.ma20.toFixed(2)}`}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[#848E9C]">MA50</p>
                        <p className="text-white font-mono font-bold">
                          {analysis.indicators.ma50 === null ? 'Calculating...' : `$${analysis.indicators.ma50.toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-3">
                  <h3 className="font-bold text-white text-sm flex items-center">
                    <span className="w-1.5 h-3.5 bg-[#0ECB81] rounded mr-2" />
                    How BUY / SELL are triggered
                  </h3>
                  <p className="text-xs leading-relaxed text-[#848E9C]">
                    The engine combines: 
                    <span className="text-[#E0E0E0] font-semibold"> MA20</span>, 
                    <span className="text-[#E0E0E0] font-semibold"> MA50</span>, 
                    and RSI to filter out market noise and evaluate momentum.
                  </p>

                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#0ECB81] w-8">BUY</span>
                      <span className="text-[10px] text-[#848E9C]">Price &gt; MA20 AND Price &gt; MA50 (RSI 40-70)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#F6465D] w-8">SELL</span>
                      <span className="text-[10px] text-[#848E9C]">Price &lt; MA20 AND Price &lt; MA50 (RSI 30-60)</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Real-time Indicator signals evaluation & Simulations */}
            <LiveSignals 
              analysis={analysis}
              onSimulateTick={handleSimulateTick}
              onResetData={handleResetData}
              isSimulating={isSimulating}
            />
            {/* custom calculations chart */}
            <CustomCharts data={analysis.history} />
          </div>
        )}

        {/* TAB 2: ADVANCED TRADINGVIEW NATIVE CHARTS */}
        {activeTab === 'tradingview' && (
          <div className="fade-in" id="dashboard-tv-view">
            <TradingViewWidget theme="dark" />
          </div>
        )}

        {/* TAB 3: GEMINI AI COMMENTARY */}
        {activeTab === 'ai' && (
          <div className="fade-in" id="dashboard-ai-view">
            <AICommentary 
              commentary={commentary} 
              onRefreshCommentary={handleTriggerAI} 
              isGenerating={isGeneratingAI} 
              hasApiKey={hasApiKey} 
            />
          </div>
        )}
        {/* TAB 4: SIMULATED ALERTS DISPATCH LOGS */}
        {activeTab === 'alerts' && (
          <div className="fade-in" id="dashboard-alerts-view">
            <AlertSim 
            logs={alertLogs} 
            onDispatchAlert={handleDispatchAlert} 
            currentSignal={analysis?.signal || 'HOLD'} 
            currentPrice={analysis?.currentPrice || 0} 
          />
          </div>
        )}
      </main>
    </div>
  );
}