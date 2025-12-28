export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AnalyticsData {
  queries: number;
  avgSatisfaction: number;
  p90Latency: string;
  contextUsageRate: number;
  intentDistribution: { name: string; value: number }[];
  dailyVolume: { date: string; count: number }[];
  topCourses: { course: string; interest: number }[];
}

export interface FileContext {
  name: string;
  content: string;
  type: string;
}