"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("Summarize in bullet points for executives.");
  const [transcriptText, setTranscriptText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const fileRef = useRef(null);

  async function handleFile(e) {
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
    if (!emailTo.trim()) {
      alert("Enter recipient email(s).");
      return;
    }
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: emailTo, subject: "Meeting Summary", body: summary }),
      });
      const data = await res.json();
      if (res.ok) alert("Email sent ✔");
      else alert(data.error || "Failed to send email");
    } catch (e) {
      console.error(e);
      alert("Error sending email");
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-2">AI Meeting Notes Summarizer</h1>
      <p className="text-gray-600 mb-6">Upload or paste your transcript, add a custom instruction, then generate & share.</p>

      <div className="mb-6 space-y-2">
        <label className="font-medium">Transcript</label>
        <input ref={fileRef} type="file" accept=".txt,text/plain" onChange={handleFile} />
        <textarea
          className="w-full border rounded p-3"
          rows={8}
          value={transcriptText}
          onChange={(e) => setTranscriptText(e.target.value)}
          placeholder="Paste transcript here..."
        />
      </div>

      <div className="mb-6 space-y-2">
        <label className="font-medium">Custom instruction</label>
        <input
          type="text"
          className="w-full border rounded p-3"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={generateSummary}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {loading ? "Generating..." : "Generate Summary"}
        </button>
        <button
          onClick={() => { setTranscriptText(""); setSummary(""); setPrompt(""); setEmailTo(""); if(fileRef.current) fileRef.current.value=""; }}
          className="border px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      <div className="mb-6 space-y-2">
        <label className="font-medium">Generated Summary (editable)</label>
        <textarea
          className="w-full border rounded p-3 bg-white"
          rows={10}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      <div className="mb-6 space-y-2">
        <label className="font-medium">Share via Email</label>
        <input
          type="text"
          className="w-full border rounded p-3"
          placeholder="Recipient emails, comma separated"
          value={emailTo}
          onChange={(e) => setEmailTo(e.target.value)}
        />
        <button
          onClick={sendEmail}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Send Email
        </button>
      </div>
    </main>
  );
}