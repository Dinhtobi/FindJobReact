import React, { useEffect, useState } from 'react';
import config from 'config.json';
import { useUserContext } from 'contexts/UserContext';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import { getApplication, updateStatusApplication, updateViewApplication } from 'services/be_server/api_application';
import CreatableSelect from 'react-select/creatable';
import { useForm } from "react-hook-form"
import dayjs from 'dayjs';
import PageHeader from 'features/home/components/PageHeader';
import { addNotification, loadModelNotification } from 'services/be_server/api_notification';
const CvApply = () => {
    const [candidates, setCandidates] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOptionSearch, setSelectedOptionSearch] = useState(null);
    const [selectedOptionCandidate, setSelectedOptionCandidate] = useState(null);
    const [optionsCandidate, setOptionsCandidate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [user,] = useUserContext();
    const { id } = useParams();
    const serverUrl = config.be_rootUrl;
    var urlString = serverUrl + "/application/candidate?id=" + id + "&filter=";

    const [oldCandidates, setOldCandidates] = useState([]);

    const optionsSearch = [
        { value: "", label: "Tất cả" },
        { value: "ACCEPT", label: "Đã chấp nhận" },
        { value: "REFUSE", label: "Đã từ chối" },
        { value: "READED", label: "Đã xem" },
        { value: "NOTREAD", label: "Chưa xem" },
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
        const filter = candidates.filter((job) => candidates.name === null ? "null" : candidates.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
        if (searchText === "") {
            setCandidates(oldCandidates);
        } else
            setCandidates(filter);
        setIsLoading(false);
    }

    const handleFilter = async (selectedOption) => {
        setSelectedOptionSearch(selectedOption);
        setIsLoading(true);
        await getApplication(user.token, id, selectedOption.value)
            .then(result => {
                setCandidates(result);
                setOldCandidates(result);
                setIsLoading(false);
            })
            .catch(error => {
                console.warn("Filter failed :" + error);
                throw error;
            })

    }

    const handleShowView = async (candidate) => {
        console.log(candidate.cvUrl);
        if (!candidate.isRead) {
            await updateViewApplication(user.token, candidate.id, id)
                .then(result => {
                    console.log("update view success: " + result.message);
                })
                .catch(error => {
                    console.warn("Update view failed " + error);
                    throw error;
                })
            window.open(candidate.cvUrl, "_blank");
        }

    }
    const handleAccept = async (candidate, index) => {
        await updateStatusApplication(user.token, candidate.id, id, "ACCEPT")
            .then(result => {
                if (result.data) {
                    setCandidates(prevCandidates => {
                        const updatedCandidates = [...prevCandidates];
                        updatedCandidates[index].status = "ACCEPT";
                        return updatedCandidates;
                    });
                }
                console.log("update status success: " + result.message);
            })
            .catch(error => {
                console.warn("Update status failed " + error);
                throw error;
            })
    }

    const handleRefuse = async (candidate, index) => {
        await updateStatusApplication(user.token, candidate.id, id, "REFUSE")
            .then(result => {
                if (result.data) {
                    setCandidates(prevCandidates => {
                        const updatedCandidates = [...prevCandidates];
                        updatedCandidates[index].status = "REFUSE";
                        return updatedCandidates;
                    });
                }
                console.log("update status success: " + result.message);
            })
            .catch(error => {
                console.warn("Update status failed " + error);
                throw error;
            })
    }
    const handleShowModal = async () => {
        if (!showModal) {
            await loadModelNotification(user.token, id)
                .then(result => {
                    setContent(result.data);
                    setShowModal(true);
                    SetSendNotification(candidates);
                })
                .catch(error => {
                    console.warn("Get model notification failed: " + error);
                    throw error;
                })
        }
        else {
            setShowModal(false);
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        data.receiveId = selectedOptionCandidate;
        data.postId = id;
        console.log(data);
        setShowModal(false);
        await addNotification(user.token, data)
        .then(result => {
            if(result.data){
                toast.success("Gửi thông báo thành công", {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                }
                )
            }
        })
        .catch(error => {
            toast.error("Gửi thông báo thất bại", {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            }
            )
            throw error;
        })

    };

    const SetSendNotification = (candidates) => {
        const filterCandidate = candidates.filter(p => p.status === 'ACCEPT');
        if (filterCandidate.length > 0) {
            const filterSelected = filterCandidate.map(candidate => ({
                value: candidate.id,
                label: candidate.name,
                _isNew_: false
            }));
            setSelectedOptionCandidate(filterSelected);
            setOptionsCandidate(filterSelected);
        }
    };

    return (
        <div className='max-w-full-2xl container mx-auto xl:px-24 px-24 py-8'>
            <PageHeader title="Danh sách ứng viên" path={"cv-apply"} />
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
                                            <div>
                                                <>
                                                    <button
                                                        className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 mr-2 rounded outline-none focus:outline-none ease-linear transition-all duration-150 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-80"
                                                        type="button"
                                                        onClick={handleShowModal}
                                                    >
                                                        Gửi thông báo phỏng vấn
                                                    </button>
                                                    {showModal ? (
                                                        <>
                                                            <div
                                                                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                                                            >
                                                                <div className="relative w-screen my-6 mx-auto max-w-3xl">
                                                                    {/*content*/}
                                                                    <form onSubmit={handleSubmit(onSubmit)}>
                                                                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                                            {/*header*/}
                                                                            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                                                                <h3 className="text-xl font-semibold">
                                                                                    Gửi thông báo phỏng vấn
                                                                                </h3>
                                                                                <button
                                                                                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                                                    onClick={() => setShowModal(false)}
                                                                                >
                                                                                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                                                        ×
                                                                                    </span>
                                                                                </button>
                                                                            </div>
                                                                            <div className="p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                                                <label className='block mb-2 text-lg'>Người nhận</label>
                                                                                <CreatableSelect
                                                                                    onChange={setSelectedOptionCandidate}
                                                                                    options={optionsCandidate}
                                                                                    isMulti
                                                                                    value={selectedOptionCandidate}
                                                                                    className='create-job-input'
                                                                                />
                                                                            </div>
                                                                            {/*body*/}
                                                                            <div className="relative p-6 flex-auto ">
                                                                                <textarea className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                                                                    rows={11}
                                                                                    defaultValue={content}
                                                                                    placeholder='Nội dung thông báo'

                                                                                    {...register("message")}></textarea>
                                                                                <h4 className='flex justify-end text-red-400 text-sm '>(*)Vui lòng không thay đổi [Tên ứng viên]</h4>
                                                                            </div>
                                                                            {/*footer*/}
                                                                            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                                                                <button
                                                                                    className="text-black-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                                    type="button"
                                                                                    onClick={() => setShowModal(false)}
                                                                                >
                                                                                    Huỷ
                                                                                </button>
                                                                                <button
                                                                                    className="bg-blue text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                                    type="submit"
                                                                                >
                                                                                    Gửi
                                                                                </button>

                                                                            </div>

                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                                                        </>
                                                    ) : null}
                                                </>
                                            </div>
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
                                                    THỜI GIAN NỘP
                                                </th>
                                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                    Xem ứng viên
                                                </th>
                                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                    Chấp nhận
                                                </th>
                                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                    Từ chối
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
                                                                    {dayjs(candidates.timeApply).format('YYYY-MM-DD')}
                                                                </td>
                                                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                    <button onClick={() => handleShowView(candidates)} className='flex border border-gray-400 py-2 px-2 rounded-lg bg-slate-300  justify-center items-center'>Xem</button>
                                                                </td>
                                                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                    <button onClick={() => {
                                                                        handleAccept(candidates, index)
                                                                    }} disabled={candidates.status !== "WAITING" ? true : false} className='flex border border-green-600 py-2 px-2 rounded-lg bg-green-400 justify-center items-center' >{`${candidates.status === "ACCEPT" ? "Đã chấp nhận " : "Chấp nhận"}`}</button>
                                                                </td>
                                                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                    <button onClick={() => handleRefuse(candidates, index)} disabled={candidates.status !== "WAITING" ? true : false} className='flex border border-red-600 py-2 px-2 rounded-lg bg-red-400 justify-center items-center'>{`${candidates.status === "REFUSE" ? "Đã từ chối " : "Từ chối"}`}</button>
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

export default CvApply;