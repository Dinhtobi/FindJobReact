import InputField from 'features/home/components/InputField';
import React from 'react';

const JobPostingDate = ({handleChange}) => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const ThirtDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    // convert date to string 
    const twentyFourHoursAgoDate = twentyFourHoursAgo.toISOString().slice(0,10);
    const sevenDaysAgoDate = sevenDaysAgo.toISOString().slice(0,10);
    const ThirtDaysAgoDate = ThirtDaysAgo.toISOString().slice(0,10);

    return (
        <div>
            <h4 className="text-lg font-medium mb-2">Thời điểm đăng bài</h4>
            <div>
            <label className="sidebar-label-container">
                <input type="radio" name="test3" id="test" value="" onChange={handleChange}/>
                <span className="checkmark"></span>All
            </label>

            <InputField handleChange={handleChange} value={twentyFourHoursAgoDate} title="Trong vòng 24 giờ" name="test3"/>
            <InputField handleChange={handleChange} value={sevenDaysAgoDate} title="Trong vòng 7 ngày" name="test3"/>
            <InputField handleChange={handleChange} value={ThirtDaysAgoDate} title="Trong vòng 1 tháng" name="test3"/>
            </div>   
        </div>
    )
}

export default JobPostingDate;