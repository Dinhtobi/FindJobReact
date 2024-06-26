import { useUserContext } from "contexts/UserContext";
import React, { useState } from "react";
import { FaEllipsisV, FaSearch } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useForm } from "react-hook-form"
import { getStatisticAdmin } from "services/be_server/api_statistic";
import PieComponent from "features/home/components/PieComponent";
const Statistic = () => {
    const [user,] = useUserContext();
    const [statistics, setStatistics] = useState({});
    const [dataLine, setDataLine] = useState([]);

    const [data, setData] = useState([
        { title: 'Tổng số tin tuyển dụng', value:  0, bgColor: 'bg-blue-100', iconColor: 'text-blue-500', path: "my-job/false" },
        { title: 'Trung binh tin tuyển dụng', value: 0, bgColor: 'bg-green-100', iconColor: 'text-green-500', path: "cv-apply" },
        { title: 'Tổng số ứng tuyển', value: 0, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-500', path: "my-job/true" },
        { title: 'Trung bình ứng tuyển', value: 0, bgColor: 'bg-red-100', iconColor: 'text-red-500', path: "cv-apply" },

    ]);

    const [dataCircle, SetdataCircle] = useState([
        { name: 'Hà Nội', value: 0, colors: "#0088FE" }, // số người ứng tuyển
        { name: 'HCM', value: 0, colors: "#00C49F" }, // số người chấp nhận
        { name: 'Đà Nẵng', value: 0, colors: "#FFBB28" }, // số người từ chối
        { name: 'Khác', value: 0, colors: "#FF8042" }, // số người từ chối
    ]);

    const COLORSCircle = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        console.log(data);
        await getStatisticAdmin(user.token, data.daystart, data.dayend, data.type)
            .then(result => {
                console.log(result);
                setStatistics(result);
                const dataLine = result.statistic.map((item, index) => ({
                    name: item.date,
                    numberPost: item.numberPost,
                    numberApply: item.numberApply,
                }))
                setDataLine(dataLine);
                SetdataCircle(prevDataCircle => prevDataCircle.map(item => {
                    if (item.name === 'Hà Nội') {
                        return { ...item, value: result.sumPostHN };
                    }
                    if (item.name === 'HCM') {
                        return { ...item, value: result.sumPostHCM };
                    }
                    if (item.name === 'Đà Nẵng') {
                        return { ...item, value: result.sumPostDN };
                    }
                    if (item.name === 'Khác') {
                        return { ...item, value: result.sumOther };
                    }
                    return item;
                }));
                setData(prevDataCircle => prevDataCircle.map(item => {
                    if (item.title === 'Tổng số tin tuyển dụng') {
                        return { ...item, value: result.sumPost };
                    }
                    if (item.title === 'Trung binh tin tuyển dụng') {
                        return { ...item, value: result.avgPost };
                    }
                    if (item.title === 'Tổng số ứng tuyển') {
                        return { ...item, value: result.sumApply };
                    }
                    if (item.title === 'Trung bình ứng tuyển') {
                        return { ...item, value: result.avgApply };
                    }
                    return item;
                }));
            })
            .catch(error => {
                throw error;
            })
    };
    return (
        <div className="className='max-w-screen-2xl container mx-auto xl:px-24 px-4 p-4">
            <div className="flex items-center mb-5">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-cols-3 gap-5">
                    <select {...register("type")} class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="daily">Ngày</option>
                        <option value="monthly">Tháng</option>
                        <option value="yearly">Năm</option>
                    </select>
                    <input type="date" placeholder={"Ex: 2024-03-16"}
                        {...register("daystart")} className='create-job-input border border-gray-300 rounded-md' />
                    <input type="date" placeholder={"Ex: 2024-03-16"}
                        {...register("dayend")} className='create-job-input border border-gray-300 rounded-md' />

                    <button type="submit" ><a className="flex items-center justify-center border border-gray-300 rounded-full h-10 w-10 ">
                        <FaSearch className=" inline-block" />
                    </a></button>
                </form>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.map((item, index) => (
                    <div key={index} className={`flex flex-cols-2  gap-4 items-center justify-center p-4 rounded-lg shadow ${item.bgColor}`}>
                        <div className=" text-lg font-semibold">{item.title}</div>
                        <div className={`text-2xl  ${item.iconColor}`}>{item.value}</div>
                    </div>
                ))}
            </div>
            <div className=" bg-[#F8F9FC]">

                <div className="flex mt-[22px] w-full gap-[30px] ">

                    <div className="basis-[70%] border bg-white shadow-md cursor-pointer rounded-[4px]">
                        <div className="bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED] mb-[20px]">
                            <h2>Thống kê theo biểu đồ đường</h2>
                            <FaEllipsisV color="gray" className="cursor-pointer" />
                        </div>

                        <div>
                            <LineChart
                                width={700}
                                height={300}
                                data={dataLine}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="numberPost" name="Tin tuyển dụng" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="numberApply" name="Ứng viên" stroke="#82ca9d" />
                            </LineChart>
                        </div>
                    </div>
                    <div className="basis-[30%] border bg-white shadow-md cursor-pointer rounded-[4px]">
                        <div className="bg-[#fcf8f8] flex items-center justify-between py-[15px] px-[20px] border-b-[#EDEDED]">
                            <h2>Thống kê theo biểu đồ tròn</h2>
                            <FaEllipsisV color="gray" className="cursor-pointer" />
                        </div>
                        <div className=" pl-[10px] mb-4">
                            <PieComponent data={dataCircle} COLORS={COLORSCircle} />
                            <div className="grid grid-cols-4 gap-2 ml-3">

                                {
                                    dataCircle.map((item, index) => (
                                        <p key={index} className="cursor-pointer font-normal">{item.name}</p>
                                    ))
                                }
                            </div>
                            <div className=" grid grid-cols-4 pl-[10px] gap-2">
                                {
                                    COLORSCircle.map((item, index) => (
                                        <div className="h-[30px] w-[30px]" style={{ backgroundColor: item }} key={index}>

                                        </div>
                                    ))
                                }
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Statistic;