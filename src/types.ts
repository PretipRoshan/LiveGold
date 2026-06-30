/**
 * Shared Type Definitions for the Gold Decision Support System
 */

export interface GoldPriceCandle {
  date: string;       // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  currentPrice: number;
  ma20: number | null;
  ma50: number | null;
  rsi14: number | null;
}

export type SignalType = 'BUY' | 'SELL' | 'HOLD';

export interface SignalExplanation {
  condition: string;
  expression: string;
  summary: string;
}

export interface AnalysisResponse {
  currentPrice: number;
  indicators: TechnicalIndicators;
  signal: SignalType;
  explanation: string;
  ruleDetails: SignalExplanation;
  history: (GoldPriceCandle & { ma20: number | null; ma50: number | null; rsi14: number | null })[];
  lastUpdated: string;
}

export interface AlertLog {
  id: string;
  type: 'email';
  target: string;
  message: string;
  timestamp: string;
  status: 'Sent' | 'Failed';
}

