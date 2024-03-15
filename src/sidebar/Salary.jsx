import React from 'react';
import Button from './Button';
import InputField from 'features/home/components/InputField';

const Salary = ({handleChange, handleClick}) => {
    return(
        <div>
            <h4 className='text-lg font-medium mb-2'>Salary</h4>
            <div className='mb-3'>
                <Button onClickHandler={handleClick} value="daily" title="Ngày"/>
                <Button onClickHandler={handleClick} value="Monthtly" title="Tháng"/>
                <Button onClickHandler={handleClick} value="Yearly" title="Năm"/>
            </div>

            <div >
            <label className="sidebar-label-container">
                <input type="radio" name="test2" id="test" value="" onChange={handleChange}/>
                <span className="checkmark"></span>All
            </label>

            <InputField handleChange={handleChange} value="30" title=" < 30 Tr VND" name="test2"/>
            <InputField handleChange={handleChange} value="20" title=" < 20 Tr VND" name="test2"/>
            <InputField handleChange={handleChange} value="15" title=" < 15 Tr VND" name="test2"/>
            <InputField handleChange={handleChange} value="Cạnh tranh" title="Cạnh tranh" name="test2"/>

            </div>
        </div>
    )
}

export default Salary ; 