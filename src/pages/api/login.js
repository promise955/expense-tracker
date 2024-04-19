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


        const { error, data: { user } } = await supabase.auth.signInWithPassword({ email: email, password: password })

        if (error) return response.status(400).json({ message: error.message })

        const id = await prisma.user.findFirst({
            where: {
                email: user.email
            },
            select: {
                id: true
            }
        })

        //if (!id) return response.status(400).json({ message: 'Invalid credentials' })

        return response.status(200).json({ message: user })


    } catch (error) {
        console.log(error);
        return response.status(400).json({ message: 'something went wrong' })
    }


}

