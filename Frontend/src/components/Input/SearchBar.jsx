import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'

function SearchBar({ value, onChange, handleSearch, onClearSearch }) {
  return (
    <div className='w-80 flex items-center justify-between px-4 bg-slate-100 rounded-md'>
      <input 
        type="text"
        placeholder='Search Notes'
        className='w-full text-sx bg-transparent py-[11px] outline-none'
        onChange={onChange}
        value={value}
      />
      {value && (
        <IoMdClose  // for cross icon  
          className='text-xl text-slate-500 cursor-pointer hover:text-black mr-3'
          onClick={onClearSearch}
        />
      )}
      <FaMagnifyingGlass  // for search icon 
        className='text-slate-400 cursor-pointer hover:text-black ' 
        onClick={handleSearch} 
      />
    </div>
  )
}

export default SearchBar
