// 'use client'
import Image from 'next/image'
import { LoginButton } from '@/components/login-header'
import { Profile } from '@/components/userProfile'
// import React, { useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js' // Import User type
// import { UserContext } from '@/context/user-context'
// import { supabase } from '@/utils/supabase/clients'

export const HeroNav = (
    {user}:{user: User | null}
) => {
  // const {users} = useContext(UserContext)!
  // const [isScrolled, setIsScrolled] = useState(false);


  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 0);
  //   };
  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);
  
  return (
      // <section className= {`p-1 border border-b-black top-0 z-50 fixed w-full flex justify-between items-center ${isScrolled ? "bg-transparent": " bg-opacity-50"} ` }> 
       <section className= {`p-1 border border-b-black top-0 z-50 fixed w-full flex justify-between items-center` }> 
            <Image src="/logo.jpg" alt={"logo"} width={80} height={50} />
          {user
          ? <Profile />
        : <LoginButton /> }
          </section>
  )
}
