import { useUserContext } from 'contexts/UserContext';
import React from 'react';

const PageHeaderCompany = ({ logo, name, website, size, type }) => {

    return (
        <div>
            <div className='py-16 mt-3 bg-[#fafafa] rounded flex-col items-center justify-center'>
                <div className="rounded-t-xl bg-while-400 flex justify-center items-center">
                    <img src={logo} alt="" className="h-40 w-40 rounded-full border border-blue-700" />
                </div>

                <div className="flex flex-col justify-center items-center gap-4 p-4">
                    <p className="text-xl  font-semibold text-blue">{name}</p>
                    <div className='flex flex-row-2 justify-center items-center gap-4'>
                        <a href={website}>{website}</a>
                        <p>Quy mô công ty: {size}</p>
                        <p>Loại hình công ty: {type}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageHeaderCompany;