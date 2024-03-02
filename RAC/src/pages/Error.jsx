import React from 'react'
import { Link } from 'react-router-dom'

const Error = () => {
  return (
    <div className='h-screen flex-col flex justify-center items-center gap-x-8'>
        <img src="/Error.svg" alt="" className='w-[400px]' />
        <Link to="/" className='bg-yellow-500 px-4 py-2 text-white font-semibold'>Go To Home</Link>
    </div>
  )
}

export default Error