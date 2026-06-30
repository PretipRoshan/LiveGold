import React from 'react';

interface TradingViewWidgetProps {
  theme?: 'light' | 'dark';
}

export default function TradingViewWidget({ theme = 'light' }: TradingViewWidgetProps) {
  return (
    <div className="w-full bg-[#12141A] rounded-2xl border border-[#2A2D35] shadow-2xl overflow-hidden p-6 animate-fade-in" id="tradingview-widget-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#0ECB81] animate-pulse" id="live-indicator-bullet" />
          <h3 className="font-sans font-bold text-white text-base" id="live-feed-title">TradingView Global Live Feed (XAU/USD)</h3>
        </div>
        <span className="font-mono text-xs text-[#848E9C] bg-[#1E2129] border border-[#2A2D35] px-2.5 py-1 rounded" id="exchange-tag">OANDA Broker</span>
      </div>
      <div className="relative w-full h-[500px]" id="iframe-container">
        <iframe
          id="tradingview-live-iframe"
          title="XAUUSD Real-Time Chart"
          src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=OANDA:XAUUSD&interval=D&hidesidetoolbar=1&symbolediting=1&saveimage=1&toolbarbg=1E2129&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en`}
          className="absolute inset-0 w-full h-full border-0 rounded-lg shadow-2xl"
          referrerPolicy="no-referrer"
          allowFullScreen
        />
      </div>
      <div className="mt-3.5 text-center text-xs text-[#848E9C] font-sans" id="widget-guide">
        *Scroll, pan, zoom, or stretch candles directly on the live TradingView frame to survey historic supports.
      </div>
    </div>
  );
}
