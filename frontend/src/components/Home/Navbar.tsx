import type { UseMutationResult } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserResponse {
  user: User;
}

interface NavbarProps {
  data: UserResponse | undefined;
  signOutMutation: UseMutationResult<any, Error, void, unknown>;
  isLoading: boolean;
}

const Navbar = ({ data, signOutMutation, isLoading }: NavbarProps) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOutMutation.mutate();
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center rounded-xl bg-white/5 backdrop-blur-md border border-white/20 shadow-lg max-w-6xl mx-auto pr-4">
      <Link to={'/'} className="flex justify-center items-center">
        <img src="/logo.png" alt="Logo" className="size-20" />
        <h1 className="text-2xl -ml-4 font-code">CodeFlow</h1>
      </Link>

      {isLoading ? (
        <div className="text-gray-300">Loading...</div>
      ) : data?.user ? (
        <div>
          <Button
            className="bg-transparent hover:bg-gray-800 cursor-pointer border-white/20 border"
            onClick={handleSignOut}
            disabled={signOutMutation.isPending}
          >
            {signOutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-3">
          <Link
            to={"signin"}
            className="bg-transparent hover:bg-gray-800 cursor-pointer border-white/20 border px-4 py-1 rounded-md"
          >
            Log in
          </Link>
          <Link
            to={"signup"}
            className="bg-main text-black cursor-pointer hover:bg-main/80 px-4 py-1 rounded-md"
          >
            Sign up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
