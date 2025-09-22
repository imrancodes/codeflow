import { useSearchParams } from "react-router-dom";
import CodeEditorNav from "./CodeEditorNav";
import SideBar from "./SideBar";
import Editor from "./Editor";

export type Mode = "friends" | "solo";

const CodeEditor = () => {
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("roomid");
  const rawMode = searchParams.get("mode");
  const language = searchParams.get("language") ?? "javascript";

  const mode: Mode =
    rawMode === "friends" || rawMode === "solo" ? rawMode : "solo";

  return (
    <div className="bg-black h-screen flex flex-col">
      <CodeEditorNav roomId={roomId} mode={mode} />
      <div className="bg-black h-[2px]" />
      <div className="flex flex-1">
        <SideBar mode={mode} />
        <Editor language={language} />
      </div>
      <div className="bg-black h-[2px]" />
    </div>
  );
};

export default CodeEditor;
