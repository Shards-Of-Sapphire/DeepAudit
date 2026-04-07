"use client";

import { useState } from "react";
import { Scan, AlertTriangle, Loader2, FileX, RefreshCw, Shield, CheckCircle2 } from "lucide-react";

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
}

const Button = ({ 
  children, 
  onClick, 
  disabled, 
  variant = "primary", 
  className = "",
  isLoading = false 
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
// Features: Deep Audit bold main title, SAPPHIRE badge top right, actual logo
// ============================================
const CreativeHeader = () => (
  <div className="relative">
    {/* SAPPHIRE Badge - Top Right */}
    <div className="absolute top-0 right-0 flex items-center gap-3">
      <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2 rounded-full shadow-lg border-2 border-emerald-400/30">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="font-bold text-sm tracking-wider">SAPPHIRE</span>
      </div>
      <span className="text-xs text-stone-500 dark:text-stone-500 bg-stone-200 dark:bg-stone-800 px-3 py-1.5 rounded-full font-semibold border border-stone-300 dark:border-stone-700">
        v0.4.0
      </span>
    </div>

    {/* Main Title Section */}
    <div className="flex items-start gap-6">
      {/* Logo with creative styling */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        <div className="relative w-24 h-24 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900 rounded-2xl p-2 shadow-xl border-2 border-emerald-500/20 overflow-hidden">
          <img 
            src="/logo.jpeg" 
            alt="DeepAudit Logo"
            className="w-full h-full object-cover rounded-xl"
          />
          {/* Animated scan line overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent scanner-beam-slow"></div>
        </div>
      </div>

      {/* Title and Tagline */}
      <div className="flex-1 pt-2">
        <div className="flex items-baseline gap-3">
          <h1 className="text-5xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            DEEP AUDIT
          </h1>
          <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Dashboard
          </span>
        </div>
        
        {/* Animated tagline */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-medium">
              The X-Ray for AI-Generated Code
            </p>
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
        throw new Error("Failed to connect to the DeepAudit engine.");
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
    <main className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-emerald-50 dark:from-stone-950 dark:via-stone-900 dark:to-emerald-950/20 text-stone-800 dark:text-stone-300 p-8 font-sans relative overflow-hidden">
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
            Features: Creative layout with SAPPHIRE badge, Deep Audit title, logo
            ============================================ */}
        <header className="border-b-2 border-stone-200 dark:border-stone-800 pb-8">
          <CreativeHeader />
        </header>

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
                <div>Target Payload</div>
                <div className="text-xs font-normal text-stone-500 dark:text-stone-500 normal-case tracking-normal">
                  Paste your code for security analysis
                </div>
              </div>
            </label>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-500">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Python Support Active</span>
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
# We'll scan for:
# - Injection vulnerabilities
# - Unsafe eval() usage  
# - Security anti-patterns"
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
              >
                <Scan className="w-4 h-4" />
                {isScanning ? "Scanning..." : "Run Security Audit"}
              </Button>
            </div>
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
              <div className="space-y-2">
                <div className="scanner-beam h-2 bg-emerald-500 rounded-full w-full"></div>
                <p className="text-stone-700 dark:text-stone-300 font-semibold">
                  Scanning with Tree-sitter Engine...
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Analyzing code patterns and security vulnerabilities
                </p>
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
                    Audit Results
                  </h3>
                  {scanCompleted && (
                    <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                      Analysis complete • {findings.length} issue{findings.length !== 1 ? 's' : ''} detected
                    </p>
                  )}
                </div>
              </div>
              {scanCompleted && findings.length > 0 && (
                <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-900 px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-800">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                    {findings.length} Total
                  </span>
                </div>
              )}
            </div>

            {/* Empty State */}
            {!scanCompleted && findings.length === 0 && (
              <StateDisplay
                icon={<FileX className="w-16 h-16" />}
                title="No Scan Results Yet"
                description="Enter your code above and click 'Run Security Audit' to detect potential security vulnerabilities and code quality issues."
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
            Securing the future of AI-generated code, one scan at a time
          </p>
        </footer>
      </div>
    </main>
  );
}
