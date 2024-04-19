import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server'

export async function GET(request) {

    const url =  new URL(request.url)

    const searchParams = url.searchParams;

    const report = searchParams.get('getReport');


    if(report){

        try {

            const supabase = createClient()
            const { error, data: { user } } = await supabase.auth.getUser()
    
            if (error) return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 })
    
            const { id } = await prisma.user.findFirst({
                where: {
                    email: user.email
                },
                select: {
                    id: true
                }
            })
            if (!id) return new NextResponse(JSON.stringify({ message: "Invalid credentials or seesion expired" }), { status: 400 })
    
            const  userReport = await prisma.expense.findMany({
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
            

          const   expensesGroupedByDate = userReport.reduce((acc, expense) => {
                const date = expense.date.toISOString().split('T')[0]; // Extracting date part only
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(expense);
                return acc;
            }, {});


            const formattedExpenses = Object.keys(expensesGroupedByDate).map(dateString => {
                const date = new Date(dateString);
                const formattedDate = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
                return { date: formattedDate, expenses: expensesGroupedByDate[dateString] };
              });
    
            return new Response(JSON.stringify({ message: formattedExpenses}), {
                headers: {
                    "Content-Type": "application/json"
                },
                status: 200
            })
        } catch (error) {
            console.log(error);
            return new NextResponse(JSON.stringify({ message: 'something went wrong' }), { status: 400 })
        }


    }else{


        try {

            const supabase = createClient()
            const { error, data: { user } } = await supabase.auth.getUser()
    
            if (error) return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 })
    
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
                    id: true
                }
    
            })
    
            const ids = allUserBudget.map((item) => item.id)
    
            const expenses = await prisma.expense.findMany({
                where: {
                    budgetCategoryId: {
                        in: ids
                    }
                }
    
            })
    
            return new Response(JSON.stringify({ message: expenses }), {
                headers: {
                    "Content-Type": "application/json"
                },
                status: 200
            })
        } catch (error) {
            console.log(error);
            return new NextResponse(JSON.stringify({ message: 'something went wrong' }), { status: 400 })
        }
    
    

    }




   
}

export async function POST(request) {

    try {
        const supabase = createClient()

        const payload = await request.json()

        const { error, data: { user } } = await supabase.auth.getUser()


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