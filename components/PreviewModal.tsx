import React from 'react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, html }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 h-3/4 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Preview</h2>
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PreviewModal;