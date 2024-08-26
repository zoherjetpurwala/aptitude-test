'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch('/api/results', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setResults(data);
    };

    fetchResults();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="mb-6 text-3xl font-bold text-center">Your Exam Results</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((result) => (
          <div key={result.id} className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold">{result.exam.title}</h2>
            <p className="mb-4 text-gray-600">{result.exam.description}</p>
            <p className="mb-2 text-gray-800">Duration: {result.exam.duration} mins</p>
            <p className="mb-4 text-gray-800">Score: {result.result?.score || 'Not graded'}</p>
            <button
              onClick={() => router.push(`/dashboard/results/${result.id}`)}
              className="w-full p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              View Detailed Result
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
