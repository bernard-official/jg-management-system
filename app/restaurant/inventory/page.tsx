import { InventoryClient } from '@/components/inventory-client'
import React from 'react'

const Inventory = () => {
  return (
    <div className='flex flex-col space-y-8'>
      <h1 className="text-xl font-bold px-4 pt-4 .mb-4">Inventory</h1>
      <InventoryClient />
    </div>
  )
}

export default Inventory
