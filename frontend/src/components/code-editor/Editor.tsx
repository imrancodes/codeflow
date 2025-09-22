import MonacoEditor from "@monaco-editor/react";

const Editor = ({ language }: { language: string }) => {
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
    <div className="flex-1 flex flex-col">
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          width="60vw"
          defaultLanguage={language}
          theme="githubDark"
          beforeMount={handleEditorWillMount}
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
        />
      </div>
    </div>
  );
};

export default Editor;
