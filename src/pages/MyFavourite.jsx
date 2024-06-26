import PageHeader from 'features/home/components/PageHeader';
import React, { useState, useEffect } from 'react';
import { useUserContext } from 'contexts/UserContext';
import { Link } from 'react-router-dom';
import { addApplication } from 'services/be_server/api_application';
import config from 'config.json';
import CardMyFavourite from 'features/home/components/CardMyFavourite';
import { ToastContainer, toast } from "react-toastify";
import { deleteFavourite, getFavourite } from 'services/be_server/api_favouriate';
const MyFavourite = () => {

    const [jobs, setJobs] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [user,] = useUserContext();
    const serverUrl = config.be_rootUrl;
    var urlString = serverUrl + "/post/my-favourite";
    const [oldJob, setOldJob] = useState([]);

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
                setJobs(data);
                setOldJob(data);
                setIsLoading(false);
            })
    }, []);


    const handleApply = async (id,index) => {
        await addApplication(user.token, id)
            .then(result => {
                toast.success("Ứng tuyển thành công!", {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                }
                )
            })
            .catch(error => {
                toast.error("Ứng tuyển thất bại! xin thử lại", {
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
            });
        setIsLoading(true);
        await getFavourite(user.token)
            .then(result => {
                setJobs(result);
                setOldJob(result);
                setIsLoading(false);

            })
            .catch(error => {
                console.warn("Lấy Job thất bại");
                throw error;
            });
    }

    const handleUnSave = async (id,index) => {
        await deleteFavourite(user.token, id)
            .then(result => {
                toast.success("Bỏ lưu thành công!", {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                }
                )
            })
            .catch(error => {
                toast.error("Bỏ lưu thất bại! xin thử lại", {
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
            });
        setIsLoading(true);
        await getFavourite(user.token)
            .then(result => {
                setJobs(result);
                setOldJob(result);
                setIsLoading(false);
            })
            .catch(error => {
                console.warn("Lấy Job thất bại");
                throw error;
            });
    }
    const results = jobs !== null ?  jobs.map((data, i) => <CardMyFavourite key={i} data={data} handleApply={handleApply} handleUnSave={handleUnSave} />) : "";
    // pagination
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentJobs = results.slice(indexOfFirstItem, indexOfLastItem);

    // next button & previor button
    const nextPage = () => {
        if (indexOfLastItem < jobs.length) {
            setCurrenPage(currentPage + 1);
        }
    }

    const prePage = () => {
        if (indexOfFirstItem > 1) {
            setCurrenPage(currentPage - 1);
        }
    }


    // console.log(jobs)
    const handleSearch = () => {
        if (searchText === "") {
            setJobs(oldJob);
        } else {
            const filter = oldJob.filter((job) => job.name === null ? "null" : job.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
            setJobs(filter);
        }

        setIsLoading(false);
    }




    return (
        <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
            <PageHeader title={"Việc làm đã lưu"} path={"my-favourite"} />
            <div className='mt-5'>
                <div className='search-box p-2 text-center mb-2'>
                    <input type='text' name='search' id='search' className='py-2 pl-3 border focus:outline-none
                    lg:w-6/12 mb-4 w-full' onChange={(e) => setSearchText(e.target.value)} />
                    <button onClick={handleSearch} className='bg-blue text-white font-semibold px-8 py-2 rounded-sm mb-4'>Tìm kiếm</button>
                </div>

                <div>

                    <div className="col-span-3 bg-white p-4 rounded-sm">
                        {
                            isLoading ? (<p className="font-medium">Đang tải ...</p>) : results.length > 0 ?
                                <>
                                    <section className="grid grid-cols-1 md:grid-rows gap-4 px-8 py-2 rounded-sm mb-4">
                                        {currentJobs}
                                    </section>
                                </> : <>
                                    <h3 className="text-lg font-bold mb-2">{results.length} Công việc</h3>
                                    <p>Không tìm thấy dữ liệu</p>
                                </>
                        }
                        {/* pagination here*/}
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
                    {
                        <div className='flex justify-center text-base text-black space-x-8 mb-8'>
                            {
                                currentPage > 1 && (
                                    <button className='hover:underline' onClick={prePage}>Previous</button>
                                )
                            }
                            {
                                indexOfLastItem < jobs.length && (
                                    <button className='hover:underline' onClick={nextPage}>Next</button>
                                )
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default MyFavourite;