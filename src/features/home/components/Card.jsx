import React from "react";
import { Link } from "react-router-dom";
import {FiCalendar, FiDollarSign} from "react-icons/fi"
import dayjs from 'dayjs';
import { HiAcademicCap } from "react-icons/hi2";
const Card = ({data}) => {
    const {id,name,companyName, companyLogo, minSalary, maxSalary, createAt,experience ,exprires} = data;
    const logoExmample = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThHPFnk0c9uTXYp5IAVxoCm7YhP12DV-D-v4aLJKRUGRHBf-aDOsUZhs3gqOYa8N4gcNk&usqp=CAU"
    return (
        <section className="card">
            <Link to={`/home/job/${id}`} className='flex gap-4 flex-col sm:flex-row items-start'>
                <img src={companyLogo ===null ? logoExmample: companyLogo} alt="" width="148" height="148"/>
                <div>
                    <h4 className="text-primary mb-1 text-sm">{companyName === null ? "Chưa có thông tin công ty" : companyName}</h4>
                    <h3 className="text-lg font-semibold mb-2">{name === "" ? "Chưa có thông tin" : name}</h3>
                    
                    <div className="text-primary/70 text-base flex flex-col gap-2 mb-2">
                        <span className="flex items-center gap-2 text-sm"><HiAcademicCap/> {experience === "" ? "Chưa có thông tin" : experience}</span>
                        <span className="flex items-center gap-2 text-sm"><FiDollarSign/> {minSalary + " Tr - " + maxSalary + " Tr VND"}</span>
                        <span className="flex items-center gap-2 text-sm"><FiCalendar/> {createAt === null ? "Chưa có thông tin" : dayjs(createAt).format('YYYY-MM-DD')}  - {exprires === null ? "Chưa có thông tin" : dayjs(exprires).format('YYYY-MM-DD')}</span>
                    </div>
                    
                </div>
            </Link>
        </section>
    )
}

export default Card