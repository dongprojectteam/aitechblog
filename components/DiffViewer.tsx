import React from 'react';
import { diffWords, diffLines, Change } from 'diff';

interface DiffViewerProps {
  text1: string;
  text2: string;
  diffType: 'words' | 'lines';
}

export default function DiffViewer({ text1, text2, diffType }: DiffViewerProps): JSX.Element {
  const diff: Change[] = diffType === 'words' 
    ? diffWords(text1, text2) 
    : diffLines(text1, text2);

  return (
    <div className="border border-gray-300 rounded-md p-4 font-mono text-sm whitespace-pre-wrap break-words max-h-96 overflow-y-auto bg-white shadow-md">
      {diff.map((part: Change, index: number) => (
        <span
          key={index}
          className={`
            ${part.added ? 'bg-green-100 text-green-800 underline' : ''}
            ${part.removed ? 'bg-red-100 text-red-800 line-through' : ''}
            ${!part.added && !part.removed ? 'text-gray-800' : ''}
          `}
        >
          {part.value}
        </span>
      ))}
    </div>
  );
}