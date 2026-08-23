"use client";

import { useState } from "react";

export default function Copilot() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/copilot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("Unable to connect to GeoShield Copilot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#263642] bg-[#0d171f] p-5 shadow-lg">

      {/* HEADER */}
      <div className="mb-5">
        <div className="text-sm font-semibold tracking-wide text-white">
          GEOSHIELD COPILOT
        </div>

        <div className="mt-1 text-xs text-[#8995a3]">
          AI analysis based on current intelligence
        </div>
      </div>

      {/* INPUT */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        placeholder="Ask about current risk..."
        className="w-full rounded-lg border border-[#263642] bg-[#081118] px-4 py-3 text-sm text-white outline-none placeholder:text-[#617080] focus:border-[#18d6c4]"
      />

      {/* BUTTON */}
      <button
        onClick={sendMessage}
        disabled={loading}
        className="mt-3 w-full rounded-lg bg-[#18d6c4] px-4 py-3 text-sm font-semibold text-[#061014] hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Ask Copilot"}
      </button>

      {/* ANSWER */}
      {answer && (
        <div className="mt-5 rounded-lg border border-[#263642] bg-[#081118] p-4">

          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#18d6c4]">
            Copilot Analysis
          </div>

          <div className="whitespace-pre-wrap text-sm leading-6 text-[#c8d1d9]">
            {answer.replace(/\*\*/g, "")}
          </div>

        </div>
      )}

    </div>
  );
}