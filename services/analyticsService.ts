
import { AnalyticsData } from '../types';
import { INITIAL_ANALYTICS } from '../constants';

const STORAGE_KEY = 'tarheel_analytics_v1';

class AnalyticsService {
  private data: AnalyticsData;

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    this.data = saved ? JSON.parse(saved) : { ...INITIAL_ANALYTICS };
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  getData(): AnalyticsData {
    return this.data;
  }

  trackQuery(query: string) {
    this.data.queries += 1;
    
    // Simple topic detection
    const lowerQuery = query.toLowerCase();
    const topics = [
      { key: 'comp', label: 'COMP Advice' },
      { key: 'hous', label: 'Housing' },
      { key: 'career', label: 'Career' },
      { key: 'food', label: 'Dining' },
      { key: 'studi', label: 'Study Abroad' }
    ];

    topics.forEach(t => {
      if (lowerQuery.includes(t.key)) {
        const existing = this.data.commonTopics.find(item => item.topic === t.label);
        if (existing) {
          existing.count += 1;
        } else {
          this.data.commonTopics.push({ topic: t.label, count: 1 });
        }
      }
    });

    // Update daily volume (find today)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = days[new Date().getDay()];
    const volumeItem = this.data.dailyVolume.find(v => v.date === today);
    if (volumeItem) {
      volumeItem.count += 1;
    }

    this.save();
  }

  trackSuccess(isSuccess: boolean) {
    // Basic success rate calculation: (successful / total)
    // We'll simulate a slight decay or improvement
    const total = this.data.queries;
    if (isSuccess) {
      this.data.successRate = Math.min(100, Number((this.data.successRate + 0.1).toFixed(1)));
    } else {
      this.data.successRate = Math.max(0, Number((this.data.successRate - 0.5).toFixed(1)));
    }
    this.save();
  }

  reset() {
    this.data = { ...INITIAL_ANALYTICS };
    this.save();
    window.location.reload();
  }
}

export const analytics = new AnalyticsService();
