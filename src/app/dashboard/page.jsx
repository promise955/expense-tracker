"use client";
import NavBar from "@/components/Nav";
import React from "react";
import { useAppContext } from "@/context/context";
import { readUserSession } from "@/lib/action";
import { useTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Expense from "@/components/Expense";
import { currencyFormatter, dateFormatter } from "@/utils/functions/utils";
import ExpenseAndBudgetChart from "@/components/ExpenseAndBudgetChart";
import { toast } from "sonner";
import DataService from "@/lib/fetch";
import ExpensePieChart from "@/components/ExpensePiechart";

const Dashboard = () => {
  const router = useRouter();
  const { isUser, setUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
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
    if (!expenseModal) {
      fetchExpenses();
    }
  }, [expenseModal]);

  useEffect(() => {
    const getUserAndRedirect = async () => {
      if (!isUser) {
        try {
          const { user } = await readUserSession();
          setUser(user.email);
          router.prefetch("/dashboard");
        } catch (error) {
          router.replace("/login");
        }
      }
    };

    getUserAndRedirect();
  }, [isUser, setUser, router]);

  return (
    <>
      <NavBar />
      <main className="min-h-screen flex flex-col bg-gradient-to-r from-purple-600 to-indigo-600">
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
              <div className="w-full md:w-1/2 px-4 mb-6">
                <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
                  <div className="flex-auto p-4">
                    <div className="flex flex-row -mx-3">
                      <div className="w-full px-3">
                        <p className="mb-0 font-sans font-semibold leading-normal text-sm">
                        Expenses
                        </p>
                     
                        <ExpensePieChart />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 px-4 mb-6">
                <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
                  <div className="flex-auto p-4">
                    <div className="flex flex-row -mx-3">
                      <div className="w-full px-3">
                        <p className="mb-0 font-sans font-semibold leading-normal text-sm">
                          
                          Sum of Expense and budget
                        </p>
                    
                        <ExpenseAndBudgetChart />
                      </div>
                    </div>
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
                        className="w-full sm:w-auto md:w-full lg:w-auto xl:w-auto bg-gray-800 border border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex flex-col">
                          <div className="flex justify-between mb-2">
                            <p className="font-semibold text-blue-300">Name:</p>
                            <p className="text-white">{expense.description}</p>
                          </div>
                          <div className="flex justify-between mb-2">
                            <p className="font-semibold text-green-300">
                              Amount:
                            </p>
                            <p className="text-white">
                              {currencyFormatter(expense.amount)}
                            </p>
                          </div>
                          <div className="flex justify-between mb-2">
                            <p className="font-semibold text-yellow-300">
                              Month & Year:
                            </p>
                            <p className="text-white">
                              {dateFormatter(expense.date)}
                            </p>
                          </div>
                          <div className="flex justify-between mb-2">
                            <p className="font-semibold text-teal-300">
                              Budget Category:
                            </p>
                            <p className="text-white">
                              {expense.budgetName}
                            </p>
                          </div>
                          <div className="flex justify-between mb-2">
                            <p className="font-semibold text-purple-300">
                              Budget Amount:
                            </p>
                            <p className="text-white">
                              {currencyFormatter(expense.budgetAmount)}
                            </p>
                          </div>
                          <div className="flex justify-between mb-2">
                            <p className="font-semibold text-red-300">
                              Budget Balance:
                            </p>
                            <p className="text-white">
                              {currencyFormatter(expense.budgetBalance)}
                            </p>
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
    </>
  );
};

export default Dashboard;
