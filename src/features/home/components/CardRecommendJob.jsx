import React from "react"
import dayjs from 'dayjs';
import { Link } from "react-router-dom";
import { FiCalendar } from "react-icons/fi"
const CardRecommendJob = ({ i,data , handleApply, handleUnSave }) => {

    const { id, name, companyName, companyLogo, createAt ,isSave, isApply} = data
    console.log(data);
    const logoExmample = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThHPFnk0c9uTXYp5IAVxoCm7YhP12DV-D-v4aLJKRUGRHBf-aDOsUZhs3gqOYa8N4gcNk&usqp=CAU"
    return (
        <section className="card relative">
            <Link to={`/home/job/${id}`} className="flex gap-4 flex-col sm:flex-row items-start">
                <img src={companyLogo === null ? logoExmample : companyLogo} alt="" width="100" height="100" />
                <div>
                    <h1 className="text-lg font-semibold mb-2">{name}</h1>
                    <h2 className="text-primary font-semibold mb-2 ">{companyName}</h2>
                    <span className="flex items-center gap-2 text-sm">
                        <FiCalendar /> {createAt === null ? "Chưa có thông tin" : dayjs(createAt).format('YYYY-MM-DD')}
                    </span>
                </div>
            </Link>
            <div className="absolute bottom-4 right-4 space-x-5">
                <button onClick={() => handleApply(id,i)} className="text-sm bg-blue hover:bg-blue-700 text-white py-2 px-4 border border-blue-700 rounded" disabled={isApply ? true : false}>{isApply ?  "Đã ứng tuyển" : "Ứng tuyển"}</button>
                <button onClick={() => handleUnSave(id,i)} className="text-sm bg-gray-100 hover:bg-blue-700 text-black py-2 px-4 border border-white-700 rounded" disabled={isSave ? true : false}>{isSave ?  "Đã lưu" : "Lưu"}</button>
            </div>
        </section>

    )
}

export default CardRecommendJob;