'use client'
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NavBar from "@/components/Nav";
import { useAppContext } from "@/context/context";
import { readUserSession } from "@/lib/action";
import { useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Home() {

  const { isUser, setUser } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    const getUserAndRedirect = async () => {
      if (!isUser) {
        const { user } = await readUserSession();
        if (user) {
          setUser(user.email);

          router.push('/dashboard')
        } else {

          router.push('/login');
        }
      }
    };

    getUserAndRedirect();
  }, [isUser, setUser, router]);

  return (
    <>

      <NavBar />
      <main className="min-h-screen flex flex-col bg-gradient-to-r from-purple-600 to-indigo-600">


        <Header />
        |<Footer />
      </main>

    </>
  );
}
