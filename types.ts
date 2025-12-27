
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AnalyticsData {
  queries: number;
  successRate: number;
  commonTopics: { topic: string; count: number }[];
  dailyVolume: { date: string; count: number }[];
}

export interface FileContext {
  name: string;
  content: string;
  type: string;
}
