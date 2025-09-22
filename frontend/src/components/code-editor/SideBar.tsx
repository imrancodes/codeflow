import { useEffect, useState } from "react";
import { File, Users, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import type { Mode } from "./CodeEditor";

type SideBarButtons = "explorer" | "participants" | "ai";

const SideBar = ({ mode }: { mode: Mode }) => {
  const [isActive, setIsActive] = useState<SideBarButtons | null>(null);

  const handleSideBarActivation = (value: SideBarButtons) => {
    if (isActive === value) {
      setIsActive(null);
    } else {
      setIsActive(value);
    }
  };

  useEffect(() => {
    console.log(isActive);
  }, [isActive]);

  return (
    <>
      <div className="w-[55px] bg-[#161921] mr-0.5">
        <div>
          <Button
            title="Explorer"
            className={`cursor-pointer w-full rounded-none bg-transparent py-6 ${
              isActive === "explorer"
                ? "bg-[#0d282e] hover:bg-[#0d282e] border-l-2 border-main"
                : "bg-transparent hover:text-main"
            }`}
            onClick={() => handleSideBarActivation("explorer")}
          >
            <File className="size-6" />
          </Button>
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
      <div
        className={`mr-0.5 ${
          isActive !== null ? "block" : "hidden"
        } w-90 bg-[#161921]`}
      ></div>
    </>
  );
};

export default SideBar;
