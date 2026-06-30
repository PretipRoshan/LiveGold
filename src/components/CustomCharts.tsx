import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { AnalysisResponse } from '../types';

interface CustomChartsProps {
  data: AnalysisResponse['history'];
}

export default function CustomCharts({ data }: CustomChartsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center bg-[#12141A] border border-[#2A2D35] rounded-xl" id="charts-loading">
        <p className="text-[#848E9C] font-sans" id="charts-loading-text">Gathering charting payload from backend analysis engine...</p>
      </div>
    );
  }

  // Slice history to last 50 trading days to make it highly legible, dense, and interactive
  const chartData = data.slice(-50);

  // Dynamic formatting for Y-Axis values
  const formatUSD = (val: number) => `$${Math.round(val)}`;

  return (
    <div className="space-y-6" id="custom-charts-module">
      {/* Chart 1: Price and Technical Overlays (MA20 / MA50) */}
      <div className="bg-[#12141A] rounded-2xl border border-[#2A2D35] shadow-xl p-5 animate-fade-in" id="price-chart-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-sans font-bold text-white text-base" id="price-chart-title">Custom Technical Analysis Chart (Daily USD/oz)</h3>
            <p className="text-xs text-[#848E9C] font-sans" id="price-chart-desc">Showing 50-day rolling history with moving average convergence lines</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-sans" id="price-chart-legend">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-[#2B2816] px-1 border border-[#F0B90B] rounded-sm" />
              <span className="text-[#848E9C] font-medium">Price ($)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3.5 h-1 bg-[#3b82f6] rounded" />
              <span className="text-[#848E9C] font-medium">MA20 (Short)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3.5 h-1 bg-[#f59e0b] rounded" />
              <span className="text-[#848E9C] font-medium">MA50 (Long)</span>
            </span>
          </div>
        </div>

        <div className="w-full h-80" id="price-composed-chart">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F0B90B" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#F0B90B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2D35" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#474D57" 
                fontSize={10}
                tickLine={false}
                dy={6}
                tick={{ fill: '#848E9C', fontFamily: 'monospace' }}
              />
              <YAxis 
                domain={['dataMin - 30', 'dataMax + 20']} 
                stroke="#474D57" 
                fontSize={10}
                tickFormatter={formatUSD}
                tickLine={false}
                dx={-6}
                tick={{ fill: '#848E9C', fontFamily: 'monospace' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E2129', 
                  borderRadius: '12px', 
                  border: '1px solid #2A2D35',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#ffffff', fontSize: '11px' }}
                itemStyle={{ fontSize: '12px', padding: '1px 0', color: '#E0E0E0' }}
              />
              <Area 
                type="monotone" 
                name="Gold Price"
                dataKey="close" 
                stroke="#F0B90B" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
              />
              <Line 
                type="monotone" 
                name="MA20"
                dataKey="ma20" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
              <Line 
                type="monotone" 
                name="MA50"
                dataKey="ma50" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: RSI 14-day momentum index */}
      <div className="bg-[#12141A] rounded-2xl border border-[#2A2D35] shadow-xl p-5 animate-fade-in" id="rsi-chart-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-sans font-bold text-white text-base" id="rsi-chart-title">RSI (Relative Strength Index 14-day)</h3>
            <p className="text-xs text-[#848E9C] font-sans" id="rsi-chart-desc">Relative momentum index calibrated to the rule engine boundaries</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-sans animate-pulse" id="rsi-boundary-guide">
            <span className="bg-[#2B2816] text-[#F0B90B] px-2.5 py-1 rounded border border-[#F0B90B]/30 font-mono font-bold tracking-tight text-[10px]">
              Buy Buffer (40 - 70)
            </span>
            <span className="bg-[#211617] text-[#F6465D] px-2.5 py-1 rounded border border-[#F6465D]/30 font-mono font-bold tracking-tight text-[10px]">
              Sell Buffer (30 - 60)
            </span>
          </div>
        </div>

        <div className="w-full h-44" id="rsi-composed-chart">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2D35" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#474D57" 
                fontSize={10}
                tickLine={false}
                dy={6}
                tick={{ fill: '#848E9C', fontFamily: 'monospace' }}
              />
              <YAxis 
                domain={[0, 100]} 
                ticks={[0, 30, 40, 60, 70, 100]}
                stroke="#474D57" 
                fontSize={10}
                tickLine={false}
                dx={-6}
                tick={{ fill: '#848E9C', fontFamily: 'monospace' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E2129', 
                  borderRadius: '12px', 
                  border: '1px solid #2A2D35',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#ffffff', fontSize: '11px' }}
                itemStyle={{ fontSize: '12px', padding: '1px 0', color: '#E0E0E0' }}
              />
              {/* Wilder Boundary Bands */}
              <ReferenceLine y={70} stroke="#F6465D" strokeDasharray="3 3" label={{ value: 'Overbought (70)', fill: '#F6465D', fontSize: 9, position: 'insideTopLeft' }} />
              <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Bearish Threshold (60)', fill: '#f59e0b', fontSize: 8, position: 'insideLeft' }} />
              <ReferenceLine y={40} stroke="#0ECB81" strokeDasharray="3 3" label={{ value: 'Bullish Threshold (40)', fill: '#0ECB81', fontSize: 8, position: 'insideLeft' }} />
              <ReferenceLine y={30} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: 'Oversold (30)', fill: '#3b82f6', fontSize: 9, position: 'insideBottomLeft' }} />
              
              <Line 
                type="monotone" 
                name="RSI14"
                dataKey="rsi14" 
                stroke="#ec4899" 
                strokeWidth={2}
                dot={{ r: 2, stroke: '#ec4899', strokeWidth: 1, fill: '#1E2129' }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
