import MonacoEditor from "@monaco-editor/react";
import { starterCode } from "./starterCode";
import { useState } from "react";
import CodeExecution from "./CodeExecution";
import Loader from "../ui/loader";

const Editor = ({ language }: { language: string }) => {
  const [value, setValue] = useState(starterCode[language] || "");

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

  return (
    <div className="flex flex-1">
      <div className="flex-1 min-w-0 mr-0.5">
        <MonacoEditor
          height="100%"
          language={language}
          theme="githubDark"
          value={value}
          beforeMount={handleEditorWillMount}
          onChange={(val) => setValue(val ?? "")}
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
          }}
          loading={<Loader className="fill-main size-14"/>}
        />
      </div>
      <div className="flex flex-col flex-shrink-0 w-1/3 min-w-[250px] bg-[#161921] p-2 h-full min-h-0">
        <CodeExecution code={value} language={language} />
      </div>
    </div>
  );
};

export default Editor;
