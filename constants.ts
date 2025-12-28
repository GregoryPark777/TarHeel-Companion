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
  queries: 4829,
  avgSatisfaction: 4.8,
  p90Latency: "1.2s",
  contextUsageRate: 34,
  retentionRate: 68, // % of users returning within 7 days
  intentDistribution: [
    { name: 'Course Planning', value: 45 },
    { name: 'Career/Internships', value: 25 },
    { name: 'Campus Life', value: 20 },
    { name: 'Housing/Dining', value: 10 }
  ],
  dailyVolume: [
    { date: 'Oct 20', count: 120 },
    { date: 'Oct 21', count: 450 },
    { date: 'Oct 22', count: 890 },
    { date: 'Oct 23', count: 540 },
    { date: 'Oct 24', count: 310 },
    { date: 'Oct 25', count: 200 },
    { date: 'Oct 26', count: 150 }
  ],
  topCourses: [
    { course: 'COMP 210', interest: 88 },
    { course: 'STOR 435', interest: 65 },
    { course: 'ECON 410', interest: 54 },
    { course: 'LFIT', interest: 42 },
    { course: 'COMP 411', interest: 38 }
  ]
};