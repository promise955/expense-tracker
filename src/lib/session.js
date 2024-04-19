'use server'
import { createClient } from "@/utils/supabase/server"

export async function readUserSession() {

    const supabase =  createClient()
    const { data } = await supabase.auth.getUser()
    return data


}