import React, { useEffect, useState, useMemo } from 'react';
import { getScoreLevels } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const subjectMap: Record<string, string> = {
  math: 'Math',
  literature: 'Literature',
  foreignLanguage: 'Foreign Lang',
  physics: 'Physics',
  chemistry: 'Chemistry',
  biology: 'Biology',
  history: 'History',
  geography: 'Geography',
  civicEducation: 'Civic Edu',
};

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getScoreLevels();
        setData(result);
      } catch (err) {
        setError('Failed to fetch score level statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = useMemo(() => {
    if (!data) return [];
    return Object.keys(data).map((subjectCode) => ({
      name: subjectMap[subjectCode] || subjectCode,
      'Level 1 (>= 8)': data[subjectCode].level1,
      'Level 2 (6 - < 8)': data[subjectCode].level2,
      'Level 3 (4 - < 6)': data[subjectCode].level3,
      'Level 4 (< 4)': data[subjectCode].level4,
    }));
  }, [data]);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-gray-500">Loading statistics...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-heading font-semibold text-gray-900">Score Levels Report</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 14 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 14 }} />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Level 1 (>= 8)" fill="#aa3bff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Level 2 (6 - < 8)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Level 3 (4 - < 6)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Level 4 (< 4)" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
