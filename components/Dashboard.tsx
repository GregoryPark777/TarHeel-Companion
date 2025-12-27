
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import { INITIAL_ANALYTICS } from '../constants';

const Dashboard: React.FC = () => {
  const data = INITIAL_ANALYTICS;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Queries</span>
          <span className="text-4xl font-header font-black text-carolina">{data.queries}</span>
          <span className="text-green-500 text-xs font-semibold mt-2">↑ 12% from last week</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Success Rate</span>
          <span className="text-4xl font-header font-black text-navy">{data.successRate}%</span>
          <span className="text-gray-400 text-xs font-semibold mt-2">Based on feedback loops</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Active Users</span>
          <span className="text-4xl font-header font-black text-carolina">428</span>
          <span className="text-blue-500 text-xs font-semibold mt-2">UNC Student Population</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        {/* Daily Volume */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-navy mb-6 uppercase tracking-wider">Weekly Query Volume</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={data.dailyVolume}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="count" stroke="#7BAFD4" strokeWidth={3} dot={{ r: 4, fill: '#7BAFD4' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Common Topics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-navy mb-6 uppercase tracking-wider">Common User Queries</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data.commonTopics} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="topic" type="category" width={100} tick={{fontSize: 11}} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" fill="#13294B" radius={[0, 4, 4, 0]} barSize={20}>
                {data.commonTopics.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#7BAFD4' : '#13294B'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-navy p-8 rounded-xl text-white">
        <h3 className="text-xl font-header font-bold mb-4">Product Roadmap Insight</h3>
        <p className="text-carolina font-medium mb-4">Key Finding: Students are highly concerned about COMP 210 enrollment and study abroad prerequisites.</p>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white/10 px-4 py-2 rounded-lg text-sm border border-white/20">
            <strong>Next Feature:</strong> Interactive Course Map
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-lg text-sm border border-white/20">
            <strong>Optimization:</strong> Zero-latency Streaming
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-lg text-sm border border-white/20">
            <strong>Experiment:</strong> Suggested Freshman FAQs
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
