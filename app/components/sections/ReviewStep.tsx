interface ReviewStepProps {
  summary: string;
  setSummary: (summary: string) => void;
  loading: boolean;
  onContinueToShare: () => void;
  onBackToInput: () => void;
  onRegenerate: () => void;
}

export const ReviewStep = ({
  summary,
  setSummary,
  loading,
  onContinueToShare,
  onBackToInput,
  onRegenerate
}: ReviewStepProps) => {
  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between animate-fade-in-up">
        <h2 className="text-xl font-semibold text-gray-800">Review & Edit Summary</h2>
        <button
          onClick={onContinueToShare}
          disabled={!summary.trim()}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-lg"
        >
          Continue to Share
        </button>
      </div>
      
      <textarea
        className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all duration-200 focus:scale-[1.01] animate-fade-in-up"
        style={{ animationDelay: '0.1s' }}
        rows={12}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Your AI-generated summary will appear here..."
      />

      <div className="flex gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <button
          onClick={onBackToInput}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          Back to Input
        </button>
        <button
          onClick={onRegenerate}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-lg"
        >
          Regenerate
        </button>
      </div>
    </div>
  );
};
