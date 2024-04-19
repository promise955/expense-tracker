'use server'
import { createClient } from '@/utils/supabase/client'
import prisma from '@/lib/prisma'


export default async function handle(request, response) {

    if (request.method !== 'POST') {
        response.status(500).json({ message: 'bad request' })
    }
    try {
        const supabase = createClient()

        const { email, password } = await request.body

        const { error, data: { user } } = await supabase.auth.signUp({ email: email, password: password })

        if (error) return response.status(400).json({ message: error.message })

        await prisma.user.create({
            data: {
                email: user.email
            }
        })


        return response.status(201).json({ message: 'Registration Successful' })


    } catch (error) {
        console.log(error);
        return response.status(400).json({ message: 'something went wrong' })
    }


}

