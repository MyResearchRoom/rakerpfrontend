import { MoveLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const PageHeader = ({title,subTitle,children,showLeftArrow=true}) => {
  const navigate=useNavigate();
  return (
    <div className='flex flex-col md:flex-row justify-between items-start w-full'>
      <div className=''>
        <div 
          onClick={()=>navigate(-1)}
          className='flex flex-row items-center gap-1 md:hidden'
        >
          { showLeftArrow &&
            <MoveLeft className='text-gray-900'/>
          }
          <h1 className='text-2xl font-bold text-gray-900'>{title}</h1>
        </div>
        <h1 className='tet-xl md:text-2xl lg:text-3xl font-bold  hidden md:block text-gray-900'>{title}</h1>
        <p className='text-sm md:text-base text-gray-700'>{subTitle}</p>
      </div>
      <div className='pt-2 md:pt-0 flex gap-2 items-start ml-auto text-sm md:text-base'>
        {children}
      </div>
    </div>
  )
}

export default React.memo(PageHeader)
