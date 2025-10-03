import { useEffect, useState } from "react";
import { Users, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import type { Mode } from "./CodeEditor";
import Participants from "./sidebar/Participants";
import Ai from "./sidebar/Ai";
import { socket } from "./socket/socket";

export interface Participant {
  id: string;
  name: string;
}

export interface Message {
  role: "user" | "ai";
  text: string;
}


type SideBarButtons = "participants" | "ai";

const SideBar = ({ mode }: { mode: Mode }) => {
  const [isActive, setIsActive] = useState<SideBarButtons | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [aiMessages, setAiMessages] = useState<Message[]>([]);

  const handleSideBarActivation = (value: SideBarButtons) => {
    if (isActive === value) {
      setIsActive(null);
    } else {
      setIsActive(value);
    }
  };


  useEffect(() => {
    socket.on("participantsUpdate", (list: Participant[]) => {
      setParticipants(list);
    });

    return () => {
      socket.off("participantsUpdate");
    };
  }, []);

  return (
    <>
      <div className="w-[55px] bg-[#161921] mr-0.5">
        <div>
          {mode === "friends" ? (
            <Button
              title="Participants"
              className={`cursor-pointer w-full rounded-none bg-transparent py-6 ${
                isActive === "participants"
                  ? "bg-[#0d282e] hover:bg-[#0d282e] border-l-2 border-main"
                  : "bg-transparent hover:text-main"
              }`}
              onClick={() => handleSideBarActivation("participants")}
            >
              <Users className="size-6" />
            </Button>
          ) : null}
          <Button
            title="CodeFlow AI"
            className={`cursor-pointer w-full rounded-none bg-transparent py-6 ${
              isActive === "ai"
                ? "bg-[#0d282e] hover:bg-[#0d282e] border-l-2 border-main"
                : "bg-transparent hover:text-main"
            }`}
            onClick={() => handleSideBarActivation("ai")}
          >
            <Sparkles className="size-6" />
          </Button>
        </div>
      </div>
      {isActive && (
        <div className="w-90 bg-[#161921] mr-0.5 overflow-hidden">
          {isActive === "participants" ? (
            <Participants participants={participants} />
          ) : isActive === "ai" ? (
            <Ai messages={aiMessages} setMessages={setAiMessages} />
          ) : null}
        </div>
      )}
    </>
  );
};

export default SideBar;
