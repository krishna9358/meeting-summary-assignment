"use client";
import { useState, useRef } from "react";
import { summarizeTranscript } from "./functions/summarizeFunction";
import { sendEmail } from "./functions/sendEmailFunction";
import { LoadingSpinner, ErrorIcon } from "./components/icons";
import { ToastProvider, useToast } from "./components/Toast";

function HomeContent() {
  const [prompt, setPrompt] = useState("Summarize in bullet points for executives.");
  const [transcriptText, setTranscriptText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailError, setEmailError] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  // Email validation function
  const validateEmails = (emailString: string): { isValid: boolean; message: string } => {
    if (!emailString.trim()) {
      return { isValid: false, message: "Please enter at least one email address" };
    }

    const emails = emailString.split(',').map(email => email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    for (const email of emails) {
      if (!emailRegex.test(email)) {
        return { isValid: false, message: `Invalid email format: ${email}` };
      }
    }
    
    return { isValid: true, message: "" };
  };

  // Smooth step transition
  const changeStep = (newStep: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveStep(newStep);
      setIsTransitioning(false);
    }, 150);
  };

  async function handleFile(e:any) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setTranscriptText(text);
    showToast("File uploaded successfully", "success");
  }

  async function generateSummary() {
    if (!transcriptText.trim()) {
      showToast("Please upload or paste a transcript", "warning");
      return;
    }
    setLoading(true);
    try {
      const result = await summarizeTranscript(transcriptText, prompt);
      
      if (result.error) {
        showToast(result.error, "error");
      } else {
        setSummary(result.summary || "");
        showToast("Summary generated successfully!", "success");
        setTimeout(() => changeStep(2), 500); // Delay for smooth transition
      }
    } catch (e) {
      console.error(e);
      showToast("Error generating summary", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendEmail() {
    if (!summary.trim()) {
      showToast("No summary to send", "warning");
      return;
    }
    const emailValidation = validateEmails(emailTo);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.message);
      return;
    }
    setEmailError("");
    
    try {
      const result = await sendEmail(emailTo, "Meeting Summary", summary);
      
      if (result.error) {
        showToast(result.error, "error");
      } else {
        showToast("Email sent successfully! ", "success");
      }
    } catch (e) {
      console.error(e);
      showToast("Error sending email", "error");
    }
  }

  const resetAll = () => {
    setTranscriptText(""); 
    setSummary(""); 
    setPrompt("Summarize in bullet points for executives."); 
    setEmailTo(""); 
    setEmailError("");
    changeStep(1);
    if(fileRef.current) fileRef.current.value="";
    showToast("Form reset successfully", "info");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Meeting Summarizer
          </h1>
          <p className="text-gray-600">
            Transform meeting transcripts into actionable insights
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                    activeStep >= step
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  onClick={() => changeStep(step)}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-0.5 transition-all duration-500 ${activeStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Labels */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-16 text-sm text-gray-600">
            <span className={`transition-all duration-300 ${activeStep === 1 ? 'text-blue-600 font-semibold scale-105' : ''}`}>Input</span>
            <span className={`transition-all duration-300 ${activeStep === 2 ? 'text-blue-600 font-semibold scale-105' : ''}`}>Review</span>
            <span className={`transition-all duration-300 ${activeStep === 3 ? 'text-blue-600 font-semibold scale-105' : ''}`}>Share</span>
          </div>
        </div>

        {/* Main Content Card */}
        <div className={`bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
          {/* Step 1: Input */}
          {activeStep === 1 && (
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
                      onChange={handleFile}
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
                  onClick={generateSummary}
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
                  onClick={resetAll}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review Summary */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-slide-in">
              <div className="flex items-center justify-between animate-fade-in-up">
                <h2 className="text-xl font-semibold text-gray-800">Review & Edit Summary</h2>
                <button
                  onClick={() => changeStep(3)}
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
                  onClick={() => changeStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Back to Input
                </button>
                <button
                  onClick={generateSummary}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-lg"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Share */}
          {activeStep === 3 && (
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
                  onClick={() => changeStep(2)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Back to Review
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={!summary.trim() || !emailTo.trim()}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-lg"
                >
                  Send Email
                </button>
                <button
                  onClick={resetAll}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
          animation-fill-mode: both;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </main>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <HomeContent />
    </ToastProvider>
  );
}