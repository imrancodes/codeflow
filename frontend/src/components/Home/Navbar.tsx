import type { UseMutationResult } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../ui/loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/");
      },
    });
    setOpen(false);
  };

  return (
    <>
      <nav className="flex justify-between items-center rounded-xl bg-white/5 backdrop-blur-md border border-white/20 shadow-lg max-w-6xl mx-auto pr-4">
        <Link to={"/"} className="flex justify-center items-center">
          <img src="/logo.png" alt="Logo" className="size-20" />
          <h1 className="text-2xl -ml-4 font-code">CodeFlow</h1>
        </Link>

        {isLoading ? (
          <div className="text-gray-300">
            <Loader className="fill-main" />
          </div>
        ) : data?.user ? (
          <div>
            <Button
              className="bg-transparent hover:bg-gray-800 cursor-pointer border-white/20 border"
              onClick={() => setOpen(true)}
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#161921] text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Are you sure?</DialogTitle>
            <DialogDescription className="text-gray-400">
              Do you want to logut?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white cursor-pointer"
            >
              No
            </Button>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
