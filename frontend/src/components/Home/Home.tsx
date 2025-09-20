import DotGrid from "@/components/DotGrid";
import { useUser } from "@/api/useUser";
import { useSignOut } from "@/api/auth";
import Navbar from "./Navbar";
import HomeContent from "./HomeContent";

const Home = () => {
  const { data, isLoading } = useUser();
  const signOutMutation = useSignOut();

  return (
    <div className="w-full h-screen relative">
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
      <div className="relative z-1 pt-8 px-4">
        <Navbar
          data={data}
          signOutMutation={signOutMutation}
          isLoading={isLoading}
        />
        <div className="flex-1 flex items-center justify-center px-4">
          <HomeContent data={data} />
        </div>
      </div>
    </div>
  );
};

export default Home;
