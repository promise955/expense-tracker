
import { createClient } from '@/utils/supabase/client'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request, response) {

    try {
        const supabase = createClient()

        const { email, password } = await request.body

        const { error, data: { user } } = await supabase.auth.signUp({
            email: email, password: password,

            options: {
                emailRedirectTo: 'https://expense-tracker-orpin-eight-21.vercel.app/error',
            },
        })

        if (error) return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 })

        await prisma.user.create({
            data: {
                email: user.email
            }
        })

        return new NextResponse(JSON.stringify({ message:  'Registration Successful' }), { status: 400 })


    } catch (error) {
  ;
        return   new NextResponse(JSON.stringify({ message: error.message }), { status: 500 })
    }


}

