import MonacoEditor from "@monaco-editor/react";
import { useEffect, useMemo, useRef } from "react";
import CodeExecution from "./CodeExecution";
import Loader from "../ui/loader";
import HtmlCodeExecution from "./HtmlCodeExecution";
import { socket } from "./socket/socket";
import { useUser } from "@/api/useUser";
import { fetchInlineCompletion } from "@/api/ai";

interface EditorProps {
  language: string;
  roomId: string | null;
  code: string,
  setCode: (code: string) => void
}

const Editor = ({
  language,
  roomId,
  code: sharedCode,
  setCode: setSharedCode,
}: EditorProps) => {
  const { data } = useUser();
  const providerDisposeRef = useRef<null | (() => void)>(null);
  const inFlightAbortRef = useRef<AbortController | null>(null);
  const requestSeqRef = useRef(0);
  const lastRequestAtRef = useRef(0);
  const cacheRef = useRef<Map<string, { value: string; at: number }>>(
    new Map()
  );

  const handleCode = (newValue: string | undefined) => {
    const valueToSet = newValue ?? "";
    setSharedCode(valueToSet);
    socket.emit("codeSync", roomId, valueToSet);
  };

  useEffect(() => {
    socket.emit("joinRoom", roomId, data.user.name);

    socket.on("updateCode", (code) => {
      setSharedCode(code);
    });

    return () => {
      socket.off("updateCode");
    };
  }, [roomId, data.user.name]);

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme("githubDark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "8b949e", fontStyle: "italic" },
        { token: "keyword", foreground: "ff7b72" },
        { token: "string", foreground: "a5d6ff" },
        { token: "number", foreground: "79c0ff" },
        { token: "identifier", foreground: "ffa657" },
        { token: "type", foreground: "7ee787" },
      ],
      colors: {
        "editor.background": "#1b1e28",
        "editor.foreground": "#e6edf3",
        "editorLineNumber.foreground": "#7d8590",
        "editorLineNumber.activeForeground": "#e6edf3",
        "editor.selectionBackground": "#264f78",
        "editorCursor.foreground": "#e6edf3",
      },
    });
  };

  const normalizedLanguage = useMemo(() => {
    // Monaco uses "javascript"/"typescript"/"python"/etc; keep as-is but map common aliases.
    if (language === "js") return "javascript";
    if (language === "ts") return "typescript";
    return language;
  }, [language]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Clean up old provider if language changes / remount happens.
    if (providerDisposeRef.current) {
      providerDisposeRef.current();
      providerDisposeRef.current = null;
    }

    // Enable inline suggestions in Monaco.
    try {
      editor.updateOptions({
        inlineSuggest: { enabled: true },
        suggest: { preview: true },
      });
    } catch {
      // ignore
    }

    // Tab to accept inline suggestion (Copilot-like).
    // If no inline suggestion is active, Monaco will keep default behavior.
    try {
      editor.addCommand(monaco.KeyCode.Tab, () => {
        editor.trigger("keyboard", "editor.action.inlineSuggest.commit", {});
      });
    } catch {
      // ignore
    }

    const disposable = monaco.languages.registerInlineCompletionsProvider(
      normalizedLanguage,
      {
        provideInlineCompletions: async (model: any, position: any, _context: any, token: any) => {
          // If Monaco canceled, return nothing.
          if (token?.isCancellationRequested) {
            return { items: [], dispose: () => {} };
          }

          const fullText: string = model.getValue();
          const offset: number = model.getOffsetAt(position);

          // Limit context to keep latency/cost down.
          const prefix = fullText.slice(Math.max(0, offset - 4000), offset);
          const suffix = fullText.slice(offset, Math.min(fullText.length, offset + 1000));

          // Avoid spamming calls for empty files / tiny context.
          if (prefix.trim().length < 2) {
            return { items: [], dispose: () => {} };
          }

          // Only suggest when cursor is at end of line or after whitespace.
          const lineContent: string = model.getLineContent(position.lineNumber);
          const isEol = position.column >= (lineContent.length + 1);
          const prevChar = prefix.at(-1) ?? "";
          if (!isEol && prevChar && !/\s|[({\[=,:;]/.test(prevChar)) {
            return { items: [], dispose: () => {} };
          }

          // Debounce more aggressively (protect quota / cost).
          await new Promise((r) => setTimeout(r, 700));
          if (token?.isCancellationRequested) {
            return { items: [], dispose: () => {} };
          }

          // Cooldown: never call more often than every 2 seconds.
          const now = Date.now();
          if (now - lastRequestAtRef.current < 2000) {
            return { items: [], dispose: () => {} };
          }

          // Tiny cache: reuse completion for same context briefly.
          const cacheKey = `${normalizedLanguage}::${prefix.slice(-1200)}::${suffix.slice(0, 200)}`;
          const cached = cacheRef.current.get(cacheKey);
          if (cached && now - cached.at < 20_000 && cached.value.trim()) {
            const range = new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            );
            return {
              items: [{ insertText: cached.value, range }],
              dispose: () => {},
            };
          }

          // Cancel previous request.
          inFlightAbortRef.current?.abort();
          const abort = new AbortController();
          inFlightAbortRef.current = abort;

          const mySeq = ++requestSeqRef.current;
          lastRequestAtRef.current = now;

          try {
            const data = await fetchInlineCompletion(
              {
                language: normalizedLanguage,
                prefix,
                suffix,
                maxTokens: 128,
              },
              abort.signal
            );

            // If a newer request happened, ignore this one.
            if (mySeq !== requestSeqRef.current) {
              return { items: [], dispose: () => {} };
            }

            const completion = (data?.completion ?? "").replace(/\r\n/g, "\n");
            if (!completion.trim()) {
              return { items: [], dispose: () => {} };
            }

            cacheRef.current.set(cacheKey, { value: completion, at: Date.now() });

            // Insert at cursor.
            const range = new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            );

            return {
              items: [
                {
                  insertText: completion,
                  range,
                },
              ],
              dispose: () => {},
            };
          } catch (e: any) {
            // Ignore abort errors and transient failures.
            if (e?.name === "AbortError") {
              return { items: [], dispose: () => {} };
            }
            return { items: [], dispose: () => {} };
          }
        },
        freeInlineCompletions: () => {},
      }
    );

    providerDisposeRef.current = () => {
      try {
        disposable?.dispose?.();
      } catch {
        // ignore
      }
    };
  };

  return (
    <div className="flex flex-1">
      <div className="flex-1 min-w-0 mr-0.5">
        <MonacoEditor
          height="100%"
          language={normalizedLanguage}
          theme="githubDark"
          value={sharedCode}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          onChange={handleCode}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontFamily:
              "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
            inlineSuggest: { enabled: true },
          }}
          loading={<Loader className="fill-main size-14" />}
        />
      </div>
      <div
        className={`flex flex-col flex-shrink-0 w-1/3 min-w-[250px] bg-[#161921] ${
          language === "html" ? "p-0" : "p-2"
        } h-full min-h-0`}
      >
        {language === "html" ? (
          <HtmlCodeExecution code={sharedCode} />
        ) : (
          <CodeExecution
            code={sharedCode}
            language={language}
            roomId={roomId}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
