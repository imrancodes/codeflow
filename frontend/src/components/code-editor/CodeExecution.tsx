import { useState } from "react";
import { Button } from "../ui/button";
import { useExecuteCode } from "@/api/execution";
import { Play } from "lucide-react";
import Loader from "../ui/loader";

const CodeExecution = ({ code, language }: { code: string, language:string }) => {
  const [input, setInput] = useState("");
  const { mutate, data, isPending } = useExecuteCode();

  const languageToId: Record<string, number> = {
    javascript: 102,
    python: 109,
    cpp: 105,
    java: 91,
    typescript: 101,
    csharp: 51,
    php: 98,
  };

  const runCode = () => {
    const id = languageToId[language]
    mutate({
      id,
      sourceCode: code,
      input,
    });
  };

  const output = data?.stdout ? data.stdout.split("\n") : [];
  const error = data?.stderr;

  return (
    <div className="w-full h-full flex flex-col bg-[#161921] min-h-0">
      <textarea
        className="w-full p-2 text-white rounded-md bg-[#1b1e28] focus:outline-white/20 focus:outline-2 shrink-0"
        placeholder="Enter input for your program..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
      />
      <Button
        onClick={runCode}
        className="bg-main px-4 py-2 text-black rounded-md w-fit hover:bg-main/80 my-4 cursor-pointer flex gap-1 items-center justify-center shrink-0"
        disabled={isPending}
      >
        {isPending ? (
          <>
          <Loader className="fill-black"/>
          Running...
          </>
        ) : (
          <>
            <Play />
            Run Code
          </>
        )}
      </Button>

      <div
        className={`flex-1 p-2 rounded-md overflow-auto bg-[#1b1e28] border ${
          error ? "border-red-500" : "border-white/20"
        }`}
      >
        {error ? (
          <pre className="text-red-500 whitespace-pre-wrap break-words m-0">
            {error}
          </pre>
        ) : isPending ? (
          <pre className="text-gray-400">Executing...</pre>
        ) : output && output.length > 0 ? (
          output.map((line: string, i: number) => <div key={i}>{line}</div>)
        ) : (
          <pre className="text-gray-400">Your output will be shown here</pre>
        )}
      </div>
    </div>
  );
};

export default CodeExecution;
