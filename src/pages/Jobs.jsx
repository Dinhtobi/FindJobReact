import React from "react";

const Jobs = ({results}) => {
    return (
        <>
        <h3 className="text-lg font-bold mb-2">{results.length} Công việc</h3>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">{results}</section>
        </>
    )
}

export default Jobs