import React from 'react';

const CardDetail = ({title,data}) => {
    return(
        <div>
            <div className='block mt-6 max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'>
                <h2 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white '>
                    {title}
                </h2>
                <p className='font-normal text-gray-700 dark:text-gray-400'>{data}</p>
         
            </div>
        </div>
    )
}

export default CardDetail;