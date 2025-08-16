import { ErrorIcon } from '../icons';

interface ShareStepProps {
  summary: string;
  emailTo: string;
  setEmailTo: (email: string) => void;
  emailError: string;
  setEmailError: (error: string) => void;
  onBackToReview: () => void;
  onSendEmail: () => void;
  onReset: () => void;
}

export const ShareStep = ({
  summary,
  emailTo,
  setEmailTo,
  emailError,
  setEmailError,
  onBackToReview,
  onSendEmail,
  onReset
}: ShareStepProps) => {
  return (
    <div className="space-y-6 animate-slide-in">
      <h2 className="text-xl font-semibold text-gray-800 animate-fade-in-up">Share Summary</h2>
      
      <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <p className="text-sm text-gray-600 mb-2">Summary Preview:</p>
        <div className="text-sm whitespace-pre-wrap">{summary}</div>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Recipients</label>
        <input
          type="text"
          className={`w-full border rounded-lg p-3 transition-all duration-200 focus:scale-[1.02] ${
            emailError 
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
              : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
          }`}
          placeholder="Enter emails (comma separated)"
          value={emailTo}
          onChange={(e) => {
            setEmailTo(e.target.value);
            if (emailError) setEmailError("");
          }}
        />
        {emailError && (
          <div className="flex items-center text-red-600 text-sm mt-2 animate-shake">
            <ErrorIcon className="w-4 h-4 mr-2" />
            {emailError}
          </div>
        )}
      </div>

      <div className="flex gap-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <button
          onClick={onBackToReview}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          Back to Review
        </button>
        <button
          onClick={onSendEmail}
          disabled={!summary.trim() || !emailTo.trim()}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-lg"
        >
          Send Email
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};
