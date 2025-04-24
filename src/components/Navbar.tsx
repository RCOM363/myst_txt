"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { CircleUserRound, LogOut, Trash2 } from "lucide-react";
import axios, { AxiosError } from "axios";

import { ModeToggle } from "./Toggle";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User; // assertion

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete<ApiResponse>("/api/delete-account");
      toast.success(response.data.message);
      signOut();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error updating check profanity status", {
        description: axiosError.response?.data.message,
      });
    }
  };

  return (
    <nav className="p-3 md:py-6 md:px-20 shadow-md text-[#8a2be2]">
      <div className="container mx-auto flex md:flex-row justify-between items-center">
        {/* logo */}
        <Link href="/" className="text-3xl font-bold md:mb-0">
          MystTxt
        </Link>
        {/* welcome text */}
        {session && (
          <span className="hidden md:block lg:block text-xl font-bold mr-4">
            Welcome, {user?.username || user?.email}
          </span>
        )}
        <div className="flex items-center gap-2">
          {/* theme toggle */}
          <ModeToggle />
          {session ? (
            // account options
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#8a2be2] hover:bg-[#7424c9] text-white">
                  <CircleUserRound /> Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* logout */}
                <DropdownMenuItem onClick={() => signOut()}>
                  <Button variant={"ghost"}>
                    <LogOut />
                    Logout
                  </Button>
                </DropdownMenuItem>
                {/* delete account */}
                <DropdownMenuItem>
                  {/* alert dialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant={"ghost"}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 /> Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-700 dark:bg-red-800 hover:bg-red-800 dark:hover:bg-red-900 text-white"
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/sign-in">
              <Button className="w-full bg-[#8a2be2] hover:bg-[#7424c9] md:w-auto text-white">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
