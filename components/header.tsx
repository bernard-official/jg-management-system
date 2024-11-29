import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb'
import { SearchForm } from './search-form'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Header = () => {
  return (
    <div className=' w-full flex justify-between items-center'>
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
          <div className='flex items-center justify-between space-x-4'>
            <SearchForm />
            <Avatar> 
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>JG</AvatarFallback>
            </Avatar>
          </div>
    </div>
  )
}

export default Header
