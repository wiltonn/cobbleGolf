// This page calls the backend Puppeteer API to check Cobble Hills Men's League 2025 times.
"use client";
import { useState } from "react";

export default function PuppeteerCheckPage() {
  const [loading, setLoading] = useState(false);
  const [times, setTimes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const checkTimes = async () => {
    setLoading(true);
    setError(null);
    setTimes([]);
    try {
      const res = await fetch("/api/puppeteer-check", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setTimes(data.times || []);
      } else {
        setError(data.error || "Unknown error");
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Puppeteer League Times Checker</h1>
      <button onClick={checkTimes} disabled={loading} style={{ padding: 8, fontSize: 16 }}>
        {loading ? "Checking..." : "Check Cobble Hills Men's League 2025 Times"}
      </button>
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
      {times.length > 0 && (
        <ul style={{ marginTop: 16 }}>
          {times.map((time, idx) => (
            <li key={idx}>{time}</li>
          ))}
        </ul>
      )}
    </div>
  );
} 