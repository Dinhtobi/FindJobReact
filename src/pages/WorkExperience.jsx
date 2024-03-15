import InputField from 'features/home/components/InputField';
import React from 'react';

const WorkExperience = ({handleChange}) => {
    return (
        <div>
        <h4 className="text-lg font-medium mb-2">Kinh nghiệm</h4>
        <div>
        <label className="sidebar-label-container">
            <input type="radio" name="test4" id="test" value="" onChange={handleChange}/>
            <span className="checkmark"></span>All
        </label>

        <InputField handleChange={handleChange} value="Không yêu cầu kinh nghiệm" title="Không yêu cầu kinh nghiệm" name="test4"/>
        <InputField handleChange={handleChange} value="Trên 1 Năm" title="Trên 1 năm" name="test4"/>
        <InputField handleChange={handleChange} value="Trên 2 Năm" title="Trên 2 năm" name="test4"/>
        <InputField handleChange={handleChange} value="Trên 3 Năm" title="Trên 3 năm" name="test4"/>
        </div>   
    </div>
    )
}

export default WorkExperience;