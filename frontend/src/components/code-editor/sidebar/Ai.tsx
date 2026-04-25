import { useAiChat } from "@/api/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { Message } from "../SideBar";

type ContentSegment =
  | { type: "text"; value: string }
  | { type: "code"; value: string; language: string };

const cleanTextFormattingArtifacts = (input: string) => {
  return input
    .replace(/^[-*_]{3,}\s*$/gm, "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2") 
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const parseMessageContent = (text: string): ContentSegment[] => {
  const segments: ContentSegment[] = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]+)?\n?([\s\S]*?)```/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const cleanedText = cleanTextFormattingArtifacts(
        text.slice(lastIndex, match.index)
      );
      segments.push({
        type: "text",
        value: cleanedText,
      });
    }

    segments.push({
      type: "code",
      language: (match[1] || "code").toLowerCase(),
      value: (match[2] || "").trimEnd(),
    });

    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    const cleanedText = cleanTextFormattingArtifacts(text.slice(lastIndex));
    segments.push({
      type: "text",
      value: cleanedText,
    });
  }

  if (!segments.length) {
    return [{ type: "text", value: cleanTextFormattingArtifacts(text) }];
  }

  return segments.filter(
    (segment) => segment.type === "code" || segment.value.length > 0
  );
};

const Ai = ({
  messages,
  setMessages,
}: {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) => {
  const { mutate, isPending } = useAiChat();
  const [value, setValue] = useState("");
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);

  const copyCode = async (code: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedBlockId(blockId);
      window.setTimeout(() => {
        setCopiedBlockId((prev) => (prev === blockId ? null : prev));
      }, 1400);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleAiChat = (prompt: string) => {
    if (!prompt.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: prompt }]);

    setMessages((prev) => [...prev, { role: "ai", text: "..." }]);

    mutate(
      { prompt },
      {
        onSuccess: (data) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated.pop();
            return [...updated, { role: "ai", text: data.text }];
          });
          setValue("");
        },
      }
    );
  };

  const conversation = useMemo(() => messages, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-700 bg-[#161921] px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-main" />
          <h2 className="text-base font-semibold">CodeFlow AI Assistant</h2>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Ask for code help, debugging, and optimized solutions.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#0f1117] p-3 text-sm custom-scroller">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`w-fit max-w-[92%] rounded-xl shadow ${
                msg.role === "user"
                  ? "bg-[#2f2f31] px-3 py-2 text-white"
                  : "bg-[#1a1f2b] px-3 py-2 text-gray-100"
              }`}
            >
              {msg.role === "ai" && msg.text === "..." ? (
                <span className="animate-pulse text-sm text-gray-300">Thinking...</span>
              ) : msg.role === "ai" ? (
                <div className="space-y-2">
                  {parseMessageContent(msg.text).map((segment, segmentIndex) => {
                    if (segment.type === "text") {
                      return (
                        <p
                          key={`${index}-text-${segmentIndex}`}
                          className="whitespace-pre-wrap leading-relaxed text-[13px]"
                        >
                          {segment.value}
                        </p>
                      );
                    }

                    const blockId = `${index}-${segmentIndex}`;
                    const isCopied = copiedBlockId === blockId;

                    return (
                      <div
                        key={`${index}-code-${segmentIndex}`}
                        className="overflow-hidden rounded-lg border border-gray-700 bg-[#0b0f17]"
                      >
                        <div className="flex items-center justify-between border-b border-gray-700 bg-[#121826] px-3 py-1.5">
                          <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                            {segment.language}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyCode(segment.value, blockId)}
                            className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] text-gray-300 transition hover:bg-gray-700 hover:text-white"
                          >
                            {isCopied ? (
                              <>
                                <Check className="size-3.5" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="size-3.5" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-gray-100">
                          <code>{segment.value}</code>
                        </pre>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-[13px] leading-relaxed">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 flex items-center gap-2 border-t border-gray-700 bg-[#161921] p-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask anything about your code..."
          className="flex-1 bg-gray-800 text-white border-gray-600 outline-0 focus-visible:ring-main focus-visible:ring-1 focus:border-0"
          onKeyDown={(e) => e.key === "Enter" && handleAiChat(value)}
        />
        <Button
          disabled={isPending}
          onClick={() => handleAiChat(value)}
          className="bg-main text-black hover:bg-main/80 cursor-pointer"
        >
          {isPending ? "Thinking..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default Ai;
