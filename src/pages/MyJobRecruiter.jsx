import React, { useEffect, useState } from 'react';
import config from 'config.json';
import { useUserContext } from 'contexts/UserContext';
import { Link, useParams } from 'react-router-dom';
import { deleteJob, getMyJob } from 'services/be_server/api_job';
import { deleteApplication } from 'services/be_server/api_application';
import dayjs from 'dayjs';
import PageHeader from 'features/home/components/PageHeader';
const MyJobRecruiter = () => {
    const [jobs, setJobs] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [user,] = useUserContext();
    const serverUrl = config.be_rootUrl;
    const { isShow } = useParams();
    var urlString = "";
    console.log(isShow)
    if(isShow){
        urlString = serverUrl + "/recruiter/my-job?isShow=true";
    }else{
        urlString = serverUrl + "/recruiter/my-job?isShow=false";
    }
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
    // pagination
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentJobs = jobs.slice(indexOfFirstItem, indexOfLastItem);

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
        const filter = jobs.filter((job) => job.name === null ? "null" : job.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
        if (searchText === "") {
            setJobs(oldJob);
        } else
            setJobs(filter);
        setIsLoading(false);
    }

    const handleDelete = async (id) => {
        await deleteJob(user.token, id)
            .then(result => {
                alert("Bài đăng đã được xoá!");

            })
            .catch(error => {
                console.warn("Xoá bài đăng thất bại");
                throw error;
            });
        setIsLoading(true);
        await getMyJob(user.token, "recruiter")
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



    return (
        <div className='max-w-full-2xl container mx-auto xl:px-24 px-24 py-8'>
            <PageHeader title="Tin tuyển dụng của tôi"  path={"my-job"} />
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
                                <div className="flex flex-wrap items-center">
                                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                                        <h3 className="font-semibold text-base text-blueGray-700">All</h3>
                                    </div>
                                    <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                                        <Link to="/employeer/post-job">
                                            <button className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">Đăng công việc mới</button>
                                        </Link>
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
                                                LƯƠNG
                                            </th>
                                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                THỜI GIAN TẠO
                                            </th>
                                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                HẠN NỘP
                                            </th>
                                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                CHỈNH SỬA
                                            </th>
                                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                XOÁ
                                            </th>
                                        </tr>
                                    </thead>
                                    {
                                        isLoading ? (<div className='flex items-center justify-center h-20'><p>Loading..........</p></div>)
                                            : (<tbody>
                                                {
                                                    currentJobs.map((job, index) => (
                                                        <tr key={index}>
                                                            <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                                                                {index + 1}
                                                            </th>
                                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                                                                {job.name}
                                                            </td>

                                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                {job.salary}
                                                            </td>
                                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                {dayjs(job.createAt).format('YYYY-MM-DD')}
                                                            </td>
                                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                {dayjs(job.expire).format('YYYY-MM-DD')}
                                                            </td>
                                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                <button><Link to={`/recruiter/edit-job/${job?.id}`}>Sửa</Link></button>
                                                            </td>
                                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                <button onClick={() => handleDelete(job.id)} className='bg-red-700 py-2 px-6 text-white rounded-sm'>Xoá</button>
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
                            indexOfLastItem < jobs.length && (
                                <button className='hover:underline' onClick={nextPage}>Next</button>
                            )
                        }
                    </div>
                </section>


            </div>
        </div>
        </div>

    )
}

export default MyJobRecruiter;