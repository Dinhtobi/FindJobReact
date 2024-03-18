import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import config from 'config.json';
import { useUserContext } from 'contexts/UserContext';
import PageHeader from 'features/home/components/PageHeader';
import CardDetail from 'features/home/components/CardDetail';
import { addApplication } from 'services/be_server/api_application';
const DetailJob = () => {
    const {id} = useParams();
    const [job, setJob] = useState([]);
    const [user,] = useUserContext();
    const serverUrl = config.be_rootUrl;
    var urlString = serverUrl + "/post/" + id;
    var urlInteractive= serverUrl + "/historyInteractive?id=" +id;
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
            if(user.role === "seeker"){
        fetch(urlInteractive, {
                method: "POST",
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
                    console.log(data.message);
                })                ;
            }
    }, []);
    
    
    const handleApply = async () => {
        await addApplication(user.token,id)
        .then(data => {
            alert("Application !" + data.message);
        })
        .catch(error => {
            alert(" Không thể application");
        })
    }


    return (
        <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
             <PageHeader title={"Job Details Page"} path={"Detail"}/>
            <h1 className="text-3xl font-bold text-primary mb-3 mt-8" ><span className="text-blue">{job.name}</span></h1>
            <p className="text-lg text-black/70 mb-8">
                Hãy Apply ngay để đến với chúng tôi!
            </p>
            <button className='bg-blue px-8 py-2 text-white' onClick={handleApply}>Apply Now</button>
            <CardDetail title="Địa chỉ" data={job.companyLocation}/>
            <CardDetail title="Yêu cầu kỹ năng" data={job.requirements}/>
            <CardDetail title="Mô tả công việc" data={job.description}/>
        </div>
    )
}

export default DetailJob;