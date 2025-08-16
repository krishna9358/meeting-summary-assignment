"use client";
import { useState, useRef } from "react";
import { summarizeTranscript } from "./functions/summarizeFunction";
import { sendEmail } from "./functions/sendEmailFunction";

export default function Home() {
  const [prompt, setPrompt] = useState("Summarize in bullet points for executives.");
  const [transcriptText, setTranscriptText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailError, setEmailError] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);

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

  async function handleFile(e:any) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setTranscriptText(text);
  }

  async function generateSummary() {
    if (!transcriptText.trim()) {
      alert("Please upload or paste a transcript.");
      return;
    }
    setLoading(true);
    try {
      const result = await summarizeTranscript(transcriptText, prompt);
      
      if (result.error) {
        alert(result.error);
      } else {
        setSummary(result.summary || "");
        setActiveStep(2); // Auto-advance to step 2
      }
    } catch (e) {
      console.error(e);
      alert("Error generating summary");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendEmail() {
    if (!summary.trim()) {
      alert("No summary to send.");
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
        alert(result.error);
      } else {
        alert("Email sent ✔");
      }
    } catch (e) {
      console.error(e);
      alert("Error sending email");
    }
  }

  const resetAll = () => {
    setTranscriptText(""); 
    setSummary(""); 
    setPrompt("Summarize in bullet points for executives."); 
    setEmailTo(""); 
    setEmailError("");
    setActiveStep(1);
    if(fileRef.current) fileRef.current.value="";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer transition-all ${
                    activeStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                  onClick={() => setActiveStep(step)}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-0.5 ${activeStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Labels */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-16 text-sm text-gray-600">
            <span className={activeStep === 1 ? 'text-blue-600 font-semibold' : ''}>Input</span>
            <span className={activeStep === 2 ? 'text-blue-600 font-semibold' : ''}>Review</span>
            <span className={activeStep === 3 ? 'text-blue-600 font-semibold' : ''}>Share</span>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Input */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload or Paste Transcript</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input 
                      ref={fileRef} 
                      type="file" 
                      accept=".txt,text/plain" 
                      onChange={handleFile}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                {/* Custom Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="How to format the summary..."
                  />
                </div>
              </div>

              {/* Text Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Or paste transcript</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={8}
                  value={transcriptText}
                  onChange={(e) => setTranscriptText(e.target.value)}
                  placeholder="Paste your meeting transcript here..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={generateSummary}
                  disabled={loading || !transcriptText.trim()}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    "Generate Summary"
                  )}
                </button>
                <button
                  onClick={resetAll}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review Summary */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Review & Edit Summary</h2>
                <button
                  onClick={() => setActiveStep(3)}
                  disabled={!summary.trim()}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-all"
                >
                  Continue to Share
                </button>
              </div>
              
              <textarea
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                rows={12}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Your AI-generated summary will appear here..."
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Back to Input
                </button>
                <button
                  onClick={generateSummary}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Share */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Share Summary</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                <p className="text-sm text-gray-600 mb-2">Summary Preview:</p>
                <div className="text-sm whitespace-pre-wrap">{summary}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Recipients</label>
                <input
                  type="text"
                  className={`w-full border rounded-lg p-3 transition-all ${
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
                  <div className="flex items-center text-red-600 text-sm mt-2">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {emailError}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Back to Review
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={!summary.trim() || !emailTo.trim()}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-all"
                >
                  Send Email
                </button>
                <button
                  onClick={resetAll}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}