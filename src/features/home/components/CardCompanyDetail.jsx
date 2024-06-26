import React from "react";
import { Link } from "react-router-dom";


const CardCompanyDetail = ({data}) => {
    const {id, name, logo, size, type, location} = data;
    const logoExmample = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThHPFnk0c9uTXYp5IAVxoCm7YhP12DV-D-v4aLJKRUGRHBf-aDOsUZhs3gqOYa8N4gcNk&usqp=CAU"
    return (
        <section className="card2">
            <Link to={`/home/company/${id}`} className="bg-white h-[300px] text-black rounded-xl ">
                <div className="rounded-t-xl bg-while-400 flex justify-center items-center">
                    <img src={logo !== "" ? logo : logoExmample} alt="" className="h-20 w-20 rounded-full" />
                </div>

                <div className="flex flex-col justify-center items-center gap-4 p-4">
                    <p className="text-sm font-semibold  ">{name}</p>
                    
                </div>

                <div className="ml-4 ">
                <h4 className="text-sm ">Vị trí: {location}</h4>
                    <h4 className="text-sm ">Quy mô công ty: {size}</h4>
                    <h4 className="text-sm ">Loài hình công ty: {type}</h4>
                </div>

                
            </Link>
        </section>
    )
}

export default CardCompanyDetail