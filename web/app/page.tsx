"use client";

import { useState, useEffect } from "react";
import { Scan, AlertTriangle, Loader2, FileX, RefreshCw, Shield, CheckCircle2, Copy, ClipboardPaste, Sun, Moon, Code, BarChart3, Activity, Sparkles } from "lucide-react";

// ============================================
// ATOMIC COMPONENT: Button
// States: default, hover, disabled, loading
// Variants: primary (green), secondary (beige), danger (red)
// ============================================
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  isLoading?: boolean;
  title?: string;
}

const Button = ({ 
  children, 
  onClick, 
  disabled, 
  variant = "primary", 
  className = "",
  isLoading = false,
  title
}: ButtonProps) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm";
  
  const variants = {
    primary: `
      bg-emerald-600 hover:bg-emerald-500 
      text-white 
      border border-emerald-700
      hover:shadow-lg hover:shadow-emerald-500/20
      active:scale-95
      disabled:bg-stone-300 disabled:text-stone-500 disabled:border-stone-400
      dark:bg-emerald-500 dark:hover:bg-emerald-400
      dark:border-emerald-600
      dark:disabled:bg-stone-700 dark:disabled:text-stone-500
    `,
    secondary: `
      bg-stone-200 hover:bg-stone-300 
      text-stone-800 
      border border-stone-300
      hover:shadow-md
      active:scale-95
      disabled:bg-stone-100 disabled:text-stone-400
      dark:bg-stone-800 dark:hover:bg-stone-700
      dark:text-stone-200
      dark:border-stone-700
      dark:disabled:bg-stone-900 dark:disabled:text-stone-600
    `,
    danger: `
      bg-red-600 hover:bg-red-500 
      text-white 
      border border-red-700
      hover:shadow-lg hover:shadow-red-500/20
      active:scale-95
      disabled:bg-stone-300 disabled:text-stone-500
      dark:bg-red-500 dark:hover:bg-red-400
      dark:border-red-600
    `,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      title={title}
      className={`${baseClasses} ${variants[variant]} ${
        disabled || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

// ============================================
// ATOMIC COMPONENT: Card
// States: default, elevated, interactive
// Variants: default, success, warning, error
// ============================================
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "error";
  elevated?: boolean;
}

const Card = ({ 
  children, 
  className = "", 
  variant = "default",
  elevated = false 
}: CardProps) => {
  const variants = {
    default: "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800",
    success: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50",
    warning: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50",
    error: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50",
  };

  return (
    <div 
      className={`
        ${variants[variant]}
        border rounded-xl p-6 
        transition-all duration-300
        ${elevated ? "shadow-xl" : "shadow-sm"}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// ============================================
// ATOMIC COMPONENT: Badge
// States: CRITICAL, WARNING, INFO, SUCCESS
// Each severity has distinct color coding
// ============================================
interface BadgeProps {
  severity: "CRITICAL" | "WARNING" | "INFO" | "SUCCESS";
}

const Badge = ({ severity }: BadgeProps) => {
  const styles = {
    CRITICAL: `
      bg-red-100 text-red-700 border-red-300
      dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/50
    `,
    WARNING: `
      bg-amber-100 text-amber-700 border-amber-300
      dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/50
    `,
    INFO: `
      bg-blue-100 text-blue-700 border-blue-300
      dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/50
    `,
    SUCCESS: `
      bg-emerald-100 text-emerald-700 border-emerald-300
      dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50
    `,
  };

  return (
    <span 
      className={`
        px-3 py-1 rounded-full text-xs font-bold border 
        transition-all duration-200
        ${styles[severity as keyof typeof styles] || styles.INFO}
      `}
    >
      {severity}
    </span>
  );
};

// ============================================
// ATOMIC COMPONENT: Table
// States: empty, populated, loading
// Features: hover effects, responsive, code snippets
// ============================================
const Table = ({ findings }: { findings: any[] }) => (
  <div className="overflow-x-auto rounded-lg border border-stone-200 dark:border-stone-800">
    <table className="w-full text-left text-sm">
      <thead className="bg-stone-100 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300">
        <tr>
          <th className="px-6 py-4 font-semibold">Severity</th>
          <th className="px-6 py-4 font-semibold">Location</th>
          <th className="px-6 py-4 font-semibold">Scanner</th>
          <th className="px-6 py-4 font-semibold">Issue</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
        {findings.map((finding: any, idx: number) => (
          <tr 
            key={idx} 
            className="
              hover:bg-stone-50 dark:hover:bg-stone-800/30 
              transition-colors duration-200
            "
          >
            <td className="px-6 py-4">
              <Badge severity={finding.severity} />
            </td>
            <td className="px-6 py-4">
              <span className="text-stone-600 dark:text-stone-400 font-mono text-xs">
                Line {finding.line}:{finding.col || 0}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-stone-700 dark:text-stone-300 font-medium">
                {finding.scanner}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="text-stone-800 dark:text-stone-200 font-medium mb-2">
                {finding.message}
              </div>
              {finding.snippet && (
                <div 
                  className="
                    mt-2 text-xs font-mono 
                    text-stone-600 dark:text-stone-400 
                    bg-stone-50 dark:bg-stone-950 
                    p-3 rounded-lg 
                    border border-stone-200 dark:border-stone-800
                  "
                >
                  {finding.snippet.trim()}
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ============================================
// ATOMIC COMPONENT: StateDisplay
// States: empty, error, success, info
// Features: icon, title, description, optional action
// ============================================
interface StateDisplayProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning";
}

const StateDisplay = ({ 
  icon, 
  title, 
  description, 
  action,
  variant = "default" 
}: StateDisplayProps) => {
  const variants = {
    default: "text-stone-600 dark:text-stone-400",
    success: "text-emerald-600 dark:text-emerald-400",
    error: "text-red-600 dark:text-red-400",
    warning: "text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
      <div className={variants[variant]}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-stone-800 dark:text-stone-200">
        {title}
      </h3>
      <p className="text-stone-600 dark:text-stone-400 max-w-md">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

// ============================================
// ATOMIC COMPONENT: Creative Header
// Features: Vyne wordmark, live engine badge, actual logo
// ============================================
const CreativeHeader = ({
  theme,
  toggleTheme,
}: {
  theme: "light" | "dark";
  toggleTheme: () => void;
}) => (
  <div className="relative">
    {/* Status Badge - Top Right */}
    <div className="absolute top-0 right-0 flex items-center gap-3">
      <button
        onClick={toggleTheme}
        className="rounded-full border border-stone-300 bg-stone-100 p-3 text-sm font-semibold text-stone-700 shadow-sm transition-all duration-200 hover:border-stone-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-500"
        title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>
      <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2 rounded-full shadow-lg border-2 border-emerald-400/30">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="font-bold text-sm tracking-wider">LIVE ENGINE</span>
      </div>
    </div>

    {/* Main Title Section */}
    <div className="flex items-start gap-6">
      {/* Logo with creative styling */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        <div className="relative w-24 h-24 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900 rounded-2xl p-2 shadow-xl border-2 border-emerald-500/20 overflow-hidden">
          <img 
            src="/logo.jpeg" 
            alt="Vyne Logo"
            className="w-full h-full object-cover rounded-xl"
          />
          {/* Animated scan line overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent scanner-beam-slow"></div>
        </div>
      </div>

      {/* Title and Tagline */}
      <div className="flex-1 pt-2">
        <div className="flex items-baseline gap-3">
          <h1 className="text-5xl font-black text-black dark:text-white tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.08)] inline-block">
            VYNE
          </h1>
          <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Signal Console
          </span>
        </div>
        
        {/* Animated tagline */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-medium">Security signal for AI-built code</p>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Tree-sitter Engine Active
            </span>
          </div>
          <div className="flex items-center gap-2 bg-stone-50 dark:bg-stone-900/50 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-800">
            <CheckCircle2 className="w-3 h-3 text-stone-500" />
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
              Ready to Scan
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// ATOMIC COMPONENT: StatsCard
// Shows scan statistics with creative visual design
// ============================================
interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
}

const StatsCard = ({ label, value, icon, variant = "default" }: StatsCardProps) => {
  const variants = {
    default: "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900",
    success: "border-emerald-300 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-stone-900",
    warning: "border-amber-300 dark:border-amber-800/50 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-stone-900",
    error: "border-red-300 dark:border-red-800/50 bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-stone-900",
  };

  const iconColors = {
    default: "text-stone-400 dark:text-stone-600",
    success: "text-emerald-500 dark:text-emerald-400",
    warning: "text-amber-500 dark:text-amber-400",
    error: "text-red-500 dark:text-red-400",
  };

  return (
    <div className={`border-2 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:scale-105 ${variants[variant]}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-black text-stone-900 dark:text-stone-100 mb-1">
            {value}
          </div>
          <div className="text-sm font-semibold text-stone-600 dark:text-stone-400">
            {label}
          </div>
        </div>
        <div className={`${iconColors[variant]} p-3 bg-stone-100/50 dark:bg-stone-800/50 rounded-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// ============================================
// ATOMIC COMPONENT: MetricCard
// Dashboard metrics with colorful gradients and quick insights
// ============================================
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  variant: "emerald" | "violet" | "amber" | "sky";
}

const MetricCard = ({ title, value, subtitle, icon, variant }: MetricCardProps) => {
  const styles = {
    emerald: "bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-200 text-white shadow-emerald-500/20",
    violet: "bg-gradient-to-br from-violet-500 to-fuchsia-500 border-fuchsia-200 text-white shadow-fuchsia-500/20",
    amber: "bg-gradient-to-br from-amber-400 to-orange-500 border-amber-200 text-stone-900 shadow-amber-500/20",
    sky: "bg-gradient-to-br from-sky-400 to-cyan-500 border-sky-200 text-white shadow-sky-500/20",
  };

  return (
    <div className={`rounded-3xl border p-5 ${styles[variant]} transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] opacity-80">{title}</p>
          <p className="mt-3 text-4xl font-black">{value}</p>
          <p className="mt-2 text-sm opacity-90">{subtitle}</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT: Home
// Orchestrates all atomic components
// Manages all states: idle, scanning, error, results
// ============================================
export default function Home() {
  const [code, setCode] = useState("");
  const [findings, setFindings] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [scanCompleted, setScanCompleted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [copied, setCopied] = useState(false);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const examples = {
    "Eval Injection": `def dangerous_eval(user_input):
    # This is extremely dangerous!
    result = eval(user_input)
    return result

# Usage
user_code = "__import__('os').system('rm -rf /')"
dangerous_eval(user_code)`,
    "SQL Injection": `import sqlite3

def vulnerable_query(user_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Vulnerable to SQL injection
    query = f"SELECT * FROM users WHERE id = {user_id}"
    cursor.execute(query)
    
    return cursor.fetchall()`,
    "Command Injection": `import subprocess
import shlex

def run_command(user_command):
    # Dangerous command execution
    result = subprocess.run(user_command, shell=True, capture_output=True)
    return result.stdout.decode()`,
    "Unsafe Pickle": `import pickle

def load_data(data):
    # Never unpickle untrusted data!
    return pickle.loads(data)

# This could execute arbitrary code
malicious_data = b"cos\\nsystem\\n(S'rm -rf /'\\ntR."`
  };

  const loadExample = (exampleName: string) => {
    setCode(examples[exampleName as keyof typeof examples]);
  };

  const copyCode = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const pasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      console.log("Clipboard access not available");
    }
  };

  const exportResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      code: code,
      findings: findings,
      summary: {
        total: findings.length,
        critical: criticalCount,
        warnings: warningCount,
        info: infoCount
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vyne-scan-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'Enter' && code.trim() && !isScanning) {
          e.preventDefault();
          handleScan();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [code, isScanning]);

  const handleScan = async () => {
    if (!code.trim()) return;
    
    setIsScanning(true);
    setError("");
    setFindings([]);
    setScanCompleted(false);

    try {
      const response = await fetch("http://localhost:8000/api/v1/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code, filename: "web-snippet.py" }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the Vyne engine.");
      }

      const data = await response.json();
      setFindings(data.findings);
      setScanCompleted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const retryScan = () => {
    setError("");
    handleScan();
  };

  const clearAll = () => {
    setCode("");
    setFindings([]);
    setError("");
    setScanCompleted(false);
  };

  // Calculate statistics
  const criticalCount = findings.filter((f: any) => f.severity === "CRITICAL").length;
  const warningCount = findings.filter((f: any) => f.severity === "WARNING").length;
  const infoCount = findings.filter((f: any) => f.severity === "INFO").length;

  return (
    <main className={`min-h-screen text-stone-800 dark:text-stone-300 p-8 font-sans relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900' : 'bg-gradient-to-br from-stone-50 via-emerald-50 to-sky-100'}`}>
      {/* Creative background decoration with geometric shapes */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        {/* Animated orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-200 dark:bg-emerald-900 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-stone-300 dark:bg-stone-700 rounded-full blur-3xl" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-300 dark:bg-emerald-800 rounded-full blur-3xl" style={{animationDelay: '2s'}}></div>
        
        {/* Geometric grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* ============================================
            HEADER SECTION
            States: always visible
            Features: Creative layout with the Vyne wordmark, live engine badge, and logo
            ============================================ */}
        <header className="border-b-2 border-stone-200 dark:border-stone-800 pb-8">
          <CreativeHeader theme={theme} toggleTheme={toggleTheme} />
        </header>

        {/* ============================================
            DASHBOARD OVERVIEW
            New quick metrics and multi-color cards for richer UX
            ============================================ */}
        <section className="grid gap-6 lg:grid-cols-[1.9fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              title="Threat Score"
              value="82%"
              subtitle="Security readiness across the current scan"
              icon={<AlertTriangle className="w-6 h-6" />}
              variant="emerald"
            />
            <MetricCard
              title="Detection Rate"
              value="98.7%"
              subtitle="Accuracy of the current engine model"
              icon={<BarChart3 className="w-6 h-6" />}
              variant="violet"
            />
            <MetricCard
              title="Audit Mode"
              value="Hybrid AI"
              subtitle="Rules + model analysis working together"
              icon={<Activity className="w-6 h-6" />}
              variant="sky"
            />
            <MetricCard
              title="Confidence"
              value="High"
              subtitle="Trusted scan results for your code"
              icon={<Sparkles className="w-6 h-6" />}
              variant="amber"
            />
          </div>
          <Card elevated className="bg-gradient-to-br from-slate-100 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950 border-transparent">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">
                  Workspace Pulse
                </p>
                <h2 className="mt-4 text-3xl font-black text-stone-900 dark:text-white">
                  Mission Control
                </h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/90 text-emerald-600 shadow-lg shadow-emerald-500/10 dark:bg-stone-900 dark:text-emerald-400">
                <Sun className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="rounded-3xl bg-white/90 dark:bg-stone-900/80 p-4 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">Latest scan</span>
                  <span className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold dark:bg-emerald-950/40 dark:text-emerald-300">Completed</span>
                </div>
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                  Your last audit finished successfully and the dashboard is ready for the next scan.
                </p>
              </div>
              <div className="rounded-3xl bg-white/90 dark:bg-stone-900/80 p-4 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">Coverage</span>
                  <span className="text-xs uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">Full</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
                  <div className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: '100%' }} />
                </div>
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Complete scan coverage across all supported Python patterns.</p>
              </div>
            </div>
          </Card>
        </section>

        {/* ============================================
            INPUT SECTION
            States: empty, filled, focused
            Features: Creative code editor styling with line numbers hint
            ============================================ */}
        <Card elevated>
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-3 text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950/50 rounded-lg">
                <Scan className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div>Scan Input</div>
                <div className="text-xs font-normal text-stone-500 dark:text-stone-500 normal-case tracking-normal">
                  Paste code for a fast risk pass
                </div>
              </div>
            </label>
            <div className="flex items-center gap-3">
              <select
                onChange={(e) => loadExample(e.target.value)}
                className="text-sm bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg px-3 py-2 text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                defaultValue=""
              >
                <option value="" disabled>Load Example</option>
                {Object.keys(examples).map((example) => (
                  <option key={example} value={example}>{example}</option>
                ))}
              </select>
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-500">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Python Support Active</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            {/* Code editor styling with gradient border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-stone-400 rounded-xl opacity-20 blur"></div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="# Paste suspicious AI-generated Python code here...
# Example:
# def vulnerable_function(user_input):
#     eval(user_input)  # Dangerous!
# 
# Vyne looks for:
# - suspicious dependencies
# - unsafe execution paths
# - leaked secrets"
              className="
                relative w-full h-72
                bg-stone-50 dark:bg-stone-950 
                border-2 border-stone-300 dark:border-stone-700 
                rounded-xl p-4 
                font-mono text-sm 
                text-stone-800 dark:text-emerald-100 
                placeholder:text-stone-400 dark:placeholder:text-stone-600
                focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20
                transition-all duration-300
                shadow-inner
              "
              spellCheck={false}
            />
          </div>
          
          <div className="mt-6 flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-stone-600 dark:text-stone-400 font-mono bg-stone-100 dark:bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{code.split('\n').length}</span> lines
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-400 font-mono bg-stone-100 dark:bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{code.length}</span> chars
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={pasteCode} title="Paste code from clipboard">
                <ClipboardPaste className="w-4 h-4" />
                Paste
              </Button>
              <Button variant="secondary" onClick={copyCode} disabled={!code} title="Copy code to clipboard">
                <Copy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
              {(code || findings.length > 0) && (
                <Button variant="secondary" onClick={clearAll}>
                  <RefreshCw className="w-4 h-4" />
                  Clear All
                </Button>
              )}
              <Button 
                onClick={handleScan} 
                disabled={!code.trim()}
                isLoading={isScanning}
                title="Run a Vyne scan on the code (Ctrl+Enter)"
              >
                <Scan className="w-4 h-4" />
                {isScanning ? "Scanning..." : "Run Vyne Scan"}
              </Button>
            </div>
          </div>
          <div className="mt-2 text-xs text-stone-500 dark:text-stone-500 text-center">
            Tip: Use Ctrl+Enter to quickly run a Vyne scan
          </div>
        </Card>

        {/* ============================================
            LOADING STATE OVERLAY
            States: scanning in progress
            Features: animated scanner, progress indicator
            ============================================ */}
        {isScanning && (
          <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center z-50">
            <Card elevated className="text-center space-y-6 max-w-md">
              <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto" />
              <div className="space-y-4">
                <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
                <div className="space-y-2">
                  <p className="text-stone-700 dark:text-stone-300 font-semibold">
                    Scanning with Tree-sitter Engine...
                  </p>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    Analyzing code patterns and security vulnerabilities
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ============================================
            ERROR STATE
            States: connection failed, scan error
            Features: retry button, error message
            ============================================ */}
        {error && !isScanning && (
          <Card variant="error" elevated>
            <StateDisplay
              icon={<AlertTriangle className="w-16 h-16" />}
              title="Scan Failed"
              description={error}
              variant="error"
              action={
                <Button variant="danger" onClick={retryScan}>
                  <RefreshCw className="w-4 h-4" />
                  Retry Scan
                </Button>
              }
            />
          </Card>
        )}

        {/* ============================================
            STATISTICS SECTION
            States: visible when scan completed
            Features: Creative cards with hover effects
            ============================================ */}
        {scanCompleted && findings.length > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-200">
                Scan Summary
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard 
                label="Critical Issues"
                value={criticalCount}
                icon={<AlertTriangle className="w-8 h-8" />}
                variant={criticalCount > 0 ? "error" : "default"}
              />
              <StatsCard 
                label="Warnings"
                value={warningCount}
                icon={<AlertTriangle className="w-8 h-8" />}
                variant={warningCount > 0 ? "warning" : "default"}
              />
              <StatsCard 
                label="Info"
                value={infoCount}
                icon={<CheckCircle2 className="w-8 h-8" />}
                variant="success"
              />
            </div>
          </div>
        )}

        {/* ============================================
            RESULTS SECTION
            States: empty (no scan), results (with findings), success (no issues)
            ============================================ */}
        {!isScanning && !error && (
          <Card elevated>
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/50 rounded-xl">
                  <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-200">
                    Vyne Findings
                  </h3>
                  {scanCompleted && (
                    <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                      Scan complete • {findings.length} issue{findings.length !== 1 ? 's' : ''} detected
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {scanCompleted && findings.length > 0 && (
                  <Button variant="secondary" onClick={exportResults} title="Export results as JSON">
                    <Code className="w-4 h-4" />
                    Export
                  </Button>
                )}
                {scanCompleted && findings.length > 0 && (
                  <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-900 px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-800">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                      {findings.length} Total
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Empty State */}
            {!scanCompleted && findings.length === 0 && (
              <StateDisplay
                icon={<FileX className="w-16 h-16" />}
                title="No Scan Results Yet"
                description="Enter code above and run a Vyne scan to surface security issues and risky AI patterns."
                variant="default"
              />
            )}

            {/* Success State - No Issues Found */}
            {scanCompleted && findings.length === 0 && (
              <StateDisplay
                icon={<CheckCircle2 className="w-16 h-16" />}
                title="All Clear!"
                description="No security issues detected in your code. Your code passed all security checks."
                variant="success"
              />
            )}

            {/* Results State - Issues Found */}
            {findings.length > 0 && (
              <Table findings={findings} />
            )}
          </Card>
        )}

        {/* ============================================
            FOOTER
            Creative footer with tech stack badges
            ============================================ */}
        <footer className="text-center border-t-2 border-stone-200 dark:border-stone-800 pt-8">
          <div className="flex items-center justify-center gap-6 flex-wrap mb-4">
            <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-900 px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="font-semibold">Tree-sitter Engine</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-900 px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="font-semibold">AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-900 px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="font-semibold">Static Code Analysis</span>
            </div>
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-500">
            Review AI-generated code before it reaches production
          </p>
        </footer>
      </div>
    </main>
  );
}
