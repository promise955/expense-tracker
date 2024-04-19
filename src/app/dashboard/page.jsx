"use client";
import NavBar from "@/components/Nav";
import React from "react";
import { useAppContext } from "@/context/context";
import { readUserSession } from "@/lib/session";
import { useTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Expense from "@/components/Expense";
import { currencyFormatter, dateFormatter } from "@/utils/functions/utils";
import ExpenseAndBudgetChart from "@/components/ExpenseAndBudgetChart";
import { toast } from "sonner";
import DataService from "@/lib/fetch";

const Dashboard = () => {
  const { isUser, setUser } = useAppContext();
  const [loading, setLoading] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await DataService.getDataNoAuth("/dashboard/api");
      setExpenses(response);
      setLoading(false);
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const [expenseModal, setExpenseModal] = useState(false);
  const router = useRouter();

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
    <main className="min-h-screen flex flex-col bg-gradient-to-r from-purple-600 to-indigo-600">
      <NavBar />
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
      ) : (
        <div>
          {/* start of chart */}

          <div className="flex flex-wrap -mx-4">
            <div className="w-full  px-4 mb-6">
              <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
   
                    <div className="w-full px-3">
                      <p className="mb-0 font-sans font-semibold leading-normal text-sm">
                        Chart 1
                      </p>
                      <ExpenseAndBudgetChart />
                    </div>
         
              </div>
            </div>
          </div>

          {/* end of chart */}

          {/* expense list */}
          <div className="flex flex-wrap">
            <div className="w-full p-4">
              <div className="bg-white shadow-soft-xl rounded-2xl p-4 relative">
                <button
                  className="absolute top-1 right-0 mr-1 bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center btn"
                  onClick={() => setExpenseModal(true)}
                >
                  <i className="fas fa-plus mr-2"></i> Add New Expense
                </button>
                <p className="font-semibold mb-4">My Expenses</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {expenses?.map((expense, index) => (
                    <div
                      key={index}
                      className="w-full sm:w-auto md:w-full lg:w-auto xl:w-auto bg-gray-50 border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex flex-col">
                        <div className="flex justify-between mb-2">
                          <p className="font-semibold">Name:</p>
                          <p>{expense.description}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                          <p className="font-semibold">Amount:</p>
                          <p>{currencyFormatter(expense.amount)}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                          <p className="font-semibold">Month&Year:</p>
                          <p>{dateFormatter(expense.date)}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="font-semibold">Budget Balance</p>
                          <p>{currencyFormatter(0)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {expenseModal && <Expense onClose={() => setExpenseModal(false)} />}

          {/* end of expense list */}
        </div>
      )}
    </main>
  );
};

export default Dashboard;
