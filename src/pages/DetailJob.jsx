import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import config from 'config.json';
import { useUserContext } from 'contexts/UserContext';
import PageHeader from 'features/home/components/PageHeader';
import CardDetail from 'features/home/components/CardDetail';
import { addApplication } from 'services/be_server/api_application';
import { addFavourite, deleteFavourite } from 'services/be_server/api_favouriate';
import { FaHeart } from "react-icons/fa";
import { IoIosHeartEmpty } from "react-icons/io";
import {  ToastContainer, toast } from "react-toastify";
const DetailJob = () => {
    const { id } = useParams();
    const [job, setJob] = useState([]);
    const [user,] = useUserContext();
    const [isFavourite, setIsFavourite] = useState(false);
    const serverUrl = config.be_rootUrl;
    var urlString = serverUrl + "/post/" + id;
    var urlInteractive = serverUrl + "/historyInteractive?id=" + id;
    useEffect(() => {
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
                setJob(data);
                setIsFavourite(data.isFavourite);
            })
            ;
        if (user.role === "candidate") {
            fetch(urlInteractive, {
                method: "POST",
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
                    console.log(data.message);
                });
        }
    }, []);


    const handleApply = async () => {
        await addApplication(user.token, id)
            .then(data => {
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
            })
    }

    
    console.log(isFavourite)
    // Handle button click
    const handleSave = async () => {
        // Toggle the state
        if(!isFavourite) {
            setIsFavourite(!isFavourite);
            await addFavourite(user.token, id)
                .then(data => {
                    toast.success("Lưu thành công!", {
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
                    toast.error("Lưu thất bại! xin thử lại", {
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
        }else{
            setIsFavourite(!isFavourite);
            await deleteFavourite(user.token, id)
                .then(data => {
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
                })
        }

    };

    return (
        <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
            <PageHeader title={"Job Details Page"} path={"Detail"} />
            <h1 className="text-3xl font-bold text-primary mb-3 mt-8" ><span className="text-blue">{job.name}</span></h1>
            <p className="text-lg text-black/70 mb-8">
                Hãy Apply ngay để đến với chúng tôi!
            </p>
            <div className='space-x-5 flex items-center'>
                <button className='bg-blue border border-blue-700 rounded px-8 py-2 text-white flex items-center justify-center' style={{ padding: '10px 32px' }} onClick={handleApply}>Ứng tuyển</button>
                <button className='bg-white border border-gray-300 rounded px-8 py-2 text-xl flex items-center justify-center' style={{ padding: '10px 32px' }} onClick={handleSave}>
                    { isFavourite ? <> 
                        <FaHeart />
                    </> : <> 
                        <IoIosHeartEmpty/>
                    </>}
                </button>
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

            <CardDetail title="Địa chỉ" data={job.companyLocation} />
            <CardDetail title="Yêu cầu kỹ năng" data={job.requirements} />
            <CardDetail title="Mô tả công việc" data={job.description} />
        </div>
    )
}

export default DetailJob;