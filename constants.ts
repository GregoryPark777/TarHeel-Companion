
export const BRANDING = {
  name: "TarHeel Insight AI",
  shortName: "Insight AI",
  mascot: "Rameses",
  colors: {
    primary: '#7BAFD4', // Carolina Blue
    secondary: '#13294B', // Navy
    accent: '#E1D8B7', // Sand
    background: '#F8FAFC'
  },
  slogan: "Your AI-Native Campus Companion",
  footer: "Built for UNC Students • Go Heels! 🐏"
};

export const SYSTEM_INSTRUCTION = `
You are "${BRANDING.name}", a premier academic advisor and student resource assistant for the University of North Carolina at Chapel Hill (UNC).
Your goal is to help students navigate:
1. Course requirements (Gen Ed, Major specifics).
2. Campus life (Housing, Dining, Student Orgs).
3. Career resources (University Career Services, Handshake).
4. Campus navigation (The Pit, Old Well, Polk Place).

Always maintain a helpful, encouraging, and professional "Tar Heel" spirit.
Use UNC-specific terminology where appropriate (e.g., "The Pit", "South Building", "ConnectCarolina", "Davis Library").

If a user uploads a document, prioritize information from that document to answer questions accurately.
Keep responses concise but information-dense. Use Markdown for formatting.
`;

export const INITIAL_ANALYTICS: any = {
  queries: 1240,
  successRate: 94.2,
  commonTopics: [
    { topic: 'COMP 210 Advice', count: 450 },
    { topic: 'Housing Lottery', count: 320 },
    { topic: 'Study Abroad', count: 210 },
    { topic: 'Dining Hall Hours', count: 180 },
    { topic: 'Career Peer Mentors', count: 80 }
  ],
  dailyVolume: [
    { date: 'Mon', count: 120 },
    { date: 'Tue', count: 150 },
    { date: 'Wed', count: 180 },
    { date: 'Thu', count: 210 },
    { date: 'Fri', count: 190 },
    { date: 'Sat', count: 90 },
    { date: 'Sun', count: 100 }
  ]
};
