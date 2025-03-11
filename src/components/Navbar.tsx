"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User; // assertion
  return (
    <nav className="p-3 md:py-6 md:px-20 shadow-md text-[#8a2be2]">
      <div className="container mx-auto flex md:flex-row justify-between items-center">
        <Link href="/" className="text-3xl font-bold md:mb-0">
          Anora
        </Link>
        {session ? (
          <>
            <span className="hidden md:block lg:block text-xl font-bold mr-4">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              onClick={() => signOut()}
              className="bg-[#8a2be2] hover:bg-[#7424c9] md:w-auto text-white"
            >
              <LogOut/>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full bg-[#8a2be2] hover:bg-[#7424c9] md:w-auto text-white">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
