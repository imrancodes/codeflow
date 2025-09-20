import { Link } from "react-router-dom";

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

const HomeContent = ({data}: HomeContentProps) => {
  return (
    <div className="hero-section text-center pt-60 max-[600px]:pt-40">
      <h1 className="text-6xl font-bold mb-6 font-code">{"_> Code Together, Create Better"}</h1>

      <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
        The real-time collaborative code editor that brings your team together.
        Write, debug, and build amazing projects whether you're coding solo or
        with friends across the globe.
      </p>
      {/* {data?.user ? () : ()} */}
      <Link
        to={data?.user ? '/new' : "/signin"}
        className="bg-main hover:bg-[#02b68c] px-6 py-3 rounded-md text-xl text-black"
      >
        Get Started
      </Link>
    </div>
  );
};

export default HomeContent;
