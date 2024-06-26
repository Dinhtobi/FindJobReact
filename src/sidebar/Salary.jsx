import React from 'react';
import Button from './Button';
import InputField from 'features/home/components/InputField';

const Salary = ({handleChange}) => {
    return(
        <div>
            <h4 className='text-lg font-medium mb-2'>Lương</h4>
            <div >
            <label className="sidebar-label-container">
                <input type="radio" name="test2" id="test" value="" onChange={handleChange}/>
                <span className="checkmark"></span>All
            </label>

            <InputField handleChange={handleChange} value="30" title="20 Tr < 30 Tr VND" name="test2"/>
            <InputField handleChange={handleChange} value="20" title="15 Tr < 20 Tr VND" name="test2"/>
            <InputField handleChange={handleChange} value="15" title=" < 15 Tr VND" name="test2"/>
            <InputField handleChange={handleChange} value="10" title=" < 10 Tr VND" name="test2"/>

            </div>
        </div>
    )
}

export default Salary ; 