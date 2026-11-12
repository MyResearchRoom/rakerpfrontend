import React from 'react'

const ButtonComponent = ({children,handleButtonClick,type='button',className,disabled}) => {
  return (
    <button 
      type={type} 
      onClick={handleButtonClick} 
      disabled={disabled}
      className={`border-none capitalize text-white font-medium text-sm md:text-base ${className}`}>
        {children}
    </button>
  )
}

export default React.memo(ButtonComponent)
