import '../App.css'
import Banner from "features/home/components/Banner";
import { useEffect, useState } from "react";
import Card from "features/home/components/Card";
import Jobs from "./Jobs";
import { getJob, reommmendJob } from "../services/be_server/api_job"
import config from 'config.json';
import { useUserContext } from "contexts/UserContext";
import Sidebar from "sidebar/Sidebar";
import Newsletter from "features/home/components/Newsletter";
import BotMessage from 'features/home/components/BotMessage';
import HumanMessage from 'features/home/components/HumanMessage';
function Home() {
    // const [selectedName, setSelectedName] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedSalary, setSelectedSalary] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedWorkExperience, setSelectedWorkExperience] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [totalPage, setTotalPage] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isBotTurn, setIsBotTurn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrenPage] = useState(1);
    const itemPerPage = 20;
    const [user,] = useUserContext();

    const serverUrl = config.be_rootUrl;
    var urlString = serverUrl + "/post?size=20"
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
                setCurrenPage(data.page);
                setTotalPage(data.totalPages);
                setIsLoading(false);

            })
    }, [messages])


    const [query, setQuery] = useState("");
    const handleInputChange = (event) => {
        setQuery(event.target.value)
    }
    // filter jobs by title
    const filteredItems = jobs.filter((job) => job.name === null ? "null" : job.name.toLowerCase().indexOf(query.toLowerCase()) !== -1)
    // ---------------radio filtering---------------

    // const handleChangeName = (event) => {
    //     setSelectedName(event.target.value)
    // }

    const handleChangeLocation = async (event) => {
        setSelectedLocation(event.target.value)
        await getJob(user.token, itemPerPage, 0, event.target.value, selectedDate, selectedWorkExperience,query)
            .then(data => {
                setJobs(data.content);
                setCurrenPage(data.page);
            })
            .catch(error => {
                alert(" Không thể lấy công việc");
            })

        setIsLoading(false);
    }

    const handleChangeSalary = async (event) => {
        setSelectedSalary(event.target.value)
    }

    const handleClickChatBot = () => {
        setIsExpanded(!isExpanded);
    };

    const handleClickSend = (event) => {
        event.preventDefault();
        const request_temp = { sender: "user", msg: inputValue };
        if (inputValue !== '') {

            setMessages([...messages, request_temp]);
            setInputValue('');
            setIsBotTurn(false);
            rasaAPI(inputValue);
        }
    }


    const handleEnter = (event) => {
        event.preventDefault();
        const name = "shreyas";
        const request_temp = { sender: "user", sender_id: name, msg: inputValue };
        if (event.key === "Enter") {
            if (inputValue !== '') {

                setMessages([...messages, request_temp]);
                setInputValue('');
                setIsBotTurn(false);
                rasaAPI(name, inputValue);
            }
        }
    }

    const rasaAPI = async function handleClick(msg) {

        //chatData.push({sender : "user", sender_id : name, msg : msg});

        console.log(msg);
        await fetch('http://127.0.0.1:6868/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: "follow",
            body: JSON.stringify({ "message": msg }),
        })
            .then(response => response.json())
            .then((result) => {
                if (result) {
                    const recipient_msg = result.response;


                    const response_temp = { sender: "bot", msg: recipient_msg };
                    setIsBotTurn(false);

                    setMessages(chat => [...chat, response_temp]);
                    // scrollBottom();

                }
            })
            .catch(error => {
                console.warn("Error Chat bot ", error)
            })
    }
    const handleChangeDate = async (event) => {
        setSelectedDate(event.target.value)
        await getJob(user.token, itemPerPage, 0, selectedLocation, event.target.value, selectedWorkExperience,query)
            .then(data => {
                setJobs(data.content);
                setCurrenPage(data.page);
            })
            .catch(error => {
                alert(" Không thể lấy công việc");
            })
        setIsLoading(false);
    }

    const handleChangeWorkExpirence = async (event) => {
        setSelectedWorkExperience(event.target.value)
        await getJob(user.token, itemPerPage, 0, selectedLocation, selectedDate, event.target.value,query)
            .then(data => {
                setJobs(data.content);
                setCurrenPage(data.page);
            })
            .catch(error => {
                alert(" Không thể lấy công việc");
            })
        setIsLoading(false);
    }

    // ---------------button based filtering ---------
    const handleClickSalary = (event) => {
        setSelectedSalary(event.target.value)
    }

    // function for the next page 
    const nextPage = async () => {
        if (currentPage < totalPage) {
            setIsLoading(true);
            await getJob(user.token, itemPerPage, currentPage + 1, selectedLocation, selectedDate, selectedWorkExperience,query)
                .then(data => {
                    setJobs(data.content);
                    setCurrenPage(data.page);
                })
                .catch(error => {
                    alert(" Không thể lấy công việc");
                })
            setIsLoading(false);
        }

    }

    // fonction for the previous
    const prevPage = async () => {
        if (currentPage > 0) {
            setIsLoading(true);
            await getJob(user.token, itemPerPage, currentPage - 1, selectedLocation, selectedDate, selectedWorkExperience,query)
                .then(data => {
                    setJobs(data.content);
                    setCurrenPage(data.page);
                })
                .catch(error => {
                    alert(" Không thể lấy công việc");
                })
            setIsLoading(false);
        }
    }

    const handleRecommend = async () => {
        if (user.role === 'seeker') {
            await reommmendJob(user.token)
                .then(data => {
                    setJobs(data);
                    setCurrenPage(0);
                    
                })
                .catch(error => {
                    alert(" Không thể lấy công việc");
                })
            setIsLoading(false);
        } else {
            alert("Mục này dành cho các ứng viên")
        }
    }

    // main function
    const filterdData = (jobs, selectedLocation, selectedSalary, selectedDate, selectedWorkExperience, query) => {
        let filteredJobs = jobs;

        //filtering input items
        if (query) {
            filteredJobs = filteredItems;
        }


        if (selectedSalary) {
            filteredJobs = filteredJobs.filter(({ salary }) => (
                (salary === "Cạnh tranh" ? salary.toLowerCase().includes(selectedSalary.toLowerCase()) : parseInt(salary.split(" ")[3]) < parseInt(selectedSalary))));
        }


        return filteredJobs.map((data, i) => <Card key={i} data={data} role={user.role} />)
    }

    const handleSearch = async () => {
        setIsLoading(true);
        await getJob(user.token, itemPerPage, 0, selectedLocation, selectedDate, selectedWorkExperience,query)
            .then(data => {
                setJobs(data.content);
                setCurrenPage(data.page);
            })
            .catch(error => {
                alert(" Không thể lấy công việc");
            })
        setIsLoading(false);
    }
    const results = filterdData(jobs, selectedLocation, selectedSalary, selectedDate, selectedWorkExperience, query);
    return (
        <>

            <Banner query={query} handleInputChange={handleInputChange} handleSearch={handleSearch}/>

            <div className="bg-[#FAFAFA] md:grid grid-cols-4 gap-8 lg:px-24 px-4 py-12">
                {/*let side */}
                <div className="bg-white p-4 rounded">
                    <Sidebar handleChangeLocation={handleChangeLocation} handleChangeSalary={handleChangeSalary} handleChangeDate={handleChangeDate} handleChangeWorkExpirence={handleChangeWorkExpirence} handleClickSalary={handleClickSalary} />
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
                                <button onClick={prevPage} disabled={currentPage === 0} className="hover:underline">Previous</button>
                                <span className="mx-2">Page {currentPage + 1} of {totalPage + 1}</span>
                                <button onClick={nextPage} disabled={currentPage === totalPage} className="hover:underline">Next</button>
                            </div>
                        ) : ""
                    }
                </div>
                {/*right side */}
                <div className="bg-white p-4 rounded"><Newsletter handleRecommend={handleRecommend} /></div>

                {/*chat bot */}

                <button
                    className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
                    type="button" aria-haspopup="dialog" aria-expanded={isExpanded.toString()}
                    data-state={isExpanded ? 'opened' : 'closed'}
                    onClick={handleClickChatBot}>
                    <svg xmlns=" http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        className="text-white block border-gray-200 align-middle">
                        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" className="border-gray-200">
                        </path>
                    </svg>
                </button>

                {
                    isExpanded ? <>
                        <div
                            className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] w-[440px] h-[634px]">

                            <div className="flex flex-col space-y-1.5 pb-6">
                                <h2 className="font-semibold text-lg tracking-tight">Chatbot</h2>
                                <p className="text-sm text-[#6b7280] leading-3">Powered by Mendable and Vercel</p>
                            </div>

                            <div className="pr-4 h-[474px] overflow-y-scroll" >
                                {messages.map((user, key) => (
                                    <div key={key}>
                                        {user.sender === 'bot' ?
                                            (
                                                <BotMessage message={user.msg} author={user.sender} />
                                            )

                                            : (
                                                <HumanMessage message={user.msg} author={user.sender} />
                                            )
                                        }
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center pt-0">
                                <input
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                                    placeholder="Type your message" type='text'
                                />
                                <button
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2" onClick={handleClickSend}>
                                    Send</button>
                            </div>

                        </div>

                    </> : <></>
                }


            </div>
        </>
    )
}

export default Home