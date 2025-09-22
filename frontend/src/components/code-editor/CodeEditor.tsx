import { useSearchParams } from "react-router-dom";
import CodeEditorNav from "./CodeEditorNav";
import SideBar from "./SideBar";

const CodeEditor = () => {
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("roomid");
  const mode = searchParams.get("mode");
  const language = searchParams.get("language");

  return (
    <div className="bg-black h-screen flex flex-col">
      <CodeEditorNav roomId={roomId} mode={mode} />
      <div className="bg-black h-[1px]" />
      <div className="flex flex-1">
        <SideBar />
      </div>
    </div>
  );
};

export default CodeEditor;
