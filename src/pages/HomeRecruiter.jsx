import '../App.css'
import React, { useState, useEffect } from 'react';
import { useUserContext } from "contexts/UserContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import config from 'config.json';
import { data } from 'autoprefixer';
import DashboardView from 'features/home/components/DashBoardView';

function HomeRecruiter() {
  const [user,] = useUserContext();
  const [statistics, setStatistics] = useState({});

  const serverUrl = config.be_rootUrl;
  var urlString = serverUrl + "/recruiter/statistics";
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
        setStatistics(data);
      })
  }, []);
  const data = [
    { title: 'Tổng số tin tuyển dụng', value: statistics !== null ? statistics.sumPost : 0, bgColor: 'bg-blue-100', iconColor: 'text-blue-500', path: "my-job/false" },
    { title: 'CV tiếp nhận', value: statistics !== null ? statistics.sumCv : 0, bgColor: 'bg-green-100', iconColor: 'text-green-500', path: "cv-apply" },
    { title: 'Tin tuyển dụng hiển thị', value: statistics !== null ? statistics.sumShowPost : 0, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-500', path: "my-job/true" },
  ];

  return (
    <div className="className='max-w-screen-2xl container mx-auto xl:px-24 px-4 p-4">
      <h1 className="text-3xl text-blue font-medium mb-1">Bảng tin</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <Link to={`/recruiter/${item.path}`}>
            <div key={index} className={`p-4 rounded-lg shadow ${item.bgColor}`}>
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{item.title}</div>
                <div className={`text-2xl ${item.iconColor}`}>{item.value}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <DashboardView user={user}/>
    </div>
  )
}

export default HomeRecruiter;