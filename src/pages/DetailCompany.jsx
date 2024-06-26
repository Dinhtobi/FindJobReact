import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import config from 'config.json';
import { useUserContext } from 'contexts/UserContext';
import CardDetail from 'features/home/components/CardDetail';
import PageHeaderCompany from "features/home/components/PageHeaderCompany";
import Card from "features/home/components/Card";


const DetailCompany = () => {
    const { id } = useParams();
    const [company, setCompany] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const serverUrl = config.be_rootUrl;
    var urlCompany = serverUrl + "/company/" + id;
    var urlJobOfCompany = serverUrl + "/company/job/" + id;
    const [currentPage, setCurrenPage] = useState(1);
    const itemPerPage = 10;

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            fetch(urlJobOfCompany, {
                method: "GET",
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow"
            }).then(res => res.json())
                .then(result => {
                    return result;
                })
                .catch(error => {
                    console.warn("Jobs is empty: " + error);
                    throw error;
                })
            ,
            fetch(urlCompany, {
                method: "GET",
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow"
            }).then(res => res.json())
                .then(result => {
                    return result;
                })
                .catch(error => {
                    console.warn("Company is empty: " + error);
                    throw error;
                })
        ])
            .then(([jobData, companyData]) => {
                setJobs(jobData);
                if (companyData) {
                    setCompany(companyData);
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);
    const results = jobs.length > 0 ? jobs.map((data, i) => <Card key={i} data={data} />) : [];
    // pagination
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentJobs = results.slice(indexOfFirstItem, indexOfLastItem);

    // next button & previor button
    const nextPage = () => {
        if (indexOfLastItem < jobs.length) {
            setCurrenPage(currentPage + 1);
        }
    }

    const prePage = () => {
        if (indexOfFirstItem > 1) {
            setCurrenPage(currentPage - 1);
        }
    }



    return (
        <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
            <PageHeaderCompany name={company.name} logo={company.logo} website={company.webSite} size={company.companySize} type={company.companyType}/>

            <div className="flex flex-col-2 gap-8">
                <div className="w-3/4 flex-row-2">
                    <CardDetail title="Mô tả công ty" data={company.description} styte="text-blue" />

                    <div className='block mt-6 max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'>
                        <h1 className="text-2xl mb-2 tracking-tight font-bold text-blue  ">Tuyển dụng</h1>

                        <div className="col-span-3 bg-white p-4 rounded-sm">
                            {
                                isLoading ? (<p className="font-medium">Đang tải ...</p>) : results.length > 0 ?
                                    <>
                                        <section className="grid grid-cols-1 md:grid-rows gap-4 px-8 py-2 rounded-sm mb-4">
                                            {currentJobs}
                                        </section>
                                    </> : <>
                                        <h3 className="text-lg font-bold mb-2">{results.length} Công việc</h3>
                                        <p>Không tìm thấy dữ liệu</p>
                                    </>
                            }
                            {/* pagination here*/}
                        </div>
                        {
                            <div className='flex justify-center text-base text-black space-x-8 mb-8'>
                                {
                                    currentPage > 1 && (
                                        <button className='hover:underline' onClick={prePage}>Previous</button>
                                    )
                                }
                                {
                                    indexOfLastItem < jobs.length && (
                                        <button className='hover:underline' onClick={nextPage}>Next</button>
                                    )
                                }
                            </div>
                        }
                    </div>
                </div>

                <div className="w-1/4">
                    <CardDetail title="Địa chỉ" data={company.locations} styte="text-blue" />
                </div>
            </div>

        </div>
    )
}

export default DetailCompany;