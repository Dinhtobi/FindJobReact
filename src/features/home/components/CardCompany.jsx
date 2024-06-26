import React from "react";
import { Link } from "react-router-dom";


const CardCompany = ({data}) => {
    const {id, name, logo} = data;
    const logoExmample = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThHPFnk0c9uTXYp5IAVxoCm7YhP12DV-D-v4aLJKRUGRHBf-aDOsUZhs3gqOYa8N4gcNk&usqp=CAU"
    return (
        <section className="card2">
            <div className="bg-white h-[200px] text-black rounded-xl ">
                <div className="rounded-t-xl bg-while-400 flex justify-center items-center">
                    <img src={logo !== null ? logo : logoExmample} alt="" className="h-20 w-20 rounded-full" />
                </div>

                <div className="flex flex-col justify-center items-center gap-4 p-4">
                    <p className="text-sm font-semibold min-h-[40px]">{name}</p>
                    <Link to={`/home/company/${id}`}>
                        <button className="bg-indigo-400 text-white text-xl px-6 py-1  rounded-xl">Chi tiết</button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default CardCompany