"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function StreamChat() {
  const [msg, setMsg] = useState("");
  const [output, setOutput] = useState("");

  const send = async () => {
    setOutput("");

    const res = await fetch("http://localhost:8000/api/ai/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_AI_KEY,
      },
      body: JSON.stringify({
        model: "llama3.2:3b",
        messages: [{ role: "user", content: msg }],
      }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const payload = line.replace("data: ", "");

        if (payload === "[DONE]") return;

        try {
          const json = JSON.parse(payload);
          const text = json.message?.content || "";

          setOutput((prev) => prev + text);
        } catch {
          /* ignore broken chunks */
        }
      }
    }
  };

  return (
    <div className="p-4 space-y-4">
      <textarea
        className="w-full border p-2"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />

      <button className="px-4 py-2 bg-blue-600 text-white" onClick={send}>
        Send
      </button>

      {/* Render Markdown */}
      <div className="prose dark:prose-invert max-w-none mt-4">
        
        <ReactMarkdown>{output}</ReactMarkdown>
      </div>
    </div>
  );
}
