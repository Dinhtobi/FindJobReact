import InputField from "features/home/components/InputField";
import React from "react";

const Location = ({handleChange}) =>{
    return (
        <div>
            <h4 className="text-lg font-medium mb-2">Địa điểm</h4>
            <div>
            <label className="sidebar-label-container">
                <input type="radio" name="test" id="test" value="" onChange={handleChange}/>
                <span className="checkmark"></span>All
            </label>

            <InputField handleChange={handleChange} value="Hà Nội" title="Hà Nội" name="test"/>
            <InputField handleChange={handleChange} value="Đà Nẵng" title="Đà Nẵng" name="test"/>
            <InputField handleChange={handleChange} value="Hồ Chí Minh" title="Hồ Chí Minh" name="test"/>
            </div>       
        </div>
    )
}

export default Location;