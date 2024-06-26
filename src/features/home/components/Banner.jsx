import React, { useState } from "react";
import {FiMapPin, FiSearch} from "react-icons/fi"
const Banner = ({query,handleInputChange, handleSearch}) => {

   
    return (
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 md:pt-20 pt-14 ">
            <h1 className="text-3xl font-bold text-primary mb-3" >Tìm kiếm <span className="text-blue">công việc</span></h1>
            <p className="text-lg text-black/70 mb-8">
                Có hàng ngàn công việc đang đợi bạn! Hãy Apply nào
            </p>
            
                <div className="flex justify-start md:flex-row flex-col md:gap-0 gap-4 px-16">
                    <div className="flex md:round-s-md rounded shadow-sm ring-1 ring-inset focus-within:ring-2
                    focus-within:ring-inset focus-within:ring-indigo-600 md:w-1/2 w-full"> 
                        <input type="text" name="title" id="title" placeholder="Tìm vị trí bạn muốn ứng tuyển" className="block flex-1 border-0 bg-transparent 
                        py-1.5 pl-8 text-gray-900 placeholder:text-gray-400 focus: right-0 sm:text-sm sm:leading-6"
                        onChange={handleInputChange}
                        value={query}
                        />
                        <FiSearch className="absolute mt-2.5 ml-2 text-gray-400"/>
                    </div>

                    <div className="flex md:round-s-none rounded shadow-sm ring-1 ring-inset focus-within:ring-2
                    focus-within:ring-inset focus-within:ring-indigo-600 md:w-1/3  w-full"> 
                        <input type="text" name="title" id="title" placeholder="Địa điểm" className="block flex-1 border-0 bg-transparent 
                        py-1.5 pl-8 text-gray-900 placeholder:text-gray-400 focus: right-0 sm:text-sm sm:leading-6"
                        />
                        <FiMapPin className="absolute mt-2.5 ml-2 text-gray-400"/>
                    </div>
                    <button type="button" className="bg-blue py-2 px-8 text-white md:rounded-s-none" onClick={handleSearch}>Tìm kiếm</button>
                </div>
                <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" />
        </div>
    )
}

export default Banner 