import { useUserContext } from 'contexts/UserContext';
import Navbar from 'features/home/components/Navbar';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Main = () => {
    const [user,] = useUserContext();
    return (
        <div>
            <Navbar role={user.role}></Navbar>
            <Outlet />
        </div>
    )
}

export default Main;