import React, { useEffect, useState } from 'react';
import { getTopGroupA } from '../services/api';

const TopGroupAPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTopGroupA();
        setData(result);
      } catch (err) {
        setError('Failed to fetch Top 10 Group A students.');
      } finally {
        setLoading(false);
      }
    };  
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-gray-500">Loading ranking...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-heading font-semibold text-gray-900">Top 10 Group A</h2>
        <p className="text-gray-500 mt-2">Highest scoring students in Math, Physics, and Chemistry combined.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Registration No.</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider text-right">Math</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider text-right">Physics</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider text-right">Chemistry</th>
                <th className="px-6 py-4 font-bold text-primary text-sm uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((student) => (
                <tr key={student.registrationNumber} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                      student.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      student.rank === 2 ? 'bg-gray-200 text-gray-700' :
                      student.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {student.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-gray-900">{student.registrationNumber}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{student.math?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{student.physics?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{student.chemistry?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-bold text-primary text-lg">{student.total?.toFixed(2)}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopGroupAPage;
