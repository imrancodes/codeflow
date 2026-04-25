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
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-xl border border-white/20 bg-white/5 px-2 pr-3 shadow-lg backdrop-blur-md sm:px-3 sm:pr-4">
        <Link to={"/"} className="flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="size-14 sm:size-16 md:size-20" />
          <h1 className="-ml-2 text-lg font-code sm:-ml-3 sm:text-xl md:-ml-4 md:text-2xl">CodeFlow</h1>
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
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
            <Link
              to={"signin"}
              className="cursor-pointer rounded-md border border-white/20 bg-transparent px-3 py-1 hover:bg-gray-800 sm:px-4"
            >
              Log in
            </Link>
            <Link
              to={"signup"}
              className="cursor-pointer rounded-md bg-main px-3 py-1 text-black hover:bg-main/80 sm:px-4"
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
