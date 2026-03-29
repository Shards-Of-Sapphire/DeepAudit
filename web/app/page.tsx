"use client";

import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [findings, setFindings] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!code.trim()) return;
    
    setIsScanning(true);
    setError("");
    setFindings([]);

    try {
      // Sending the code to your local FastAPI engine
      const response = await fetch("http://localhost:8000/api/v1/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code, filename: "web-snippet.py" }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the DeepAudit engine.");
      }

      const data = await response.json();
      console.log("RAW API RESPONSE:", data);
      setFindings(data.findings);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 p-8 font-mono">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-bold text-cyan-400">SAPPHIRE</h1>
          <h2 className="text-xl text-slate-100 mt-1">DeepAudit Dashboard <span className="text-sm text-slate-500 ml-2">v0.4.0</span></h2>
          <p className="text-slate-500 mt-2">The X-Ray for AI-Generated Code.</p>
        </header>

        {/* The Input Section */}
        <section className="space-y-4">
          <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Target Payload
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="# Paste suspicious AI-generated Python code here..."
            className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm text-cyan-100 focus:outline-none focus:border-cyan-500 transition-colors"
            spellCheck="false"
          />
          <button
            onClick={handleScan}
            disabled={isScanning || !code}
            className={`px-6 py-3 rounded-md font-bold text-slate-950 transition-all ${
              isScanning || !code 
                ? "bg-slate-700 cursor-not-allowed" 
                : "bg-cyan-500 hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            }`}
          >
            {isScanning ? "Engaging Scanners..." : "Run Security Audit"}
          </button>
        </section>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-950/50 border border-red-500/50 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* The Results Table */}
        {findings.length > 0 && (
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-slate-100">Audit Results</h3>
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/50 text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Severity</th>
                    <th className="px-4 py-3 font-medium">Line</th>
                    <th className="px-4 py-3 font-medium">Scanner</th>
                    <th className="px-4 py-3 font-medium">Issue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {findings.map((finding: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          finding.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                          finding.severity === 'WARNING' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {finding.severity}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-500">{finding.line}:{finding.col || 0}</td>
                      <td className="px-4 py-4 text-slate-300">{finding.scanner}</td>
                      <td className="px-4 py-4">
                        <div className="text-slate-200">{finding.message}</div>
                        {finding.snippet && (
                          <div className="mt-2 text-xs font-mono text-slate-500 bg-slate-950 p-2 rounded border border-slate-800">
                            {finding.snippet.trim()}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}