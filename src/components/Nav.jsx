"use client";
import React, { Suspense, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useAppContext } from "@/context/context";
import { createClient } from "@/utils/supabase/client";

const NavBar = () => {
  const [isPending, startTransition] = useTransition();

  const { isUser } = useAppContext();
  const [isLoggedIn, setLoggedIn] = useState(isUser);

  useEffect(() => {
    startTransition(async () => setLoggedIn(isUser));
  }, [isUser]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
  }
  return (
    <nav className="py-4 px-8 flex justify-between items-center lg:justify-end sm:justify-center">
      <div className="flex items-center">
        {!isLoggedIn && !isPending && (
          <>
            <a href="/login" className="btn text-white font-medium mx-2">
              Login
            </a>
            <a href="/register" className="btn text-white font-medium mx-2">
              Register
            </a>
          </>
        )}
        {(isLoggedIn || isPending) && (
          <>
            <a href="" className="btn text-white font-medium mx-2">
              {isPending ? "fetching user........" : isUser}
            </a>
            <Link href="/budget" className="btn text-white font-medium mx-2">
              Budget
            </Link>
            <Link href="/dashboard" className="btn text-white font-medium mx-2">
              Expense
            </Link>

            <button
              className="btn text-white font-medium mx-2"
              onClick={() => signOut()}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
