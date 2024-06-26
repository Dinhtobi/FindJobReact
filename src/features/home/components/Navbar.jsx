import React, { Fragment, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6"
import { useUserContext } from "contexts/UserContext";
import LoginButton from "../../../sidebar/LoginButton";
import { Menu, Transition } from "@headlessui/react"
import { BiChevronsDown } from "react-icons/bi"
import { CgProfile } from "react-icons/cg"
import { AiOutlineLogout } from "react-icons/ai"
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { login } from 'services/be_server/api_login';
import { getTokensByAuthCode } from 'services/gg_cloud/tokenHelper';
import { FaSearch } from "react-icons/fa";
import { IoBagSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { ImAddressBook } from "react-icons/im";
import { FaBuilding } from "react-icons/fa";
import { GiFallingStar } from "react-icons/gi";
import { FaBell } from 'react-icons/fa';
import { getNotification, updateNotification } from "services/be_server/api_notification";
import CardNotifycation from "./CardNotifycation";
function MenuList(user) {
    const [, setUser] = useUserContext();
    const navigate = useNavigate();
    const [notification,SetNotification] = useState(null);
    const handleLogOut = () => {
        setUser(null);
        navigate("/home")
    }

    const handleProfile = () => {

    }

    const [isOpen, setIsOpen] = useState(false);
    const toggleNotification = async () => {
        await getNotification(user.user.token, 10)
        .then(result => {
            SetNotification(result)
            setIsOpen(!isOpen);
        })
        .catch(error => {
            console.warn("Get notification failed: " + error);
            throw error;
        })
    };

    const handleUpdateNotification = async (id) => {
        await updateNotification(user.user.token,id)
        .then(result => {
            console.log("Update notification success: ");
        })
        .catch(error => {
            console.warn("Update notification failed: " + error);
            throw error;
        })
    }
    const notificationCard = notification !== null ? notification.map((data,key) => <CardNotifycation data={data} key={key} handleUpdateNotification={handleUpdateNotification} />) : null
    return (

        <div>
            <Menu as='div' className="inline-block text-left" >
                <div className="flex">
                    <div className="inline-block mt-2 mb-2 rounded-full text-sm font-medium bg-white border border-gray-200  shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <button className="focus:outline-none w-10 h-10 rounded-full flex justify-center items-center" onClick={toggleNotification}>
                            <FaBell size={20} />
                        </button>
                        {isOpen && (
                            <div className="absolute right-0 w-96 bg-white border border-gray-200 rounded-lg shadow-lg">
                                <div className="p-4 text-lg font-semibold border-b border-gray-200">Thông báo</div>
                                <div className="text-center">
                                    <section className="grid grid-cols-1 md:grid-rows gap-2 rounded-sm mb-4">
                                        {notificationCard.length === 0 ? <p className="text-gray-500">Bạn chưa có thông báo nào</p> : notificationCard}
                                    </section>
                                    
                                </div>
                            </div>
                        )}
                    </div>
                    <Menu.Button className='inline-flex gap-2 w-full rounded-md bg-white md:px-4 py-2 text-sm font-medium text-slate-700 hover:bg-opacity-20 '>

                        <img src={user?.user.avatar} alt="user profile" className="w-10 h-10 rounded-full object-cover" />

                        <BiChevronsDown className='h-8 w-8 text-slate-600' aria-hidden='true' />
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute z-50 right-5 mt-2 w-80 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg focus:outline-none">
                        <div className="p-1">

                            <Menu.Item as="div" >
                                <div className="flex flex-cols-2 gap-4">
                                    <img src={user?.user.avatar} alt="user profile" className="w-10 h-10 rounded-full object-cover" />

                                    <div className="leadind-[80px] flex flex-col items-start">
                                        <p className="text-sm  font-semibold">
                                            {user?.user.fullName ?? user?.user.name}
                                        </p>
                                        <span className="text-sm text-blue-600">
                                            {user?.user.email}
                                        </span>
                                    </div>
                                </div>
                                <hr class="mt-2 border-gray-200 sm:mx-auto dark:border-gray-700" />
                            </Menu.Item>

                            <Menu.Item as="div">
                                {({ active }) => (
                                    <Link to={`${user?.user.role === "candidate" ? "/home/profile" : "company-profile"}`}
                                        className={`${active ? "bg-blue-500 text-blue" : " text-gray-900"} group flex w-full items-center rounded-md p-2 text-sm mt-2 bg-white border border-gray-200  shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700`}
                                        onClick={() => handleProfile()}
                                    >
                                        <CgProfile className={`${active ? "text-blue" : "text-gray-600"} mr-2 h-5 w-5`} aria-hidden='true' />
                                        {user?.user.role === "candidate" ? "User Profile" : "Company Profile"}

                                    </Link>
                                )}

                            </Menu.Item>

                            <Menu.Item>
                                {({ active }) => (
                                    <button onClick={() => handleLogOut()}
                                        className={`${active ? "bg-blue-500 text-blue" : " text-gray-900"} group flex w-full items-center rounded-md px-2 py-2 text-sm mt-2 bg-white border border-gray-200  shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700`}>
                                        <AiOutlineLogout className={`${active ? "text-blue" : "text-gray-600"} mr-2 h-5 w-5`} aria-hidden='true'>

                                        </AiOutlineLogout>
                                        Log Out
                                    </button>
                                )}

                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>

            </Menu>
        </div>
    )
}


const Navbar = ({ role }) => {
    const [isMenuOpen, setIsmenuOpen] = useState(false);
    const [user, setUser] = useUserContext();

    const navigate = useNavigate();

    const handleLogin = async (codeResponse) => {
        // console.log('auth-code:', codeResponse);
        // Get tokens from GG Cloud
        var ggTokens = null;
        await getTokensByAuthCode(codeResponse.code)
            .then(result => {
                ggTokens = result;
            })
            .catch(error => {
                alert('Đăng nhập bằng GG thất bại.');
            })
        if (ggTokens === null) return; // Không có tokens thì thoát hàm  
        console.log('GG tokens', ggTokens);
        // BE login
        const userSession = {
            token: ggTokens.id_token,
            refreshToken: ggTokens.refresh_token,
            status: null,
            role: null,
            id: null,
        }
        await login(userSession.token)
            .then(result => {
                console.log('login result', result);
                userSession.status = String(result.data.status).toLowerCase();
                userSession.role = String(result.data.role).toLowerCase();
                userSession.id = result.data.id;
                userSession.fullName = String(result.data.fullName);
                userSession.phoneNumber = String(result.data.phoneNumber);
                userSession.email = String(result.data.email);
                userSession.avatar = String(result.data.avatar);
                userSession.gender = Boolean(result.data.gender);
                userSession.dateOfBirth = Date(result.data.dateOfBirth)
            })
            .catch(error => {
                alert('Yêu cầu đến Page thất bại.');
            });

        if (userSession.status === 'success') {
            setUser(userSession);
            switch (userSession.role) {
                case 'candidate':
                    navigate("/home");
                    break;
                case 'recruiter':
                    navigate("/recruiter");
                    break;
                case 'admin':
                    navigate("/admin");
                    break;
                default:
                    console.warn('Handle login failed: Role "' + userSession.role + '" not existed');
                    break;
            }
        }
        else if (userSession.status === 'unregister ') {
            setUser(userSession);
            navigate("/signup");
        }
        else if (userSession.status === 'blocked') {
            alert('Tài khoản đã bị khóa.');
        }
        else {
            console.warn('Handle login failed: Status "' + userSession.status + '" not existed');
        }
    }

    const ggLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: handleLogin,
        onError: (error) => console.log(error)
    })
    const handleMennuToggler = () => {
        setIsmenuOpen(!isMenuOpen)
    }

    const navItems = [
        { path: '/home/job', title: "Việc làm" },
        { path: '/home/company', title: "Công ty" },
    ]
    return (
        <header className="max-w-screen-2xl container mx-auto xl:px-24 px-4" >
            <nav className="flex justify-between items-center py-4 ">
                <a href="/home" className="flex items-center gap-2 text-2xl text-black font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="30" viewBox="0 0 29 30" fill="none">
                        <circle cx="12.0143" cy="12.5143" r="12.0143" fill="#3575E2" fillOpacity="0.4" />
                        <circle cx="16.9857" cy="17.4857" r="12.0143" fill="#3575E2" />
                    </svg>
                    <span>FindJob</span>
                </a>

                {/* Wrapper for nav items and user info */}
                <div className="hidden md:flex flex-1 justify-between items-center ">
                    <ul className="flex gap-12 ml-20">
                        {
                            <li className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 font-bold">
                                <div class="dropdown">
                                    <button class="dropbtn"> Việc làm
                                        <i class="fa fa-caret-down"></i>
                                    </button>
                                    <div class="dropdown-content">
                                        <button onClick={() => navigate("/home")} className="flex items-center py-2 px-2">
                                            <FaSearch className="mr-2 inline-block" /> Tìm việc làm
                                        </button>

                                        <button onClick={() => navigate("/home/my-job")}  className="flex items-center py-2 px-2" >
                                            <IoBagSharp className="mr-2 inline-block" />
                                            Việc làm đã ứng tuyển
                                        </button>
                                        <button onClick={() => navigate("/home/my-favourite")}  className="flex items-center py-2 px-2">
                                            <FaHeart className="mr-2 inline-block" />
                                            Việc làm đã lưu
                                        </button>
                                        <button onClick={() => navigate("/home/job-recommend")}  className="flex items-center py-2 px-2" >
                                            <ImAddressBook className="mr-2 inline-block" />
                                            Việc làm phù hợp
                                        </button>
                                    </div>
                                </div>
                            </li>
                        }
                        {
                            <li className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 font-bold">
                                <div class="dropdown">
                                    <button class="dropbtn"> Công ty
                                        <i class="fa fa-caret-down"></i>
                                    </button>
                                    <div class="dropdown-content">
                                        <button onClick={() => navigate("/home/company")} className="flex items-center py-2 px-2">
                                            <FaBuilding className="mr-2 inline-block" />
                                            Danh sách công ty</button>
                                        <button onClick={() => navigate("/home/company/top/20")} className="flex items-center py-2 px-2">
                                            <GiFallingStar className="mr-2 inline-block" />
                                            Top công ty</button>
                                    </div>
                                </div>
                            </li>
                        }
                    </ul>

                    <div className="text-base text-primary font-medium space-x-5 lg:block">
                        {role === null ? (
                            <Button onClick={ggLogin}>
                                <LoginButton
                                    title='Đăng nhập'
                                    containerStyles='text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600'
                                />
                            </Button>
                        ) : (
                            <MenuList user={user} />
                        )}
                    </div>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden block">
                    <button onClick={handleMennuToggler}>
                        {isMenuOpen ? (
                            <FaXmark className="w-5 h-5 text-primary" />
                        ) : (
                            <FaBarsStaggered className="w-5 h-5 text-primary" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile menu items */}
            <div className={`px-4 bg-black py-5 rounded-sm ${isMenuOpen ? "" : "hidden"}`}>
                <ul>
                    {navItems.map(({ path, title }) => (
                        <li key={path} className="text-base text-white first:text-white py-1">
                            <NavLink
                                to={path}
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                {title}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

        </header>
    )
}

export default Navbar