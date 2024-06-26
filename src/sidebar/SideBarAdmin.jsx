import React from "react";
import { FaRegSun, FaTachometerAlt } from "react-icons/fa";
import { MdSupervisorAccount } from "react-icons/md";
import { FcStatistics } from "react-icons/fc";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "contexts/UserContext";
import { Button } from "@headlessui/react";
const SideBarAdmin = () => {
    const [, setUser] = useUserContext();
    const navigate = useNavigate();
    const handleLogOut = () => {
        setUser(null);
        navigate("/home")
    }
    return (
        <div className="bg-[#4E73DF] h-screen">
            <div className="px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]">
                <h1 className="text-white text-[15px] leading-[24px] font-extrabold cursor-pointer">
                    Admin
                </h1>
            </div>
            <div className="px-3 flex items-center gap-[15px] py-[20px] border-b-[1px] border-[#EDEDED]/[0.3]">
                <FcStatistics  color="white" className="text-xl"/>
                <Button onClick={() => navigate("/admin")} className="text-[14px] leading-[20px] font-normal text-white">Thống kê</Button>

            </div>
            
            <div className="px-2 flex items-center gap-[15px] py-[20px] border-b-[1px] border-[#EDEDED]/[0.3]">
                <FaRegSun color="white" className="text-xl"/>
                <Button onClick={() => navigate("/admin/candidate")}  className="text-[14px] leading-[20px] font-normal text-white">Quản lí ứng viên</Button>
            </div>
            <div className="px-2 flex items-center gap-[15px] py-[20px] border-b-[1px] border-[#EDEDED]/[0.3]">
                <MdSupervisorAccount  color="white" className="text-xl"/>
                <Button onClick={() => navigate("/admin/recruiter")} className="text-[14px] leading-[20px] font-normal text-white">Quản lí nhà tuyển dụng</Button>
            </div>
            <div className="px-2 flex items-center gap-[15px] py-[20px] border-b-[1px] border-[#EDEDED]/[0.3]">
                <IoIosLogOut  color="white"className="text-xl" />
                <Button onClick={() => handleLogOut()} className="text-[14px] leading-[20px] font-normal text-white">Đăng xuất</Button>
            </div>
        </div>
    )
}

export default SideBarAdmin;