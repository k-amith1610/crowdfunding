import React from 'react'

const CustomButton = ({ btnType, title, handleClick, styles, id }) => {
  return (
    <button
      type={btnType}
      className={`${styles} font-epilogue font-semibold text-[15px]
                  leading-[20px] text-white min-h-[52px] px-4
                  rounded-[10px] z-10`}
      onClick={handleClick}
      id={id}
    > 
      {title}
    </button>
  )
}

export default CustomButton
