import { useState } from "react";
import { File, Users, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

const SideBar = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  return (
    <div className="w-[55px] bg-[#161921]">
      <div>
        <Button title="Explorer" className="cursor-pointer w-full bg-transparent py-6 hover:text-main">
          <File className="size-6" />
        </Button>
        {}
        <Button title="Participants" className="cursor-pointer w-full bg-transparent py-6 hover:text-main">
          <Users className="size-6" />
        </Button>
        <Button title="CodeFlow AI" className="cursor-pointer w-full bg-transparent py-6 hover:text-main">
          <Sparkles className="size-6" />
        </Button>
      </div>
      <div></div>
      <div></div>
    </div>
  );
};

export default SideBar;
