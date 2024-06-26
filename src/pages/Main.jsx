import { useUserContext } from 'contexts/UserContext';
import Footer from 'features/home/components/Footer';
import Navbar from 'features/home/components/Navbar';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Main = () => {
    const [user,] = useUserContext();
    return (
        <div>
            <Navbar role={user !== null ? user.role : null}></Navbar>
            <hr class=" border-gray-200 sm:mx-auto dark:border-gray-700" />
            <Outlet />
            <Footer></Footer>
        </div>
    )
}

export default Main;