import { useState } from "react";
import { Button } from "../ui/button";

const CodeExecution = () => {
  const [input, setInput] = useState("");

  return (
    <div className="w-full bg-[#161921]">
      <textarea
        className="w-full p-2 text-white rounded-md bg-[#1b1e28]"
        placeholder="Enter input for your program..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
      />

      <div className="bg-[#1b1e28] p-2 rounded-md h-32 overflow-auto">
        output
      </div>

      <Button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        Run Code
      </Button>
    </div>
  );
};

export default CodeExecution;
