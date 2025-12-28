import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie, Legend
} from 'recharts';
import { INITIAL_ANALYTICS } from '../constants';

const COLORS = ['#7BAFD4', '#13294B', '#94a3b8', '#cbd5e1'];

const Dashboard: React.FC = () => {
  const data = INITIAL_ANALYTICS;

  return (
    <div className="space-y-8 pb-10">
      {/* KPI Top Row: The "Health" of the Product */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Queries (MTD)</p>
          <p className="text-3xl font-header font-black text-navy">{data.queries.toLocaleString()}</p>
          <div className="mt-2 text-[10px] font-bold text-emerald-500 bg-emerald-50 inline-block px-2 py-0.5 rounded-full">
            +22% WOW
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">User CSAT</p>
          <p className="text-3xl font-header font-black text-carolina">{data.avgSatisfaction}/5.0</p>
          <div className="mt-2 text-[10px] font-bold text-slate-400 bg-slate-50 inline-block px-2 py-0.5 rounded-full">
            High Confidence
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">p90 Latency</p>
          <p className="text-3xl font-header font-black text-navy">{data.p90Latency}</p>
          <div className="mt-2 text-[10px] font-bold text-emerald-500 bg-emerald-50 inline-block px-2 py-0.5 rounded-full">
            Optimal
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">RAG Adoption</p>
          <p className="text-3xl font-header font-black text-carolina">{data.contextUsageRate}%</p>
          <div className="mt-2 text-[10px] font-bold text-amber-500 bg-amber-50 inline-block px-2 py-0.5 rounded-full">
            Target: 45%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Intent Distribution: What are they actually doing? */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-6">
            <h3 className="text-xs font-black text-navy uppercase tracking-[0.2em]">Query Intent Distribution</h3>
            <p className="text-slate-400 text-[11px] mt-1">Understanding student friction points</p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.intentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.intentDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Trend: Registration Window Spike */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-xs font-black text-navy uppercase tracking-[0.2em]">Engagement Velocity</h3>
              <p className="text-slate-400 text-[11px] mt-1 text-emerald-500 font-bold italic">Detecting: Registration Window Spike</p>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyVolume}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ stroke: '#7BAFD4', strokeWidth: 2 }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#7BAFD4" 
                  strokeWidth={4} 
                  dot={false}
                  activeDot={{ r: 6, fill: '#13294B' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Courses - Real Market Interest */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-black text-navy uppercase tracking-[0.2em] mb-6">Top Course Interest</h3>
          <div className="space-y-4">
            {data.topCourses.map((c: any) => (
              <div key={c.course} className="flex flex-col">
                <div className="flex justify-between text-[11px] font-bold mb-1">
                  <span>{c.course}</span>
                  <span className="text-carolina">{c.interest}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-carolina h-full" style={{ width: `${c.interest}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Roadmap */}
        <div className="lg:col-span-2 bg-navy p-8 rounded-2xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xs font-black text-carolina uppercase tracking-[0.4em] mb-4">Strategic Product Roadmap</h3>
            <p className="text-lg font-header font-bold mb-6">Based on high "Course Planning" intent (45%), we are prioritizing these Q4 initiatives:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] font-black text-carolina uppercase mb-1">Current Sprint</p>
                <p className="text-sm font-bold">ConnectCarolina API Bridge</p>
                <p className="text-[11px] text-white/50 mt-2">Will allow direct enrollment from chat interface.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Backlog</p>
                <p className="text-sm font-bold">Multimodal Syllabus Parsing</p>
                <p className="text-[11px] text-white/50 mt-2">Supporting OCR for image-based schedule uploads.</p>
              </div>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-carolina/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;