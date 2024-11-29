import { Card } from '@/components/ui/card'
import React from 'react'

const financialActivities = [
  {title:'transfers via wallet',amount: 3000, icon:'#'},
  {title:'overall balance',amount: 3000, icon:'#'},
  {title:  'investments',amount: 3000, icon:'#'},
  {title:'payouts',amount: 3000, icon:'#'},
]

export default function Finance() {
  return (
    <div className='flex'>
      {financialActivities.map((activity, index) => (
        <Card key={index}>
          <div>{activity.title}</div>
        </Card>
      ))}
    </div>
  )
}
