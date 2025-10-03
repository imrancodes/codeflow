import { useAiChat } from "@/api/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Ai = () => {
  const { mutate, isPending } = useAiChat();
  const [value, setValue] = useState("");

  const handleAiChat = (prompt: string) => {
    mutate(
      { prompt },
      {
        onSuccess: (data) => {
          console.log("AI response:", data.text);
        },
      }
    );
  };
  return (
    <div>
      <Input onChange={(e) => setValue(e.target.value)} />
      <Button onClick={() => handleAiChat(value)}>Chat</Button>
    </div>
  );
};

export default Ai;
