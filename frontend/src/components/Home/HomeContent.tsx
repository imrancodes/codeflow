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
      <h1 className="text-6xl font-bold mb-6 font-code flex justify-center items-center">
        {">_ Code Together, Create Better"}
      </h1>

      <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
        The real-time collaborative code editor that brings your team together.
        Write, debug, and build amazing projects whether you're coding solo or
        with friends across the globe.
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
        <Rocket/>
      </Link>
    </div>
  );
};

export default HomeContent;
