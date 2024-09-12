'use client';

import DiffViewer from '@/components/DiffViewer';
import { useEffect, useState } from 'react';
import { incrementVisits } from '@/lib/incrementVisits';

export default function Diff() {
  const [text1, setText1] = useState<string>('');
  const [text2, setText2] = useState<string>('');
  const [diffType, setDiffType] = useState<'words' | 'lines'>('words');

  useEffect(() => {
    incrementVisits('/diff')
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 rounded-lg shadow-md mt-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Document Difference Checker
      </h1>
      <div className="mb-4">
        <label htmlFor="diff-type" className="block text-lg font-medium text-gray-700 mb-2">
          Comparison Type:
        </label>
        <select
          id="diff-type"
          value={diffType}
          onChange={(e): void => setDiffType(e.target.value as 'words' | 'lines')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white shadow-sm"
        >
          <option value="words">Word by Word</option>
          <option value="lines">Line by Line</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <textarea
          value={text1}
          onChange={(e): void => setText1(e.target.value)}
          placeholder="Enter first document"
          aria-label="First document"
          className="w-full h-48 p-4 border border-gray-300 rounded-md resize-none focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
        />
        <textarea
          value={text2}
          onChange={(e): void => setText2(e.target.value)}
          placeholder="Enter second document"
          aria-label="Second document"
          className="w-full h-48 p-4 border border-gray-300 rounded-md resize-none focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
        />
      </div>
      <DiffViewer text1={text1} text2={text2} diffType={diffType} />
    </div>
  );
}