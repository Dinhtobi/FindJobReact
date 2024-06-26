import React, { useEffect, useState } from 'react';
import config from 'config.json';
import { useUserContext } from 'contexts/UserContext';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import CreatableSelect from 'react-select/creatable';
import PageHeader from 'features/home/components/PageHeader';
import { inviteNotification } from 'services/be_server/api_notification';
const RecommendCandidate = () => {
    const [candidates, setCandidates] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOptionSearch, setSelectedOptionSearch] = useState(null);
    const [user,] = useUserContext();
    const { id } = useParams();
    const serverUrl = config.be_rootUrl;
    var urlString = serverUrl + "/candidate/recommend?id=" + id + "&all=true";

    const [oldCandidates, setOldCandidates] = useState([]);

    const optionsSearch = [
        { value: "", label: "Tất cả" },
        { value: "APPLIED", label: "Đã ứng tuyển" },
        { value: "NOTAPPLY", label: "Chưa ứng tuyển" },
    ]

    // set current page
    const [currentPage, setCurrenPage] = useState(1);
    const itemPerPage = 10;

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
                setCandidates(data);
                setOldCandidates(data);
                setIsLoading(false);
            })
    }, []);
    // pagination
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentJobs = candidates.slice(indexOfFirstItem, indexOfLastItem);

    // next button & previor button
    const nextPage = () => {
        if (indexOfLastItem < candidates.length) {
            setCurrenPage(currentPage + 1);
        }
    }

    const prePage = () => {
        if (indexOfFirstItem > 1) {
            setCurrenPage(currentPage - 1);
        }
    }



    const handleSearch = () => {
        const filter = candidates.filter((candidate) => candidates.name === null ? "null" : candidates.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
        if (searchText === "") {
            setCandidates(oldCandidates);
        } else
            setCandidates(filter);
        setIsLoading(false);
    }
    
    const handleFilter = async (selectedOption) => {
        setSelectedOptionSearch(selectedOption);
        setIsLoading(true);
        if (selectedOption.value === "APPLIED") {
            const filter = oldCandidates.filter((candidate) => !candidate.isApply ? null : candidate)
            setCandidates(filter);
        }else if(selectedOption.value === "NOTAPPLY"){
            const filter = oldCandidates.filter((candidate) => candidate.isApply ? null : candidate)
            setCandidates(filter);
        }else{
            setCandidates(oldCandidates);
        }
        setIsLoading(false);
    }

    const handleShowView = async (candidate) => {
        console.log(candidate.cvUrl);
        window.open(candidate.cvUrl, "_blank");
    }

    const handleInvite = async (candidate,index) => {
        await inviteNotification(user.token, candidate.id, id)
        .then(result => {
            if (result.data) {
                setCandidates(prevCandidates => {
                    const updatedCandidates = [...prevCandidates];
                    updatedCandidates[index].isInvite = true;
                    return updatedCandidates;
                });
            }
        })
        .catch(error =>{
            throw error;
        })
    }

    return (
        <div className='max-w-full-2xl container mx-auto xl:px-24 px-24 py-8'>
            <PageHeader title="Danh sách ứng viên đề xuất" path={"recommend-candidate"} />
            <div className='mt-5'>
                <div className='my-jobs-container'>
                    <div className='search-box p-2 text-center mb-2'>
                        <input
                            onChange={(e) => setSearchText(e.target.value)}
                            type="text" name='search' id='search' className='py-2 pl-3 border focus:outline-none lg:w-6/12 mb-4 w-full' />
                        <button className='bg-blue text-white font-semibold px-8 py-2 rounded-sm mb-4' onClick={handleSearch}
                        >Tìm kiếm</button>
                    </div>
                </div>

                <div>
                    <section className="py-1 bg-blueGray-50">
                        <div className="w-full mb-12 xl:mb-0 px-4 mx-auto mt-5">
                            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
                                <div className="rounded-t mb-0 px-4 py-3 border-0">
                                    <div className="flex flex-wrap items-center justify-between px-2">
                                        <div className="flex items-center mb-2">
                                            <div className="">
                                                <h3 className="font-semibold text-base text-blueGray-700">Tất cả</h3>
                                            </div>
                                            <div className="w-64 ml-4">
                                                <CreatableSelect
                                                    onChange={handleFilter}
                                                    options={optionsSearch}
                                                    className='create-job-input'
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center ml-4">

                                            <div className="mr-2">
                                                <Link to="/recruiter/post-job">
                                                    <button className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150" type="button">Đăng công việc mới</button>
                                                </Link>
                                            </div>


                                        </div>
                                    </div>

                                </div>

                                <div className="block w-full overflow-x-auto">
                                    <table className="items-center bg-transparent w-full border-collapse ">
                                        <thead>
                                            <tr>
                                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                    STT
                                                </th>
                                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                    TÊN
                                                </th>

                                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                    Xem ứng viên
                                                </th>
                                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                    Trạng thái
                                                </th>

                                            </tr>
                                        </thead>
                                        {
                                            isLoading ? (<div className='flex items-center justify-center h-20'><p>Loading..........</p></div>)
                                                : (<tbody>
                                                    {
                                                        currentJobs.map((candidates, index) => (
                                                            <tr key={index} className={`${candidates.isRead ? + "" : "border-2 border-green-500"}`}>
                                                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                                                                    {index + 1}
                                                                </th>
                                                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                                                                    {candidates.name}
                                                                </td>

                                                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                    <button onClick={() => handleShowView(candidates)} className='flex border border-gray-400 py-2 px-2 rounded-lg bg-slate-300  justify-center items-center'>Xem</button>
                                                                </td>
                                                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                    <button onClick={() => {
                                                                        handleInvite(candidates,index)
                                                                    }} disabled={candidates.isApply ? true : candidates.isInvite ? true : false} className={`${!candidates.isApply ? "border-gray-600 bg-gray-400" : "border-green-600 bg-green-400"} flex border  py-2 px-2 rounded-lg  justify-center items-center`} >{`${candidates.isApply ? "Đã ứng tuyển" : candidates.isInvite ? "Đã mời" : "Mời ứng tuyển" }`}</button>
                                                                </td>

                                                            </tr>
                                                        ))
                                                    }


                                                </tbody>)
                                        }


                                    </table>
                                </div>
                            </div>
                        </div>
                        {/* pagination*/}
                        <div className='flex justify-center text-base text-black space-x-8 mb-8'>
                            {
                                currentPage > 1 && (
                                    <button className='hover:underline' onClick={prePage}>Previous</button>
                                )
                            }
                            {
                                indexOfLastItem < candidates.length && (
                                    <button className='hover:underline' onClick={nextPage}>Next</button>
                                )
                            }
                        </div>
                    </section>
                    <ToastContainer
                        position='top-center'
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />

                </div>


            </div>
        </div>

    )
}

export default RecommendCandidate;