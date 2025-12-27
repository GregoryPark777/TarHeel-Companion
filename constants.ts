
export const UNC_COLORS = {
  carolinaBlue: '#7BAFD4',
  navy: '#13294B',
  white: '#FFFFFF',
  lightGray: '#F8F9FA'
};

export const SYSTEM_INSTRUCTION = `
You are "TarHeel Insight AI", a premier academic advisor and student resource assistant for the University of North Carolina at Chapel Hill (UNC).
Your goal is to help students navigate:
1. Course requirements (Gen Ed, Major specifics).
2. Campus life (Housing, Dining, Student Orgs).
3. Career resources (University Career Services, Handshake).
4. Campus navigation (The Pit, Old Well, Polk Place).

Always maintain a helpful, encouraging, and professional "Tar Heel" spirit.
Use UNC-specific terminology where appropriate (e.g., "The Pit", "South Building", "ConnectCarolina").

If a user uploads a document, prioritize information from that document to answer questions accurately.
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
