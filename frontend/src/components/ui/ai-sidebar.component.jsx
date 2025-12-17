"use client";

import { useState, useRef, useEffect } from "react";
import {
  IconSparkles,
  IconX,
  IconSend,
  IconWand,
  IconAbc,
  IconLoader2,
  IconChevronLeft,
  IconChevronRight,
  IconTrash,
  IconCopy,
  IconCheck,
  IconPlayerStop,
  IconDownload,
  IconSettings,
} from "@tabler/icons-react";
import ReactMarkdown from "react-markdown";

const AVAILABLE_MODELS = [
  {
    id: "gemma3:270m",
    name: "Gemma 3 270M",
    description: "Super Small, most lightweight",
  },
  { id: "gemma3:1b", name: "Gemma 3 1B", description: "Small, fast" },
  {
    id: "llama3.2:3b",
    name: "Llama 3.2 3B",
    description: "Balanced performance",
  },
];

const AI_ACTIONS = [
  {
    id: "suggest",
    label: "Suggest Sentences",
    icon: IconSparkles,
    prompt: (selectedText, documentContent) => {
      const context = documentContent
        ? `\n\nFull document context:\n"""\n${documentContent}\n"""`
        : "";
      const focusText = selectedText || documentContent;
      return `Based on the following text, suggest 3 possible next sentences that would naturally continue the writing. Format as a numbered list.${context}\n\nText to continue from:\n"${
        focusText?.slice(-500) || ""
      }"`;
    },
  },
  {
    id: "rewrite",
    label: "Rewrite",
    icon: IconWand,
    prompt: (selectedText, documentContent) => {
      const textToRewrite = selectedText || documentContent;
      return `Rewrite the following markdown text to improve clarity, flow, and engagement while maintaining the original meaning and markdown formatting. Provide the rewritten version:\n\n"""\n${textToRewrite}\n"""`;
    },
  },
  {
    id: "grammar",
    label: "Fix Grammar",
    icon: IconAbc,
    prompt: (selectedText, documentContent) => {
      const textToFix = selectedText || documentContent;
      return `Analyze and fix all grammar, spelling, and punctuation errors in the following markdown text. First list the issues found, then provide the corrected version with markdown formatting preserved:\n\n"""\n${textToFix}\n"""`;
    },
  },
];

export default function AISidebar({
  selectedText = "",
  documentContent = "",
  onInsertText,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[2].id); // Default to llama3.2:3b
  const [localModels, setLocalModels] = useState([]);
  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch available local models on mount
  const fetchLocalModels = async () => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/ai/models`
      );
      const data = await res.json();
      setLocalModels(data.models?.map((m) => m.name) || []);
    } catch (error) {
      console.error("Failed to fetch models:", error);
    }
  };

  useEffect(() => {
    fetchLocalModels();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedText && isOpen) {
      setInputText(selectedText);
      inputRef.current?.focus();
    }
  }, [selectedText, isOpen]);

  // Check if model is available locally
  const isModelAvailable = (modelId) => {
    return localModels.some((m) => m.startsWith(modelId.split(":")[0]));
  };

  // Pull model if not available
  const pullModel = async (modelId) => {
    setIsPulling(true);
    setPullProgress("Starting download...");

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/ai/pull`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: modelId }),
        }
      );

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
          if (payload === "[DONE]") {
            setPullProgress("Download complete!");
            await fetchLocalModels();
            break;
          }
          try {
            const json = JSON.parse(payload);
            if (json.status) {
              const progress =
                json.completed && json.total
                  ? ` (${Math.round((json.completed / json.total) * 100)}%)`
                  : "";
              setPullProgress(`${json.status}${progress}`);
            }
          } catch {
            /* ignore */
          }
        }
      }
    } catch (error) {
      console.error("Failed to pull model:", error);
      setPullProgress("Download failed: " + error.message);
    } finally {
      setIsPulling(false);
      setTimeout(() => setPullProgress(""), 3000);
    }
  };

  const sendMessage = async (
    customPrompt = null,
    actionLabel = null,
    displayText = null
  ) => {
    const textToSend = customPrompt || inputText.trim();
    if (!textToSend || isLoading) return;

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: actionLabel
        ? `[${actionLabel}]\n${
            displayText || inputText || selectedText || "Full document"
          }`
        : textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    const assistantMessage = {
      id: Date.now() + 1,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      // Build message history: system message + all previous user/assistant messages + current user message
      const messageHistory = [
        {
          role: "system",
          content:
            "You are a helpful writing assistant. Be concise and helpful. When suggesting text, provide clear, actionable suggestions. Preserve markdown formatting when rewriting or fixing text.",
        },
        // Include previous messages for context (filtering out the temporary assistant message we just added)
        ...messages
          .filter((msg) => msg.id !== assistantMessage.id)
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        // Add the new user message
        { role: "user", content: textToSend },
      ];

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/ai/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: messageHistory,
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        // Check if aborted
        if (abortControllerRef.current?.signal.aborted) {
          reader.cancel();
          break;
        }

        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const payload = line.replace("data: ", "");

          if (payload === "[DONE]") break;

          try {
            const json = JSON.parse(payload);
            const text = json.message?.content || "";

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: msg.content + text }
                  : msg
              )
            );
          } catch {
            /* ignore broken chunks */
          }
        }
      }
    } catch (error) {
      // Don't show error message if it was manually aborted
      if (error.name === "AbortError") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id && !msg.content
              ? { ...msg, content: "(Stopped)" }
              : msg
          )
        );
      } else {
        console.error("AI request failed:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  content: "Sorry, I encountered an error. Please try again.",
                }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleActionClick = (action) => {
    // Use selected text, or input text, or fall back to full document
    const textForSelection = inputText.trim() || selectedText;

    // If no specific text selected, use full document content
    if (!textForSelection && !documentContent) return;

    // Generate prompt with both selected text and full document context
    const prompt = action.prompt(textForSelection, documentContent);

    // Show a truncated version in the chat for readability
    const displayText = textForSelection
      ? textForSelection.length > 100
        ? textForSelection.slice(0, 100) + "..."
        : textForSelection
      : "Analyzing full document...";

    sendMessage(prompt, action.label, displayText);
  };

  const handleCopy = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsert = (text) => {
    if (onInsertText) {
      onInsertText(text);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 btn btn-primary btn-sm rounded-r-none shadow-lg transition-all duration-300 ${
          isOpen ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
        aria-label="Toggle AI Assistant"
      >
        <IconSparkles size={18} />
        <IconChevronLeft size={14} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-base-100 shadow-2xl z-50 transition-transform duration-300 ease-out flex flex-col border-l border-base-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300 bg-linear-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center gap-2">
            <div>
              <h2 className="font-bold text-sm">ScribeAI</h2>
              <p className="text-xs text-base-content/60">Powered by Ollama</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`btn btn-ghost btn-sm btn-square ${
                showSettings ? "btn-active" : ""
              }`}
              aria-label="Settings"
            >
              <IconSettings size={16} />
            </button>
            <button
              onClick={clearChat}
              className="btn btn-ghost btn-sm btn-square"
              aria-label="Clear chat"
            >
              <IconTrash size={16} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-sm btn-square"
              aria-label="Close sidebar"
            >
              <IconChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Model Selector */}
        {showSettings && (
          <div className="p-3 border-b border-base-300 bg-base-200/30">
            <p className="text-xs text-base-content/60 mb-2">Select Model</p>
            <div className="space-y-2">
              {AVAILABLE_MODELS.map((model) => {
                const available = isModelAvailable(model.id);
                return (
                  <div
                    key={model.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedModel === model.id
                        ? "bg-primary/20 border border-primary/40"
                        : "bg-base-100 hover:bg-base-200 border border-transparent"
                    }`}
                    onClick={() => !isPulling && setSelectedModel(model.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {model.name}
                        </span>
                        {available ? (
                          <span className="badge badge-success badge-xs">
                            Ready
                          </span>
                        ) : (
                          <span className="badge badge-warning badge-xs">
                            Not installed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-base-content/50">
                        {model.description}
                      </p>
                    </div>
                    {!available && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          pullModel(model.id);
                        }}
                        disabled={isPulling}
                        className="btn btn-xs btn-ghost"
                        title="Download model"
                      >
                        {isPulling ? (
                          <IconLoader2 size={14} className="animate-spin" />
                        ) : (
                          <IconDownload size={14} />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {pullProgress && (
              <div className="mt-2 p-2 bg-info/10 rounded-lg">
                <p className="text-xs text-info">{pullProgress}</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="p-3 border-b border-base-300 bg-base-200/50">
          <p className="text-xs text-base-content/60 mb-2">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            {AI_ACTIONS.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                disabled={
                  isLoading ||
                  (!inputText.trim() && !selectedText && !documentContent)
                }
                className="btn btn-sm btn-outline gap-1 flex-1 min-w-fit"
              >
                <action.icon size={14} />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-base-content/50">
              <IconSparkles size={48} className="mb-4 opacity-30" />
              <p className="text-sm font-medium">Start a conversation</p>
              <p className="text-xs mt-1">
                Type a message or select text from your document
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat ${
                  msg.role === "user" ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble ${
                    msg.role === "user"
                      ? "chat-bubble-primary"
                      : "bg-base-200 text-base-content"
                  } max-w-[85%] overflow-hidden`}
                >
                  {msg.role === "assistant" ? (
                    <div className="max-w-none text-sm wrap-break-word overflow-x-auto prose prose-sm *:wrap-break-word [&_pre]:overflow-x-auto [&_code]:break-all [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1">
                      <ReactMarkdown>{msg.content || "..."}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="max-w-none text-sm whitespace-pre-wrap wrap-break-word">
                      <ReactMarkdown>{msg.content || "..."}</ReactMarkdown>
                    </div>
                  )}
                </div>
                {msg.role === "assistant" && msg.content && (
                  <div className="chat-footer opacity-50 flex gap-1 mt-1">
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="btn btn-ghost btn-xs"
                      title="Copy to clipboard"
                    >
                      {copiedId === msg.id ? (
                        <IconCheck size={12} />
                      ) : (
                        <IconCopy size={12} />
                      )}
                    </button>
                    <button
                      onClick={() => handleInsert(msg.content)}
                      className="btn btn-ghost btn-xs"
                      title="Insert into document"
                    >
                      <IconSend size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex items-center gap-2 text-base-content/50 text-sm">
              <IconLoader2 size={16} className="animate-spin" />
              <span>AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-base-300 bg-base-200/30">
          {selectedText && (
            <div className="mb-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs text-primary font-medium mb-1">
                Selected Text:
              </p>
              <p className="text-xs text-base-content/70 line-clamp-2">
                {selectedText}
              </p>
            </div>
          )}
          <div className="flex gap-2 items-center justify-center">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (isLoading) {
                    stopGeneration();
                  } else {
                    sendMessage();
                  }
                }
              }}
              placeholder="Ask AI to help with your writing..."
              className="textarea textarea-bordered flex-1 min-h-[60px] max-h-[120px] resize-none text-sm"
              disabled={isLoading}
            />
            {isLoading ? (
              <button
                onClick={stopGeneration}
                className="btn btn-error btn-square self-end"
                title="Stop generation"
              >
                <IconPlayerStop size={18} />
              </button>
            ) : (
              <button
                onClick={() => sendMessage()}
                disabled={!inputText.trim()}
                className="btn btn-primary btn-square self-end"
              >
                <IconSend size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
