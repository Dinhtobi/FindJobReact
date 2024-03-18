import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {FaBarsStaggered, FaXmark} from "react-icons/fa6"
import { useUserContext } from "contexts/UserContext";

const Navbar = ({role}) => {
    const [isMenuOpen, setIsmenuOpen] = useState(false);
    const [user,] = useUserContext();
    const handleMennuToggler = () => {
        setIsmenuOpen(!isMenuOpen)
    }

    const navItems = [
        { path: role === "seeker" ? '/seeker' : '/employeer', title: "Tìm kiếm" },
        { path: role === "seeker" ? '/seeker/my-job' : '/employeer/my-job', title: "Công việc của tôi" },
        { path:role === "seeker" ? '/seeker/salary' : '/employeer/salary', title: "Bảng lương" },
        { path: "/employeer/post-job", title: "Đăng tuyển" },
    ]
    return (
        <header className="max-w-screen-2x1 container mx-auto xl:px-24 px-4">
            <nav className="flex justify-between items-center py-4">
                <a href="/" className="flex items-center gap-2 text-2xl text-black font-bold"><svg xmlns="http://www.w3.org/2000/svg" width="29" height="30" viewBox="0 0 29 30" fill="none">
                    <circle cx="12.0143" cy="12.5143" r="12.0143" fill="#3575E2" fillOpacity="0.4" />
                    <circle cx="16.9857" cy="17.4857" r="12.0143" fill="#3575E2" />
                </svg><span>FindJob</span></a>

                {
                    // nav items for large devices
                }
                    <ul className="hidden md:flex gap-12">
                        {
                            navItems.map(({ path, title }) => (
                                <li key={path} className="text-base text-primary font-bold">
                                    <NavLink
                                        to={path}
                                        className={({ isActive }) => isActive ? "active" : ""}
                                    >
                                        {title}
                                    </NavLink>
                                </li>
                            ))
                        }
                    </ul>
               
                <div className="text-base text-primary font-medium space-x-5 hidden lg:block">
                </div>
                { /* moblie menu */}
                <div className="md:hidden block">
                    <button onClick={handleMennuToggler}>
                        {
                            isMenuOpen ? <FaXmark className="w-5 h-5 text-primary"/> : <FaBarsStaggered className="w-5 h-5 text-primary"/>
                        }
                    </button>
                </div>
            </nav>
            { /* navitems for moblie */}
            <div className={`px-4 bg-black py-5 rounded-sm ${isMenuOpen ? "" : "hidden"}`}>
                <ul>
                {
                    navItems.map(({ path, title }) => (
                        <li key={path} className="text-base text-white first:text-white py-1">
                            <NavLink
                                to={path}
                                className={({ isActive }) => isActive ? "active" : ""}
                            >
                                {title}
                            </NavLink>
                        </li>
                    ))
                }
                <li className="text-white py-1">
                </li>
                </ul>
            </div>
        </header>
    )
}

export default Navbar