import React, { useEffect, useState } from 'react';
import config from 'config.json';
import { useUserContext } from 'contexts/UserContext';
import { getMyJob } from 'services/be_server/api_job';
import { deleteApplication } from 'services/be_server/api_application';
import CardMyJob from 'features/home/components/CardMyJob';
import PageHeader from 'features/home/components/PageHeader';
import { ToastContainer, toast } from "react-toastify";
const MyJob = () => {
    const [jobs, setJobs] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [user,] = useUserContext();
    const serverUrl = config.be_rootUrl;
    var urlString = serverUrl + "/post/my-job";
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

    const handleDelete = async (id) => {
        await deleteApplication(user.token, id)
            .then(result => {
                toast.success("Huỷ ứng tuyển thành công!", {
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
                toast.error("Huỷ thất bại! xin thử lại", {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                }
                )
            });
        setIsLoading(true);
        await getMyJob(user.token, "post")
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
    const results = jobs !== null ? jobs.map((data, i) => <CardMyJob key={i} data={data} handleDelete={handleDelete} />) : "";
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



    const handleSearch = () => {
        if (searchText === "") {
            setJobs(oldJob);
        } else{
            const filter = oldJob.filter((job) => job.name === null ? "null" : job.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
            setJobs(filter);
        }
            
        setIsLoading(false);
    }





    return (
        <div className='max-w-full-2xl container mx-auto xl:px-24 px-24 py-8'>
            <div className='my-jobs-container'>
                <PageHeader title={"Việc làm đã ứng tuyển"} path={"my-apply"} />
                <div className='search-box p-2 text-center mb-2'>
                    <input
                        onChange={(e) => setSearchText(e.target.value)}
                        type="text" name='search' id='search' className='py-2 pl-3 border focus:outline-none lg:w-6/12 mb-4 w-full' />
                    <button className='bg-blue text-white font-semibold px-8 py-2 rounded-sm mb-4' onClick={handleSearch}
                    >Tìm kiếm</button>
                </div>
            </div>

            <div>

                {
                    user.role !== "candidate" ?
                        <>

                        </> : <>
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
                                    {/* pagination here*/}
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
                        </>
                }

            </div>
        </div>

    )
}

export default MyJob;