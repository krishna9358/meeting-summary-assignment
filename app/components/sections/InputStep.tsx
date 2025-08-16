import { RefObject } from 'react';
import { LoadingSpinner } from '../icons';

interface InputStepProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  transcriptText: string;
  setTranscriptText: (text: string) => void;
  loading: boolean;
  fileRef: RefObject<HTMLInputElement | null>;
  onFileChange: (e: any) => void;
  onGenerateSummary: () => void;
  onReset: () => void;
}

export const InputStep = ({
  prompt,
  setPrompt,
  transcriptText,
  setTranscriptText,
  loading,
  fileRef,
  onFileChange,
  onGenerateSummary,
  onReset
}: InputStepProps) => {
  return (
    <div className="space-y-6 animate-slide-in">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload or Paste Transcript</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* File Upload */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-all duration-300 hover:bg-blue-50">
            <input 
              ref={fileRef} 
              type="file" 
              accept=".txt,text/plain" 
              onChange={onFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-all file:duration-200"
            />
          </div>
        </div>

        {/* Custom Instructions */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 focus:scale-[1.02]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="How to format the summary..."
          />
        </div>
      </div>

      {/* Text Area */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Or paste transcript</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 focus:scale-[1.01]"
          rows={8}
          value={transcriptText}
          onChange={(e) => setTranscriptText(e.target.value)}
          placeholder="Paste your meeting transcript here..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <button
          onClick={onGenerateSummary}
          disabled={loading || !transcriptText.trim()}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner className="-ml-1 mr-3 h-5 w-5 text-white" />
              Generating...
            </span>
          ) : (
            "Generate Summary"
          )}
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
