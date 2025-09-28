import { Button } from "../ui/button";
import { Save, Copy, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import type { Mode } from "./CodeEditor";
import { socket } from "./socket/socket";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@/api/useUser";

interface CodeEditorNavProps {
  roomId: string | null;
  mode: Mode;
}

const CodeEditorNav = ({ roomId, mode }: CodeEditorNavProps) => {
  const { data } = useUser();
  const navigate = useNavigate();

  const handlelinkCopy = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      toast.success("Copied");
    } else {
      toast.error("No room ID to copy");
    }
  };

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", roomId, data.user.name);
    toast.success("You left the room");
    navigate("/");
  };

  useEffect(() => {
    socket.on("userLeave", (message) => {
      toast(message, {
        position: "bottom-center",
      });
    });

    socket.on("userJoined", (message) => {
      toast(message, {
        position: "bottom-center",
      });
    });

    return () => {
      socket.off("userLeave");
      socket.off("userJoined");
    };
  }, []);

  return (
    <nav className="flex justify-between items-center pr-4 bg-[#101218]">
      <div className="flex items-center gap-50">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="size-15" />
          <h1 className="-m-3 font-code">CodeFlow</h1>
        </div>
        {mode === "friends" ? (
          <div className="flex items-center gap-4">
            <div className="border border-gray-800 rounded-md flex items-center">
              <div className="px-2">{roomId}</div>
              <Button
                title="Copy Room Id"
                onClick={handlelinkCopy}
                className="cursor-pointer bg-main hover:bg-main/80 text-black"
              >
                <Copy />
              </Button>
            </div>
            <Button
              title="Leave"
              className="bg-transparent hover:bg-gray-800 cursor-pointer border-white/20 border"
              onClick={handleLeaveRoom}
            >
              <LogOut />
              Leave
            </Button>
          </div>
        ) : null}
      </div>
      <div>
        <Button
          title="Save/Export This File"
          className="cursor-pointer bg-main text-black hover:bg-main/80"
        >
          <Save />
          Save/Export
        </Button>
      </div>
    </nav>
  );
};

export default CodeEditorNav;
