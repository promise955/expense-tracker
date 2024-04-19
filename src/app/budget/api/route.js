import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server'




export async function DELETE(request) {


    try {


        const url =  new URL(request.url)

        const searchParams = url.searchParams;

        const budgetId = searchParams.get('id');
        const userId = searchParams.get('user');


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

        // const budget = await prisma.budgetCategory.delete({
        //     where: { deleted: false, userId: id, id: budgetId },

        // })
        const budget = await prisma.budgetCategory.update({
            where: { deleted: false, userId: id, id: budgetId },
            data : {
                deleted : false
            }

        })


        return new Response(JSON.stringify({ message: 'Update Sucessfully' }), {
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
export async function PATCH(request) {


    try {


        const payload = await request.json()

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

        await prisma.budgetCategory.update({
            where: { deleted: false, userId: id, id: payload.id },
            data: {
                categoryname: payload.categoryname,
                monthyear: payload.monthyear,
                budgetamount: Number(payload.budgetamount),
            }
        })


        return new Response(JSON.stringify({ message: 'Update Sucessfully' }), {
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



export async function GET() {


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

        const budgets = await prisma.budgetCategory.findMany({
            where: { deleted: false, userId: id },
        })

        return new Response(JSON.stringify({ message: budgets }), {
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



export async function POST(request) {

    try {
        const supabase = createClient()

        const payload = await request.json()

        const { error, data: { user } } = await supabase.auth.getUser()
        console.log(error);

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


        await prisma.budgetCategory.create({
            data: {
                ...payload,
                userId: id,
                budgetamount: Number(payload.budgetamount)
            }
        })


        return new Response(JSON.stringify({ message: 'Budget Created Sucessfully' }), {
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