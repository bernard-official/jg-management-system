import React from 'react'
import { createClient } from '@/lib/supabase/clients' 

async function page() {
    const supabase = await createClient()
    const {data: countries} = supabase.from('countries').select()
  return (
    <>
    <div>Countries</div>
    <div>{countries.data}</div>
    </>
  )
}

export default page