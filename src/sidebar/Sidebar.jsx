import React from "react";
import Location from "./Location";
import Salary from "./Salary";
import JobPostingDate from "./JobPostingData";
import WorkExperience from "pages/WorkExperience";

const Sidebar = ({handleChangeLocation, handleChangeSalary,handleChangeDate, handleChangeWorkExpirence,handleClickSalary}) =>{
    return (
        <div className="space-y-5">
            <h3 className="text-lg font-bold mb-2">Bộ lọc</h3>
            <Location handleChange={handleChangeLocation}/>
            <Salary handleChange= {handleChangeSalary}/>
            <JobPostingDate handleChange = {handleChangeDate}/>
            <WorkExperience handleChange={handleChangeWorkExpirence}/>
        </div>
    )
}

export default Sidebar;