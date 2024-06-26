import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form"
import CreatableSelect from 'react-select/creatable';
import config from 'config.json';
import { useUserContext } from 'contexts/UserContext';
import { addJob } from '../services/be_server/api_job'
import { useNavigate } from 'react-router-dom';
const CreateJob = () => {
    const [optionsSkill, setOptionsSkill] = useState(null);

    const [selectedOptionSkill, setSelectedOptionSkill] = useState(null);
    const [selectedOptionField, setSelectedOptionField] = useState(null);
    const [optionsField, setOptionsField] = useState(null);
    const [field, setField] = useState([]);
    const [user,] = useUserContext();
    const navigate = useNavigate();
    const serverUrl = config.be_rootUrl;
    var urlString = serverUrl + "/field"
    var urlSkills = serverUrl + "/skill"


    useEffect(() => {
        Promise.all([
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
                .then(res => res.json()),
            fetch(urlSkills, {
                method: "GET",
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Authorization": "Bearer " + user.token,
                    "Content-Type": "application/json",
                },
                redirect: "follow"
            }).then(res => res.json())
        ])
            .then(([fielData, skillData]) => {
                const fieldOptions = fielData.map(field => ({
                    label: field.name,
                    value: field.name,
                    __isNew__: false
                }));
                setOptionsField(fieldOptions);
                if (skillData) {
                    const skillOptions = skillData.map(skill => ({
                        label: skill.name,
                        value: skill.id,
                        __isNew__: false
                    }));
                    setOptionsSkill(skillOptions);
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            })
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        data.field = selectedOptionField;
        console.log(data);
        await addJob(user.token, data)
            .then(data => {
                console.log("Add job results ", data)
            })
            .catch(error => {
                console.warn("Add Job faild ", error);
                throw error
            });
        alert("Công việc của bạn đã được thêm vào!")
        navigate("/recruiter")
    };



    return (
        <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
            { /* from*/}

            <div className='bg-[#FAFAFA] py-10 px-4 lg:px-16'>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>

                    {/*1st row */}
                    <div className='create-job-flex'>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Tiêu đề</label>
                            <input type="text" defaultValue={"Web Developer"}
                                {...register("name")} className='create-job-input' />
                        </div>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Trình độ</label>
                            <select {...register("level")} className='create-job-input'>
                                <option value="">Chọn cấp bậc ứng tuyển</option>
                                <option value="Mới tốt nghiệp">Mới tốt nghiệp</option>
                                <option value="Nhân viên">Nhân viên</option>
                                <option value="Trưởng phòng">Trưởng phòng</option>
                                <option value="Quản lý">Quản lý</option>
                                <option value="Trưởng nhóm">Trưởng nhóm</option>
                                <option value="Giám đốc">Giám đốc</option>
                            </select>
                        </div>


                    </div>
                    {/*2nd row */}
                    <div className='create-job-flex'>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Lương tối thiểu</label>
                            <input type="text" placeholder={"Ex: 10 Tr"}
                                {...register("minSalary")} className='create-job-input' />
                        </div>

                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Lương tối đa</label>
                            <input type="text" placeholder={"Ex: 20 Tr"}
                                {...register("maxSalary")} className='create-job-input' />
                        </div>
                    </div>


                    {/*4th row */}
                    <div className='create-job-flex'>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Hạn nộp</label>
                            <input type="date" placeholder={"Ex: 2024-03-16"}
                                {...register("exprires")} className='create-job-input' />
                        </div>

                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Kinh nghiệm làm việc</label>
                            <select {...register("experience")} className='create-job-input'>
                                <option value="">Chọn kinh nghiệm cho công việc</option>
                                <option value="Không yêu cầu kinh nghiệm">Không yêu cầu kinh nghiệm</option>
                                <option value="Trên 1 Năm">Trên 1 Năm</option>
                                <option value="Trên 2 Năm">Trên 2 Năm</option>
                                <option value="Trên 3 Năm">Trên 3 Năm</option>
                            </select>
                        </div>

                    </div>

                    {/*5th row */}
                    <div className='w-full'>
                        <label className='block mb-2 text-lg'>Chuyên ngành</label>
                        <CreatableSelect
                            onChange={setSelectedOptionField}
                            options={optionsField}
                            isMulti
                            className='create-job-input py-4' />
                    </div>



                    {/*6th row */}
                    <div>
                        <label className='block mb-2 text-lg'>Yêu cầu kỹ năng</label>
                        <textarea className='w-full pl-3 py-1.5 focus:outline-none placeholder: text-gray-700'
                            rows={6}
                            defaultValue={"Đưa ra yêu cầu về công việc"}
                            placeholder='Yêu cầu kỹ năng'
                            {...register("requirements")}></textarea>
                    </div>
                    {/*7th row */}

                    <div className='w-full'>
                        <label className='block mb-2 text-lg'>Mô tả công việc</label>
                        <textarea className='w-full pl-3 py-1.5 focus:outline-none placeholder: text-gray-700'
                            rows={6}
                            defaultValue={"Mô tả những thứ cần thiết cho công việc"}
                            placeholder='Mô tả công việc'
                            {...register("description")}></textarea>
                    </div>

                    <input type="submit" value="Đăng tin" className='block mt-12 bg-blue text-white font-semibold px-8 py-2 rounded-sm cursor-pointer' />
                </form>
            </div>
        </div>

    )
}

export default CreateJob;