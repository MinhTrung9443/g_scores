import React, { useState } from 'react';
import { searchStudent } from '../services/api';

const subjectMap: Record<string, string> = {
  math: 'Math',
  literature: 'Literature',
  foreignLanguage: 'Foreign Language',
  physics: 'Physics',
  chemistry: 'Chemistry',
  biology: 'Biology',
  history: 'History',
  geography: 'Geography',
  civicEducation: 'Civic Education',
};

const SearchPage: React.FC = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{8}$/.test(registrationNumber)) {
      setError('Registration number must be exactly 8 digits.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await searchStudent(registrationNumber);
      setResult(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Student not found.');
      } else {
        setError(err.response?.data?.message || 'An error occurred while searching.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in w-full max-w-5xl">
      {/* User Registration Card */}
      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 font-sans">User Registration</h2>
        <form onSubmit={handleSearch} className="space-y-2">
          <label className="block text-sm text-gray-700">Registration Number:</label>
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="Enter registration number"
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all text-gray-900 placeholder-gray-400 text-sm"
              maxLength={8}
            />
            <button
              type="submit"
              disabled={loading || !registrationNumber}
              className="px-6 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : 'Submit'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md text-sm font-medium max-w-md">
            {error}
          </div>
        )}
      </div>

      {/* Detailed Scores Card */}
      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 font-sans">Detailed Scores</h2>
        
        {!result || !result.scores ? (
          <p className="text-sm text-gray-700">Detailed view of search scores here!</p>
        ) : (
          <div className="animate-slide-up mt-4">
            <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
              <span className="text-gray-500 font-normal">Results for:</span>
              <span className="text-black">{result.registrationNumber}</span>
            </h3>
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    {Object.keys(result.scores).map((key) => (
                      <th key={key} className="px-4 py-3 border border-gray-200 text-xs font-semibold text-gray-700 text-center uppercase tracking-wider whitespace-nowrap">
                        {subjectMap[key] || key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {Object.values(result.scores).map((value: any, index) => (
                      <td key={index} className={`px-4 py-3 border border-gray-200 text-center text-lg font-bold ${value !== null ? 'text-gray-900' : 'text-gray-400'}`}>
                        {value !== null ? String(value) : '-'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
