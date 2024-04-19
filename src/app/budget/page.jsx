"use client";
import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import NavBar from "@/components/Nav";
import BudgetCard from "@/components/BudgetCard";
import EditBudgetModal from "@/components/EditBudgetModal";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/context";
import DataService from "@/lib/fetch";
import prisma from "@/lib/prisma";
import { readUserSession } from "@/lib/session";

const BudgetCategory = () => {
  const router = useRouter();

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const { isUser, setUser } = useAppContext();

  const fetchBudgets = async () => {
    try {
      const budgets = await DataService.getDataNoAuth("/budget/api");
      setBudgets(budgets);
      setLoading(false);
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    const getUserAndRedirect = async () => {
      if (!isUser) {
        const { user } = await readUserSession();
        if (user) {
          setUser(user.email);
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      }
    };

    getUserAndRedirect();
  }, [isUser, setUser, router]);

  return (
    <div className="w-full px-6 py-6 mx-auto min-h-screen flex flex-col bg-gradient-to-r from-purple-600 to-indigo-600">
      <NavBar />
      <div className="flex justify-start">
        <div className="w-full">
          <div className="flex justify-between mb-8">
            <h2 className="text-2xl font-semibold text-white">Your Budgets</h2>
            <button
              className="bg-purple-600 hover:bg-black-500 text-white font-semibold px-4 py-2 rounded-lg"
              onClick={() => setEditModal(true)}
            >
              Create New Budget
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="flex flex-col items-center justify-center flex-grow">
            <svg
              className="animate-spin h-10 w-10 text-blue-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 4.418 3.582 8 8 8v-4zm14-1.162A7.963 7.963 0 0120 12h4c0 4.418-3.582 8-8 8v-4z"
              ></path>
            </svg>
            <p className="text-white text-4xl font-bold">Loading...</p>
          </div>
        </div>
      ) : budgets.length === 0 ? (
        <header className="flex flex-col items-center justify-center flex-grow">
          <div className="w-2/3 text-center">
            <h1 className="text-white text-4xl font-bold mb-4">
              No Record Found
            </h1>
          </div>
          <div className="relative w-2/3 h-80">
            <Image
              src={`${window.location.origin}/expense.svg`}
              alt="Expense Tracker"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </header>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {budgets?.length > 0 &&
              budgets?.map((budget, index) => (
                <BudgetCard budget={budget} key={index} />
              ))}
          </div>
        </div>
      )}
      {editModal && <EditBudgetModal onClose={() => setEditModal(false)} />}
    </div>
  );
};

export default BudgetCategory;
