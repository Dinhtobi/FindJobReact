import React, { useState, useEffect }from "react";
import { FaEllipsisV, FaSearch } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PieComponent from "./PieComponent";
import { useForm } from "react-hook-form"
import { getStatisticChart } from "services/be_server/api_statistic";
const DashboardView = (user) => {
    const [statistics, setStatistics] = useState({});
    const [data, setData] = useState([]);
    const [label, setLabel] = useState([]);

    const [dataCircle,SetdataCircle] = useState([
        { name: 'Tổng số đơn ứng tuyển', value: 0, colors: "#0088FE" }, // số người ứng tuyển
        { name: 'Tổng số đơn chấp nhận', value: 0, colors: "#00C49F" }, // số người chấp nhận
        { name: 'Tổng số đơn từ chối', value: 0, colors: "#FFBB28" }, // số người từ chối
    ]);

    const COLORSCircle = ['#0088FE', '#00C49F', '#FFBB28'];

    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        console.log(data);
        await getStatisticChart(user.user.token,data.daystart, data.dayend, data.type)
        .then(result => {
            setStatistics(result);
            const data = result.statistic.map((item,index) => ({
                name: "Công việc " + index + 1,
                numberAccept: item.numberAccept,
                numberWait: item.numberWait,
                numberRefuse : item.numberRefuse

            }))
            setData(data);
            const label = result.statistic.map((item,index) => ({
                label: "Công việc " + index +1,
                name: item.name
            }))
            console.log(label);
            setLabel(label);
            SetdataCircle(prevDataCircle => prevDataCircle.map(item => {
                if (item.name === 'Tổng số đơn ứng tuyển') {
                    return { ...item, value: result.sumWait };
                }
                if (item.name === 'Tổng số đơn chấp nhận') {
                    return { ...item, value: result.sumAccept };
                }
                if (item.name === 'Tổng số đơn từ chối') {
                    return { ...item, value: result.sumRefuse };
                }
                return item;
            }));
        })
        .catch(error => {
            throw error;
        })
    };
    return (
        <div className="pt-[25px] px-[25px] bg-[#F8F9FC] mb-20">
            <div className="flex items-center">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-cols-3 gap-5">
                    <select {...register("type")} class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="dayly">Ngày</option>
                        <option value="montly">Tháng</option>
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

            <div className="flex  mt-[22px] w-full gap-[30px]">

                <div className="basis-[70%] border bg-white shadow-md cursor-pointer rounded-[4px]">
                    <div className="bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED] mb-[20px]">
                        <h2>Thống kê theo biểu đồ đường</h2>
                        <FaEllipsisV color="gray" className="cursor-pointer" />
                    </div>

                    <div>
                        <LineChart
                            width={700}
                            height={300}
                            data={data}
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
                            <Line type="monotone" dataKey="numberAccept" name="Chấp nhận"  stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="numberWait" name="Đợi duyệt" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="numberRefuse" name="Từ chối" stroke="#e63838" />
                        </LineChart>
                    </div>
                </div>
                <div className="basis-[30%] border bg-white shadow-md cursor-pointer rounded-[4px]">
                    <div className="bg-[#fcf8f8] flex items-center justify-between py-[15px] px-[20px] border-b-[#EDEDED]">
                        <h2>Thống kê theo biểu đồ tròn</h2>
                        <FaEllipsisV color="gray" className="cursor-pointer" />
                    </div>
                    <div className="pl-[10px]">
                        <PieComponent data={dataCircle} COLORS={COLORSCircle} />
                    </div>
                </div>
            </div>
            <div className="flex mt-[22px] w-full gap-[30px]">
                <div className="basis-[70%] border bg-white shadow-md cursor-pointer rounded-[4px] ">
                    <div className=" bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[#EDEDED]">
                        <h2>Chú thích biểu đồ đường</h2>
                        <FaEllipsisV color="gray" className="cursor-pointer" />
                    </div>
                    <div className="py-[15px] px-[20px] ">
                        {
                            label.map((item, index) => (
                                <h1 key={index}>{item.label} : {item.name}</h1>
                            ))
                        }
                    </div>
                </div>
                <div className="basis-[30%] border bg-white shadow-md cursor-pointer rounded-[4px]">
                    <div className=" bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[#EDEDED]">
                        <h2>Chú thích biểu đồ tròn</h2>
                        <FaEllipsisV color="gray" className="cursor-pointer" />
                    </div>
                    <div className="py-[15px] px-[20px] ">
                        <div className="flex flex-cols-2 gap4">

                            <div className=" grid grid-rows-3 pl-[10px] gap-4">
                                {
                                    COLORSCircle.map((item, index) => (
                                        <div className="h-[30px] w-[30px]" style={{ backgroundColor: item }} key={index}>

                                        </div>
                                    ))
                                }
                            </div>
                            <div className="grid grid-rows-3 gap-4 ml-3">

                                {
                                    dataCircle.map((item, index) => (
                                        <p key={index} className="cursor-pointer font-normal">{item.name}</p>
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

export default DashboardView