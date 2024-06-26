import { useUserContext } from 'contexts/UserContext';
import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBarAdmin from 'sidebar/SideBarAdmin';

const MainAdmin = () => {
  const [user,] = useUserContext();
  return (
    <div className='flex flex-cols-2'>
      <div className='basis-[12%] h-[100v] '>
        <SideBarAdmin user={user} />
      </div>
      <div className='w-[88%]'>
        <Outlet />
      </div>
    </div>
  )
}

export default MainAdmin;