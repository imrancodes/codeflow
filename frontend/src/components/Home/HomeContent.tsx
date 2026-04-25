import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface HomeContentProps {
  data?: {
    user?: User;
  } | null;
}

const HomeContent = ({ data }: HomeContentProps) => {
  return (
    <div className="hero-section mx-auto w-full max-w-5xl text-center py-6 sm:py-8 md:py-10">
      <h1 className="font-code mb-4 flex flex-col gap-y-2 text-center text-3xl font-bold leading-tight sm:mb-5 sm:text-4xl md:text-5xl lg:text-6xl">
        <span className="break-words">{">_ Code Together, Create Better"}</span>
        <span>— Powered by AI</span>
      </h1>

      <p className="mx-auto mb-7 max-w-3xl text-base leading-relaxed text-gray-300 sm:mb-8 sm:text-lg md:mb-10 md:text-xl">
        AI-powered real-time collaborative code editor that helps you and your
        team write, debug, and build amazing projects — whether solo or with
        friends across the globe.
      </p>
      <Link
        to={data?.user ? "/start" : "/signin"}
        className="relative inline-flex items-center justify-center px-5 py-2.5 text-base font-semibold text-black sm:px-8 sm:py-3 sm:text-lg
                    bg-gradient-to-r from-[#00ffc3] via-[#02e6a9] to-[#02b68c] 
                    rounded-xl shadow-lg shadow-[#00ffc340] 
                    hover:scale-105 hover:shadow-[#00ffc360] 
                    transition-all duration-300 ease-out gap-2"
      >
        Get Started
        <Rocket className="size-4 sm:size-5" />
      </Link>
    </div>
  );
};

export default HomeContent;
