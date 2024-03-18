import PageHeader from 'features/home/components/PageHeader';
import React, { useState } from 'react';

const Salary = () => {

    const [searchText, setSearchText] = useState("");
   
    const handleSearch = () => {
      
    } 

    return (
        <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
            <PageHeader title={"Bảng lương"} path={"Salary"}/>
            <div className='mt-5'>
                <div className='search-box p-2 text-center mb-2'>
                    <input type='text' name='search' id='search' className='py-2 pl-3 border focus:outline-none
                    lg:w-6/12 mb-4 w-full' onChange={(e) => setSearchText(e.target.value)}/>
                    <button className='bg-blue text-white font-semibold px-8 py-2 rounded-sm mb-4'>Tìm kiếm</button>
                </div>
            </div>
        </div>
    )
}

export default Salary;