import React from 'react';
// import imgSrc from '../../../assets/ImgFolder.png';
function EmptyCard({imgSrc , message}) {
  return (
    <div className='flex flex-col items-center justify-center mt-20 pl-18'>
        <img src={imgSrc} alt="No notes" className='w-24' />
        <p className='w-1/2 text-sm font-medium text-primary text-center leading-7 mt-5'>
        {message}
        </p>
    </div>
  )
}

export default EmptyCard