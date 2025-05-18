import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb'
// import { SearchForm } from './search-form'
import { Profile } from './userProfile'
import { createClient } from '@/utils/supabase/server';
// import { useRouter } from 'next/router';
import { LoginButton } from './login-header';


const Header = async() => {
  
  // const {auth,setAuth} = useState(false);
  // const toggleProfile = () => {
  //   setAuth(!auth)
  // }
  const supabase = createClient();
  const {data: {user}} = await (await supabase).auth.getUser();




  return (
    <div className='.sticky .fixed w-full flex justify-between items-center'>
       <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className='flex items-center justify-between space-x-4 p-1'>
            {/* <SearchForm /> */}
            {user
            ?<Profile />
            : <LoginButton />
            }
          </div>
    </div>
  )
}

export default Header
