import { Mail } from '@mui/icons-material';
import React from 'react';
import { FaEnvelopeOpenText, FaRocket } from "react-icons/fa6"
const Newsletter = ()  => {
    return (
        <div>
            <div>
                <h3 className='text-lg font-bold mb-2 flex items-center gap-2'>
                    <FaEnvelopeOpenText/>
                    Email me for jobs
                </h3>

                <p className='text-primary/75 test-base mb-4'>
                    Nhập địa chỉ email để liên hệ với chúng tôi
                </p>

                <div className='w-full space-y-4'>
                    <input type="email" name='email' id='email' placeholder='name@email.com' className='w-full block py-2 pl-3 border focus:outline-none'/>
                    <input type='submit' value={"Gửi"} className='w-full block py-2 pl-3 border focus:outline-none bg-blue rounded-sm text-white cursor-pointer font-semibold'></input>
                </div>

                
            </div>

            {/* second part */}
            <div className='mt-20'>
                <h3 className='text-lg font-bold mb-2 flex items-center gap-2'>
                    <FaRocket/>
                    Get noticed faster
                </h3>

                <p className='text-primary/75 test-base mb-4'>
                    Hãy Upload CV của bạn ở đây
                </p>

                <div className='w-full space-y-4'>
                    <input type='submit' value={"Upload CV"} className='w-full block py-2 pl-3 border focus:outline-none bg-blue rounded-sm text-white cursor-pointer font-semibold'></input>
                </div>

                
            </div>
        </div>
    )
}

export default Newsletter;