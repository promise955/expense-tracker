import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server'
import { readUserSession } from "@/lib/action";

export async function GET(request, response) {


    const { user, error } = await readUserSession()

    if (error) return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 })

    const url = new URL(request.url)
    const searchParams = url.searchParams;
    const report = searchParams.get('getReport');

    if (report) {

        try {

            const { id } = await prisma.user.findFirst({
                where: {
                    email: user.email
                },
                select: {
                    id: true
                }
            })
            if (!id) return new NextResponse(JSON.stringify({ message: "Invalid credentials or seesion expired" }), { status: 400 })


            const userReport = await prisma.expense.findMany({
                where: {
                    budgetCategory: {
                        userId: id
                    }
                },
                include: {
                    budgetCategory: true,
                },
                orderBy: { date: 'asc' }
            });


            const expensesGroupedByDate = userReport.reduce((acc, expense) => {
                const date = expense.date.toISOString().split('T')[0];
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(expense);
                return acc;
            }, {});

            const expensesGroupedName = userReport.reduce((acc, expense) => {
                const budgetCategory  = expense.budgetCategory.categoryname;
                acc[budgetCategory] = [...(acc[budgetCategory] || []), expense];
                return acc;
            }, {});

  

            const formattedBudgetPieChart = Object.keys(expensesGroupedName).map(budgetCategory => {
                const budgetSum = expensesGroupedName[budgetCategory].reduce((sum, expense) => sum + expense.budgetCategory.budgetamount, 0);
                return {
                    budgetCategory: budgetCategory,
                    //budgets: expensesGroupedByDate[budgetCategory].map(expense => expense.budgetCategory),
                    budgetSum: budgetSum
                };
            });

            const formattedExpenses = Object.keys(expensesGroupedByDate).map(dateString => {
                const date = new Date(dateString);
                const formattedDate = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;

                const expensesSum = expensesGroupedByDate[dateString].reduce((sum, expense) => sum + expense.amount, 0);

                const budgetSum = expensesGroupedByDate[dateString].reduce((sum, expense) => sum + expense.budgetCategory.budgetamount, 0);

                return {
                    date: formattedDate,
                    expenses: expensesGroupedByDate[dateString].map(expense => expense.description),
                    expensesSum: expensesSum,
                    budgetSum: budgetSum
                };
            });
            
  
            return new Response(JSON.stringify({
                message: {
                    formattedExpenses: formattedExpenses, formattedBudgetPieChart: formattedBudgetPieChart
                }
            }), {
                headers: {
                    "Content-Type": "application/json"
                },
                status: 200
            })
        } catch (error) {
            console.log(error);
            return new NextResponse(JSON.stringify({ message: 'something went wrong' }), { status: 400 })
        }


    } else {


        try {

            const { id } = await prisma.user.findFirst({
                where: {
                    email: user.email
                },
                select: {
                    id: true
                }
            })

            if (!id) return new NextResponse(JSON.stringify({ message: "Invalid credentials or seesion expired" }), { status: 400 })

            const allUserBudget = await prisma.budgetCategory.findMany({
                where: { userId: id },
                select: {
                    id: true,
                    budgetamount: true
                }

            })
            const ids = allUserBudget.map((item) => item.id)

            const expenses = await prisma.expense.findMany({
                where: {
                    budgetCategoryId: {
                        in: ids
                    }
                },
                orderBy: { date: 'asc' }

            })


            const newexpenses = expenses.map((expense) => {
                const budgetCategory = allUserBudget.find(item => item.id === expense.budgetCategoryId);
                expense.budgetBalance = budgetCategory ? budgetCategory.budgetamount - expense.amount : 0;
                expense.budgetAmount = budgetCategory ? budgetCategory.budgetamount : 0;

                return expense

            })


            return new Response(JSON.stringify({ message: newexpenses }), {
                headers: {
                    "Content-Type": "application/json"
                },
                status: 200
            })
        } catch (error) {
            console.log(error, 'error');
            return new NextResponse(JSON.stringify({ message: 'something went wrong' }), { status: 400 })
        }



    }





}

export async function POST(request) {

    try {
        const { user, error } = await readUserSession()
        const payload = await request.json()

        if (error) return new NextResponse(JSON.stringify({ message: "Invalid request" }), { status: 400 })

        const { id } = await prisma.user.findFirst({
            where: {
                email: user.email
            },
            select: {
                id: true
            }
        })

        if (!id) return new NextResponse(JSON.stringify({ message: 'Invalid credentials or seesion expired' }), { status: 400 })

        await prisma.expense.create({
            data: {
                date: payload.date,
                description: payload.description,
                amount: Number(payload.amount),
                budgetCategoryId: payload.budget
            }
        })


        return new Response(JSON.stringify({ message: 'Budget Created Sucessfully' }), {
            headers: {
                "Content-Type": "application/json"
            },
            status: 201
        })


    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ message: 'something went wrong' }), { status: 400 })
    }

}