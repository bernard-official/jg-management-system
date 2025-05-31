import { UsersClient } from '@/components/usersClient'

import React from 'react'

function UserManagement() {
  return (
    <div className="flex flex-col space-y-8 p-4">
      {/* <span className="text-red-500 ">Dashboard Coming Soon !!!</span>
       <Link href={"/restaurant"}>menu</Link> */}
      <h1 className="text-xl font-bold">Employee Management</h1>
    
      <UsersClient />

    </div>
  )
}

export default UserManagement