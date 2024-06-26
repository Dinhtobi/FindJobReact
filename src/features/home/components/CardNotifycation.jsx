import React ,{useState} from "react"
import dayjs from 'dayjs';
import { Link } from "react-router-dom";
import { FiCalendar } from "react-icons/fi"
const CardNotifycation = ({handleUpdateNotification, data }) => {

    const { id, postName, companyLogo, createAt,message, isRead, source } = data
    const [showModal, setShowModal] = useState(false);
    const handleClick = () => {
        handleUpdateNotification(id)
        setShowModal(true)
    }
    console.log(isRead);
    const logoExmample = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThHPFnk0c9uTXYp5IAVxoCm7YhP12DV-D-v4aLJKRUGRHBf-aDOsUZhs3gqOYa8N4gcNk&usqp=CAU"
    return (
        <section className={` ${!isRead ? "border-green-600 border-2" : "border border-gray-400"} card3 relative rounded-lg`}>
            <Link onClick={handleClick} className={`  flex gap-4 flex-col sm:flex-row items-start rounded-sm`}>
                <img src={companyLogo === null ? logoExmample : companyLogo} alt="" width="40" height="40" className="border border-gray-500 rounded-full" />
                <div>
                    <h3 className="text-left text-base text-primary font-bold ">{source === "JOBAPPLICATIONSTATUS" ? "Thống báo tuyển dụng" : "Thông báo bài đăng hết hạn"}</h3>
                    <h4 className="text-left text-sm ">{postName}</h4>
                    <span className="flex items-center gap-2 text-sm">
                        <FiCalendar /> {createAt === null ? "Chưa có thông tin" : dayjs(createAt).format('YYYY-MM-DD')}
                    </span>
                </div>
            </Link>
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-screen my-6 mx-auto max-w-3xl">
                            {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                        <h3 className="text-xl font-semibold">
                                            Thông báo
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
                                                                        {/*body*/}
                                    <div className="relative p-6 flex-auto ">
                                        <textarea className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                            rows={11}
                                            defaultValue={message}
                                            disabled={true}
                                            placeholder='Nội dung thông báo'
                                        ></textarea>
                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                        <button
                                            className="text-black-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Ẩn
                                        </button>
                                       
                                    </div>

                                </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </section>

    )
}

export default CardNotifycation;