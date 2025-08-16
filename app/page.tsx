"use client";
import { useState, useRef } from "react";
import { summarizeTranscript } from "./functions/summarizeFunction";
import { sendEmail } from "./functions/sendEmailFunction";
import { ToastProvider, useToast } from "./components/Toast";
import { Header, ProgressSteps, InputStep, ReviewStep, ShareStep } from "./components/sections";

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

  async function handleFile(e: any) {
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
        setTimeout(() => changeStep(2), 500);
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
        <Header />
        
        <ProgressSteps 
          activeStep={activeStep} 
          onStepChange={changeStep} 
        />

        {/* Main Content Card */}
        <div className={`bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
          {/* Step 1: Input */}
          {activeStep === 1 && (
            <InputStep
              prompt={prompt}
              setPrompt={setPrompt}
              transcriptText={transcriptText}
              setTranscriptText={setTranscriptText}
              loading={loading}
              fileRef={fileRef}
              onFileChange={handleFile}
              onGenerateSummary={generateSummary}
              onReset={resetAll}
            />
          )}

          {/* Step 2: Review Summary */}
          {activeStep === 2 && (
            <ReviewStep
              summary={summary}
              setSummary={setSummary}
              loading={loading}
              onContinueToShare={() => changeStep(3)}
              onBackToInput={() => changeStep(1)}
              onRegenerate={generateSummary}
            />
          )}

          {/* Step 3: Share */}
          {activeStep === 3 && (
            <ShareStep
              summary={summary}
              emailTo={emailTo}
              setEmailTo={setEmailTo}
              emailError={emailError}
              setEmailError={setEmailError}
              onBackToReview={() => changeStep(2)}
              onSendEmail={handleSendEmail}
              onReset={resetAll}
            />
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