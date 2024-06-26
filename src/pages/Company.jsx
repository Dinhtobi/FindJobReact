import PageHeader from 'features/home/components/PageHeader';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUserContext } from 'contexts/UserContext';
import { Link } from 'react-router-dom';
import { getMyJob } from 'services/be_server/api_job';
import { deleteApplication } from 'services/be_server/api_application';
import config from 'config.json';
import CardCompanyDetail from 'features/home/components/CardCompanyDetail';
const Company = () => {

    const { size} = useParams();
    const [companies, setCompanies] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [user,] = useUserContext();
    const serverUrl = config.be_rootUrl;
    var urlString = size === undefined ? serverUrl + "/company" : serverUrl + "/company?size=20&type=top";
    const [oldCompanies, setOldCompanies] = useState([]);

    // set current page
    const [currentPage, setCurrenPage] = useState(1);
    const itemPerPage = 30;

    useEffect(() => {
        setIsLoading(true);
        fetch(urlString, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            headers: {
                // "Authorization": "Bearer " + user.token,
                "Content-Type": "application/json",
            },
            redirect: "follow"
        })
            .then(res => res.json())
            .then(data => {
                setCompanies(data);
                setOldCompanies(data);
                setIsLoading(false);
            })
    }, []);
    const results = companies.map((data, i) => <CardCompanyDetail key={i} data={data} />);
    // pagination
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentJobs = results.slice(indexOfFirstItem, indexOfLastItem);

    // next button & previor button
    const nextPage = () => {
        if (indexOfLastItem < companies.length) {
            setCurrenPage(currentPage + 1);
        }
    }

    const prePage = () => {
        if (indexOfFirstItem > 1) {
            setCurrenPage(currentPage - 1);
        }
    }


    // console.log(jobs)
    const handleSearch = () => {
        const filter = companies.filter((job) => companies.name === null ? "null" : companies.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
        if (searchText === "") {
            setCompanies(oldCompanies);
        } else
            setCompanies(filter);
        setIsLoading(false);
    }


  
    return (
        <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
            <PageHeader title={size === undefined ? "Danh sách các công ty nổi bật" : "Danh sách các top công ty"} path={"company"} />
            <div className='mt-5'>
                <div className='search-box p-2 text-center mb-2'>
                    <input type='text' name='search' id='search' className='py-2 pl-3 border focus:outline-none
                    lg:w-6/12 mb-4 w-full' onChange={(e) => setSearchText(e.target.value)} />
                    <button className='bg-blue text-white font-semibold px-8 py-2 rounded-sm mb-4'>Tìm kiếm</button>
                </div>

                <div>

                    <div className="col-span-3 bg-white p-4 rounded-sm">
                        {
                            isLoading ? (<p className="font-medium">Đang tải ...</p>) : results.length > 0 ?
                                <>
                                    <section className="grid grid-cols-3 md:grid-rows gap-4 px-8 py-2 rounded-sm mb-4">
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
                                 indexOfLastItem < companies.length && (
                                     <button className='hover:underline' onClick={nextPage}>Next</button>
                                 )
                             }
                            </div>
                        }
                </div>
            </div>
        </div>
    )
}

export default Company;