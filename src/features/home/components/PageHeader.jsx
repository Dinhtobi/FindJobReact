import { useUserContext } from 'contexts/UserContext';
import React from 'react';

const PageHeader = ({ title, path }) => {
    const [user,] = useUserContext();

    return (
        <div>
            <div className='py-24 mt-3 bg-[#FAFAFA] rounded flex-col items-center justify-center'>
                <h2 className='text-3xl text-blue font-medium mb-1 text-center'>
                    {title}
                </h2>
                <p className='text-sm text-center'><a href={user.role === 'employer' ? "/employeer" : "/seeker"}>Home</a>/ {path}</p>
            </div>
        </div>
    )
}

export default PageHeader;