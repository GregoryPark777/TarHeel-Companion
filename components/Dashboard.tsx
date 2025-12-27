
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell
} from 'recharts';
import { analytics } from '../services/analyticsService';

const Dashboard: React.FC = () => {
  const [data, setData] = useState(analytics.getData());

  useEffect(() => {
    // Refresh data periodically or on mount
    setData(analytics.getData());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Data Stream Active</span>
        </div>
        <button 
          onClick={() => analytics.reset()}
          className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase transition-colors"
        >
          Reset Analytics
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:border-carolina transition-all">
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Student Queries</span>
          <span className="text-4xl font-header font-black text-navy group-hover:text-carolina transition-colors">{data.queries}</span>
          <span className="text-green-500 text-[10px] font-bold mt-2 uppercase">↑ Real-time tracking</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:border-navy transition-all">
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">AI Success Rate</span>
          <span className="text-4xl font-header font-black text-navy">{data.successRate}%</span>
          <span className="text-slate-400 text-[10px] font-bold mt-2 uppercase">Model optimization target: 98%</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Simulated Reach</span>
          <span className="text-4xl font-header font-black text-carolina">30K+</span>
          <span className="text-carolina text-[10px] font-bold mt-2 uppercase">UNC Student Body</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
        {/* Daily Volume */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-[10px] font-black text-navy mb-6 uppercase tracking-widest border-b pb-2 border-slate-50">Weekly Query Load</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyVolume}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="count" stroke="#7BAFD4" strokeWidth={4} dot={{ r: 4, fill: '#7BAFD4', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Common Topics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-[10px] font-black text-navy mb-6 uppercase tracking-widest border-b pb-2 border-slate-50">Dynamic Topic Discovery</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.commonTopics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="topic" type="category" width={100} tick={{fontSize: 9, fontWeight: 700}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#13294B" radius={[0, 4, 4, 0]} barSize={24}>
                  {data.commonTopics.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#7BAFD4' : '#13294B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[#13294B] p-8 rounded-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-32 h-32 text-carolina" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.001 8.001 0 0117.748 8H12V2.252z" />
          </svg>
        </div>
        <h3 className="text-xl font-header font-black uppercase italic tracking-tighter mb-4">Strategic Product Insight</h3>
        <p className="text-carolina font-bold text-sm mb-6 leading-relaxed">
          Based on the current live data stream, students are prioritizing "{data.commonTopics[0]?.topic || 'general advice'}" significantly. 
          The {data.successRate}% success rate suggests the RAG layer is performing above baseline.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20">
            Priority: COMP 210 RAG Optimization
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20">
            Status: Live Performance Monitoring
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
