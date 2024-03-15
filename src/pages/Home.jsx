import { Outlet } from "react-router-dom";

import '../App.css'
import Navbar from "features/home/components/Navbar";
import Banner from "features/home/components/Banner";
import { useEffect, useState } from "react";
import Card from "features/home/components/Card";
import Jobs from "./Jobs";
import { getJob } from "../services/be_server/api_job"
import config from 'config.json';
import { useUserContext } from "contexts/UserContext";
import Sidebar from "sidebar/Sidebar";
import dayjs from 'dayjs';
import Newsletter from "features/home/components/Newsletter";
function Home() {
    const [selectedName, setSelectedName] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedSalary, setSelectedSalary] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedWorkExperience, setSelectedWorkExperience] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrenPage] = useState(1);
    const itemPerPage = 6;
    const [user,] = useUserContext();

    const serverUrl = config.be_rootUrl;
    var urlString = serverUrl + "/post"
    useEffect(() => {
        setIsLoading(true)
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
                setJobs(data.content);
                setIsLoading(false);
            })
    }, [])
    // await getJob()
    // .then(result => result.json)
    // .then(data => {
    //     setJobs(data)
    // })
    // .catch(error => {
    //     alert(" Không thể lấy công việc");
    // })

    const [query, setQuery] = useState("");
    const handleInputChange = (event) => {
        setQuery(event.target.value)
    }
    // filter jobs by title
    const filteredItems = jobs.filter((job) => job.name === null ? "null" : job.name.toLowerCase().indexOf(query.toLowerCase()) !== -1)

    // ---------------radio filtering---------------

    const handleChangeName = (event) => {
        setSelectedName(event.target.value)
    }

    const handleChangeLocation = (event) => {
        setSelectedLocation(event.target.value)
    }

    const handleChangeSalary = (event) => {
        setSelectedSalary(event.target.value)
    }

    const handleChangeDate = (event) => {
        setSelectedDate(event.target.value)
    }

    const handleChangeWorkExpirence = (event) => {
        setSelectedWorkExperience(event.target.value)
    }

    // ---------------button based filtering ---------
    const handleClickSalary = (event) => {
        setSelectedSalary(event.target.value)
    }

    // calculate the index range
    const calculatePageRange = () => {
        const startIndex = (currentPage - 1) * itemPerPage;
        const endIndex = startIndex + itemPerPage;
        return { startIndex, endIndex }
    }

    // function for the next page 
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredItems.length / itemPerPage)) {
            setCurrenPage(currentPage + 1);
        }
    }

    // fonction for the previous
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrenPage(currentPage - 1);
        }
    }

    // main function
    const filterdData = (jobs, selectedLocation,selectedSalary,selectedDate, selectedWorkExperience, query) => {
        let filteredJobs = jobs;

        //filtering input items
        if (query) {
            filteredJobs = filteredItems;
        }

        //category filtering
        if (selectedLocation) {
            filteredJobs = filteredJobs.filter(({ companyLocation, name ,salary, exprires, expericence}) => (
                (companyLocation === null ? "" : companyLocation.toLowerCase()).includes(selectedLocation.toLowerCase())                   ));
        }
        if (selectedSalary) {
            filteredJobs = filteredJobs.filter(({ salary}) => (
            (salary === "Cạnh tranh" ? salary.toLowerCase().includes(selectedSalary.toLowerCase()): parseInt(salary.split(" ")[3]) < parseInt(selectedSalary))));
        }
        if (selectedDate) {
            filteredJobs = filteredJobs.filter(({exprires}) => (
                (exprires === null ? "" : dayjs(exprires).format('YYYY-MM-DD') >= selectedDate)))
        }
        if (selectedWorkExperience) {
            filteredJobs = filteredJobs.filter(({expericence}) => (
                (expericence === null ? "" : expericence.toLowerCase() === selectedWorkExperience.toLowerCase()) ))
            console.log(selectedWorkExperience)
        }
       
       
        // slice the data based on current page
        const { startIndex, endIndex } = calculatePageRange();
        filteredJobs = filteredJobs.slice(startIndex, endIndex);

        return filteredJobs.map((data, i) => <Card key={i} data={data} />)
    }

    const results = filterdData(jobs, selectedLocation,selectedSalary,selectedDate, selectedWorkExperience, query);
    return (
        <>
            <Navbar></Navbar>
            <Outlet />
            <Banner query={query} handleInputChange={handleInputChange} />

            <div className="bg-[#FAFAFA] md:grid grid-cols-4 gap-8 lg:px-24 px-4 py-12">
                {/*let side */}
                <div className="bg-white p-4 rounded">
                    <Sidebar  handleChangeLocation={handleChangeLocation} handleChangeSalary={handleChangeSalary} handleChangeDate={handleChangeDate} handleChangeWorkExpirence={handleChangeWorkExpirence}  handleClickSalary={handleClickSalary} />
                </div>
                {/* job cards*/}
                <div className="col-span-2 bg-white p-4 rounded-sm">
                    {
                        isLoading ? (<p className="font-medium">Đang tải ...</p>) : results.length > 0 ? <Jobs results={results} /> : <>
                            <h3 className="text-lg font-bold mb-2">{results.length} Công việc</h3>
                            <p>Không tìm thấy dữ liệu</p>
                        </>
                    }
                    {/* pagination here*/}
                    {
                        results.length > 0 ? (
                            <div className="flex justify-center mt-4 space-x-8">
                                <button onClick={prevPage} disabled={currentPage === 1} className="hover:underline">Previous</button>
                                <span className="mx-2">Page {currentPage} of {Math.ceil(filteredItems.length / itemPerPage)}</span>
                                <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredItems.length / itemPerPage)} className="hover:underline">Next</button>
                            </div>
                        ) : ""
                    }
                </div>
                {/*right side */}
                <div className="bg-white p-4 rounded"><Newsletter /></div>

            </div>
        </>
    )
}

export default Home