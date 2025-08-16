"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("Summarize in bullet points for executives.");
  const [transcriptText, setTranscriptText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailError, setEmailError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const FROM_EMAIL = process.env.FROM_EMAIL;

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
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcriptText, prompt }),
      });
      const data = await res.json();
      setSummary(data.summary || "");
    } catch (e) {
      console.error(e);
      alert("Error generating summary");
    } finally {
      setLoading(false);
    }
  }

  async function sendEmail() {
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
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: emailTo, subject: "Meeting Summary", body: summary, from:FROM_EMAIL}),
      });
      console.log("from email from page.tsx", FROM_EMAIL);
      const data = await res.json();
      if (res.ok) alert("Email sent ✔");
      else alert(data.error || "Failed to send email");
    } catch (e) {
      console.error(e);
      alert("Error sending email");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ">
      <div className=" mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            AI Meeting Notes Summarizer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your meeting transcripts into actionable insights with AI-powered summarization
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Transcript Upload */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Meeting Transcript
              </label>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <input 
                    ref={fileRef} 
                    type="file" 
                    accept=".txt,text/plain" 
                    onChange={handleFile}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <textarea
                  className="w-full border-2 border-gray-200 rounded-lg p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                  rows={8}
                  value={transcriptText}
                  onChange={(e) => setTranscriptText(e.target.value)}
                  placeholder="Or paste your meeting transcript here..."
                />
              </div>
            </div>

            {/* Custom Instruction */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Custom Instructions
              </label>
              <input
                type="text"
                className="w-full border-2 border-gray-200 rounded-lg p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="How would you like the summary formatted?"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={generateSummary}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
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
                  "✨ Generate Summary"
                )}
              </button>
              <button
                onClick={() => { 
                  setTranscriptText(""); 
                  setSummary(""); 
                  setPrompt("Summarize in bullet points for executives."); 
                  setEmailTo(""); 
                  setEmailError("");
                  if(fileRef.current) fileRef.current.value=""; 
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6">
            {/* Generated Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Generated Summary
              </label>
              <textarea
                className="w-full border-2 border-gray-200 rounded-lg p-4 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all resize-none"
                rows={12}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Your AI-generated summary will appear here..."
              />
            </div>

            {/* Email Sharing */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Share via Email
              </label>
              <div className="space-y-4">
                <input
                  type="text"
                  className={`w-full border-2 rounded-lg p-4 transition-all ${
                    emailError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                  }`}
                  placeholder="Enter recipient emails (comma separated)"
                  value={emailTo}
                  onChange={(e) => {
                    setEmailTo(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                />
                {emailError && (
                  <div className="flex items-center text-red-600 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {emailError}
                  </div>
                )}
                <button
                  onClick={sendEmail}
                  disabled={!summary.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}