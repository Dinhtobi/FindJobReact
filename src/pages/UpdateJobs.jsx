import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import CreatableSelect from 'react-select/creatable';
import config from 'config.json';
import { useUserContext } from 'contexts/UserContext';
import { updateJob } from '../services/be_server/api_job';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const UpdateJob = () => {
    const { id } = useParams();
    const [job, setJob] = useState({});
    const [user] = useUserContext();
    const serverUrl = config.be_rootUrl;
    const [selectedOption, setSelectedOption] = useState(null);
    const [options, setOptions] = useState(null);
    const navigate = useNavigate();

    const urlField = `${serverUrl}/field`;
    const urlPost = `${serverUrl}/post/${id}`;

    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        Promise.all([
            fetch(urlPost, {
                method: "GET",
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
                redirect: "follow"
            })
                .then(res => res.json())
                .then(data => {
                    setJob(data);
                    setValue('name', data.name);
                    setValue('level', data.level);
                    setValue('minSalary', data.minSalary);
                    setValue('maxSalary', data.maxSalary);
                    setValue('exprires', dayjs(data.exprires).format('YYYY-MM-DD'));
                    setValue('experience', data.experience);
                    setValue('requirements', data.requirements);
                    setValue('description', data.description);

                    const jobField = data.fields.map(field => ({
                        label: field.name,
                        value: field.name,
                        __isNew__: false
                    }));
                    setSelectedOption(jobField);
                    return data;
                })
                .catch(error => {
                    console.warn("Get profile error: " + error);
                    throw error;
                }),
            fetch(urlField, {
                method: "GET",
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
                redirect: "follow"
            }).then(res => res.json())
                .then(result => {
                    const fieldOptions = result.map(field => ({
                        label: field.name,
                        value: field.name,
                        __isNew__: false
                    }));
                    setOptions(fieldOptions);
                    return result;
                })
                .catch(error => {
                    console.warn("Company is empty: " + error);
                    throw error;
                })
        ])
        .catch(error => {
            console.error("Error fetching data:", error);
        });
    }, [id, user.token, setValue, urlField, urlPost]);

    const onSubmit = async (data) => {
        data.field = selectedOption;
        await updateJob(user.token, data, id)
            .then(data => {
                console.log("Add job results ", data);
                alert("Công việc của bạn đã được cập nhật vào!");
                navigate("/recruiter");
            })
            .catch(error => {
                console.warn("Add Job failed ", error);
                throw error;
            });
    };

    return (
        <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
            <div className='bg-[#FAFAFA] py-10 px-4 lg:px-16'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                    <div className='create-job-flex'>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Tiêu đề</label>
                            <input type="text" {...register("name")} className='create-job-input' />
                        </div>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Level</label>
                            <select {...register("level")} className='create-job-input'>
                                <option value="">Chọn level</option>
                                <option value="Mới tốt nghiệp">Mới tốt nghiệp</option>
                                <option value="Nhân viên">Nhân viên</option>
                                <option value="Trưởng phòng">Trưởng phòng</option>
                                <option value="Quản lý">Quản lý</option>
                                <option value="Trưởng nhóm">Trưởng nhóm</option>
                                <option value="Giám đốc">Giám đốc</option>
                            </select>
                        </div>
                    </div>
                    <div className='create-job-flex'>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Lương tối thiểu</label>
                            <input type="text" placeholder={"Ex: 10 Tr"} {...register("minSalary")} className='create-job-input' />
                        </div>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Lương tối đa</label>
                            <input type="text" placeholder={"Ex: 20 Tr"} {...register("maxSalary")} className='create-job-input' />
                        </div>
                    </div>
                    <div className='create-job-flex'>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Hạn nộp</label>
                            <input type="date" placeholder={"Ex: 2024-03-16"} {...register("exprires")} className='create-job-input' />
                        </div>
                        <div className='lg:w-1/2 w-full'>
                            <label className='block mb-2 text-lg'>Kinh nghiệm làm việc</label>
                            <select {...register("experience")} className='create-job-input'>
                                <option value="">Chọn kinh nghiệm</option>
                                <option value="Không yêu cầu kinh nghiệm">Không yêu cầu kinh nghiệm</option>
                                <option value="Trên 1 Năm">Trên 1 Năm</option>
                                <option value="Trên 2 Năm">Trên 2 Năm</option>
                                <option value="Trên 3 Năm">Trên 3 Năm</option>
                            </select>
                        </div>
                    </div>
                    <div className='w-full'>
                        <label className='block mb-2 text-lg'>Chuyên ngành</label>
                        <CreatableSelect
                            onChange={setSelectedOption}
                            options={options}
                            value={selectedOption}
                            isMulti
                            className='create-job-input py-4' />
                    </div>
                    <div>
                        <label className='block mb-2 text-lg'>Yêu cầu kỹ năng</label>
                        <textarea className='w-full pl-3 py-1.5 focus:outline-none placeholder:text-gray-700' 
                        rows={6}
                        placeholder='Yêu cầu kỹ năng'
                         {...register("requirements")}></textarea>
                    </div>
                    <div className='w-full'>
                        <label className='block mb-2 text-lg'>Mô tả công việc</label>
                        <textarea className='w-full pl-3 py-1.5 focus:outline-none placeholder:text-gray-700'
                            rows={6}
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
