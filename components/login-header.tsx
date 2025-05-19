'use client'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';

export const LoginButton = () => {
    const router = useRouter();

    const handleClick = () => {
      router.push('/login');
    }
  return (
    <Button onClick={handleClick} className='border  rounded-xl p-2 px-2'>
        Log in
    </Button>
  )
}
