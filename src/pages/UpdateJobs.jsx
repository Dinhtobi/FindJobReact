import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from "react-hook-form"
import CreatableSelect from 'react-select/creatable';
import config from 'config.json';
import { useUserContext } from 'contexts/UserContext';
import { updateJob } from '../services/be_server/api_job'
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
const UpdateJob = () => {
    const { id } = useParams();
    const [job, setJob] = useState({});
    const [user,] = useUserContext();
    const serverUrl = config.be_rootUrl;
    var urlString = serverUrl + "/post/" + id;
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
              
            })
            ;

    }, []);


    const [selectedOption, setSelectedOption] = useState(null);
    const [field, setField] = useState([]);
    const navigate = useNavigate();
    var urlString2 = serverUrl + "/field"
    useEffect(() => {
        fetch(urlString2, {
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
                setField(data);

            })
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        data.requirements = selectedOption;
        await updateJob(user.token, data, id)
            .then(data => {
                console.log("Add job results ", data)
            })
            .catch(error => {
                console.warn("Add Job faild ", error);
                throw error
            });
        alert("Công việc của bạn đã được thêm vào!")
        navigate("/employeer")
    };

    const options = [
        { value: "Java", label: "Java" },
        { value: "Marketing", label: "Marketing" },
        { value: "Photo", label: "Photo" },
        { value: "Giao tiếp", label: "Giao tiếp" },
    ]
    
    return (
        <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
            { /* from*/}

            <div className='bg-[#FAFAFA] py-10 px-4 lg:px-16'>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>

                    {/*1st row */}
                    <div className='create-job-flex'>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Tiêu đề</label>
                            <input type="text" defaultValue={job.name}
                                {...register("name")} className='create-job-input' />
                        </div>

                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Tên công ty</label>
                            <input type="text" placeholder={"Ex: Microsoft"}
                                defaultValue={job.companyName}
                                {...register("companyName")} className='create-job-input' />
                        </div>
                    </div>
                    {/*2nd row */}
                    <div className='create-job-flex'>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Lương tối thiểu</label>
                            <input type="text" placeholder={"Ex: 10 Tr"}
                                defaultValue={job.minSalary}
                                {...register("minSalary")} className='create-job-input' />
                        </div>

                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Lương tối đa</label>
                            <input type="text" placeholder={"Ex: 20 Tr"}
                                defaultValue={job.maxSalary}
                                {...register("maxSalary")} className='create-job-input' />
                        </div>
                    </div>

                    {/*3rd row */}
                    <div className='create-job-flex'>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Level</label>
                            <select {...register("level")} className='create-job-input'>
                                <option value={job.level}>{job.level}</option>
                                <option value="Mới tốt nghiệp">Mới tốt nghiệp</option>
                                <option value="Nhân viên">Nhân viên</option>
                                <option value="Trưởng phòng">Trưởng phòng</option>
                                <option value="Quản lý">Quản lý</option>
                                <option value="Trưởng nhóm">Trưởng nhóm</option>
                                <option value="Giám đốc">Giám đốc</option>
                            </select>
                        </div>

                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Địa chỉ</label>
                            <input type="text" placeholder={"Ex: Đà Nẵng"}
                                defaultValue={job.companyLocation}
                                {...register("companyLocation")} className='create-job-input' />
                        </div>
                    </div>

                    {/*4th row */}
                    <div className='create-job-flex'>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Hạn nộp</label>
                            <input type="date" placeholder={"Ex: 2024-03-16"}
                                defaultValue={job.exprires === null || job.exprires === "" ? "2024-03-18" : dayjs(job.exprires).format('YYYY-MM-DD')}
                                {...register("exprires")} className='create-job-input' />
                        </div>

                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Kinh nghiệm làm việc</label>
                            <select {...register("experience")} className='create-job-input'>
                                <option value={job.experience}>{job.experience}</option>
                                <option value="Không yêu cầu kinh nghiệm">Không yêu cầu kinh nghiệm</option>
                                <option value="Trên 1 Năm">Trên 1 Năm</option>
                                <option value="Trên 2 Năm">Trên 2 Năm</option>
                                <option value="Trên 3 Năm">Trên 3 Năm</option>
                            </select>
                        </div>

                    </div>

                    {/*5th row */}

                    <div>
                        <label className='block mb-2 text-lg'>Yêu cầu kỹ năng</label>
                        <CreatableSelect
                            onChange={setSelectedOption}
                            options={options}
                            isMulti
                            className='create-job-input py-4' />
                    </div>

                    {/*6th row */}
                    <div className='create-job-flex'>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Logo công y</label>

                            <input type="url" placeholder={"Điền URL logo công ty của bạn: https://react-select.com/img1"}
                                defaultValue={job.companyLogo}
                                {...register("companyLogo")} className='create-job-input' />
                        </div>

                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Chuyên ngành</label>
                            <select {...register("field")} className='create-job-input'>
                                <option value={job.field}>{job.field}</option>
                                {/*load back-end */
                                    field.map(element =>
                                        <option key={element.name} value={element.name}>{element.name}</option>
                                    )
                                }
                            </select>
                        </div>

                    </div>

                    {/*7th row */}

                    <div className='w-full'>
                        <label className='block mb-2 text-lg'>Mô tả công việc</label>
                        <textarea className='w-full pl-3 py-1.5 focus:outline-none placeholder: text-gray-700'
                            rows={6}
                            defaultValue={job.description}
                            placeholder='Mô tả công việc'
                            {...register("description")}></textarea>
                    </div>

                    <input type="submit" className='block mt-12 bg-blue text-white font-semibold px-8 py-2 rounded-sm cursor-pointer' />
                </form>
            </div>
        </div>

    )
}

export default UpdateJob;