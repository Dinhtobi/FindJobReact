import React, { useEffect, useState } from "react";
import { FaSearch, FaLock } from 'react-icons/fa';
import config from 'config.json';
import { useUserContext } from "contexts/UserContext";
import dayjs from 'dayjs';
import { FaUnlock } from "react-icons/fa";
import { blockUser } from "services/be_server/api_register";
const CandidateManager = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrenPage] = useState(1);
    const [candidate, setCandidate] = useState([])
    const [searchText, setSearchText] = useState("");
    const [user,] = useUserContext();
    const serverUrl = config.be_rootUrl;
    var urlString = serverUrl + "/admin/candidate";
    const [oldCandidate, setOldCandidate] = useState([]);
    const itemPerPage = 12;
   

    useEffect(() => {
        setIsLoading(true);
        fetch(urlString, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Authorization": "Bearer " + user.token,
                "Content-Type": "application/json",
            },
            redirect: "follow"
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setCandidate(data);
                setOldCandidate(data);
                setIsLoading(false);
            })
    }, []);

    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentCandidate = candidate.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => {
        if (indexOfLastItem < candidate.length) {
            setCurrenPage(currentPage + 1);
        }
    }

    const prePage = () => {
        if (indexOfFirstItem > 1) {
            setCurrenPage(currentPage - 1);
        }
    }



    const handleSearch = () => {
        setIsLoading(true);
        const filter = candidate.filter((item) => item.fullName === null ? "null" : item.fullName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
        if (searchText === "") {
            setCandidate(oldCandidate);
        } else
            setCandidate(filter);
        setIsLoading(false);
    }

    const handleFilter= (value) => {
        setIsLoading(true);
        setCandidate(oldCandidate);
        if (value === "nonBlock") {
            const filter = oldCandidate.filter((item) => item.isNonBlock )
            setCandidate(filter);
        } else{
            const filter = oldCandidate.filter((item) => !item.isNonBlock )
            setCandidate(filter);
        }
        setIsLoading(false);
    }

    const handleBlock = async (data,index) => {
        console.log(data);
        await blockUser(user.token, data.id)
        .then(result => {
            if (result.data) {
              if(data.isNonBlock){
                setCandidate(prevrCandidate => {
                    const updatedCandidate= [...prevrCandidate];
                    updatedCandidate[index].isNonBlock = false;
                    return updatedCandidate;
                });
              }else{
                setCandidate(prevrCandidate => {
                    const updatedCandidate= [...prevrCandidate];
                    updatedCandidate[index].isNonBlock = true;
                    return updatedCandidate;
                });
              }
              setOldCandidate(candidate);
            }
            console.log("update status success: " + result.message);
        })
        .catch(error => {
            console.warn("Update user fail " + error);
            throw error;
        })
    }
    return (
        <div className="bg-gray-100 p-4 min-h-screen">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Tìm tên ứng viên"
                        className="border p-2 rounded w-1/2"
                    />
                    <div className="flex items-center gap-2">
                        <button type="submit" ><a className="flex items-center justify-center border border-gray-300 rounded-full h-10 w-10 ">
                            <FaSearch className=" inline-block" onClick={handleSearch} />
                        </a></button>
                        <select className="border p-2 rounded" onChange={(e) => handleFilter(e.target.value)}>
                            <option value="nonBlock" selected>Không bị chặn</option>
                            <option value="block">Bị chặn</option>
                        </select>
                    </div>
                </div>
                <table className="min-w-full bg-white shadow-md rounded">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">STT</th>
                            <th className="py-2 px-4 border-b">Họ tên</th>
                            <th className="py-2 px-4 border-b">Tài khoản</th>
                            <th className="py-2 px-4 border-b">Giới tính</th>
                            <th className="py-2 px-4 border-b">Ngày sinh</th>
                            <th className="py-2 px-4 border-b">Số điện thoại</th>
                            <th className="py-2 px-4 border-b">Ngày đăng kí</th>
                            <th className="py-2 px-4 border-b">Bị chặn</th>
                            <th className="py-2 px-4 border-b">Hành động</th>
                        </tr>
                    </thead>
                    {
                        isLoading ? <>
                            Đang tải
                        </> : <>
                            <tbody>
                                {currentCandidate.map((item ,index) => (
                                    <tr key={item.id} className="hover:bg-gray-100 text-sm">
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">{item.fullName}</td>
                                        <td className="py-2 px-4 border-b">{item.email}</td>
                                        <td className="py-2 px-4 border-b">
                                            <span className={`py-1 px-2 rounded-full ${!item.gender  ? 'bg-blue' : 'bg-purple-500'} text-white`}>
                                                {!item.gender ? "Nam" : "Nữ"}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">{dayjs(item.dob).format('YYYY-MM-DD')}</td>
                                        <td className="py-2 px-4 border-b">{item.phoneNumber}</td>
                                        <td className="py-2 px-4 border-b">{dayjs(item.createAt).format('YYYY-MM-DD')}</td>
                                        <td className="py-2 px-4 border-b">{item.isNonBlock ? "Không" :"Có"}</td>
                                        <td className="py-2 px-4 border-b">
                                            {
                                                item.isNonBlock ? <>
                                                <button className="text-red-500" onClick={() => handleBlock(item,index)}>
                                                <FaLock />
                                            </button>
                                                </> : <>
                                                <button className="text-green-500" onClick={() => handleBlock(item,index)}>
                                                <FaUnlock />
                                            </button>
                                                </>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody></>
                    }
                </table>
                <div className='flex justify-center text-base text-black space-x-8 mt-5'>
                    {
                        currentPage > 1 && (
                            <button className='hover:underline' onClick={prePage}>Previous</button>
                        )
                    }
                    {
                        indexOfLastItem < candidate.length && (
                            <button className='hover:underline' onClick={nextPage}>Next</button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default CandidateManager;