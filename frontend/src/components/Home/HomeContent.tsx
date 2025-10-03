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
    <div className="hero-section text-center pt-60 max-[600px]:pt-40">
      <h1 className="text-6xl font-bold mb-6 font-code flex gap-y-3 flex-col text-center">
        <span>{">_ Code Together, Create Better"}</span>
        <span>— Powered by AI</span>
      </h1>

      <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
        AI-powered real-time collaborative code editor that helps you and your
        team write, debug, and build amazing projects — whether solo or with
        friends across the globe.
      </p>
      <Link
        to={data?.user ? "/start" : "/signin"}
        className="relative inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-black 
                    bg-gradient-to-r from-[#00ffc3] via-[#02e6a9] to-[#02b68c] 
                    rounded-xl shadow-lg shadow-[#00ffc340] 
                    hover:scale-105 hover:shadow-[#00ffc360] 
                    transition-all duration-300 ease-out gap-2"
      >
        Get Started
        <Rocket />
      </Link>
    </div>
  );
};

export default HomeContent;
