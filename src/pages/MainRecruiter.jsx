import { useUserContext } from 'contexts/UserContext';
import Footer from 'features/home/components/Footer';
import NavbarRecruiter from 'features/home/components/NavbarRecruiter';
import React from 'react';
import { Outlet } from 'react-router-dom';

const MainRecruiter = () => {
    const [user,] = useUserContext();
    return (
        <div>
            <NavbarRecruiter role={user !== null ? user.role : null}></NavbarRecruiter>
            <Outlet />
            <Footer></Footer>
        </div>
    )
}

export default MainRecruiter;