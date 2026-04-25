import DotGrid from "@/components/DotGrid";
import { useUser } from "@/api/useUser";
import { useSignOut } from "@/api/auth";
import Navbar from "./Navbar";
import HomeContent from "./HomeContent";

const Home = () => {
  const { data, isLoading } = useUser();
  const signOutMutation = useSignOut();

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute z-0 inset-0">
        <DotGrid
          dotSize={5}
          gap={15}
          baseColor="#373E3C"
          activeColor="#00ffc3"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>
      <div className="relative z-1 flex min-h-screen flex-col px-3 pt-4 pb-6 sm:px-4 sm:pt-6">
        <Navbar
          data={data}
          signOutMutation={signOutMutation}
          isLoading={isLoading}
        />
        <div className="flex flex-1 items-center justify-center px-1 sm:px-4 min-h-0">
          <HomeContent data={data} />
        </div>
      </div>
    </div>
  );
};

export default Home;
