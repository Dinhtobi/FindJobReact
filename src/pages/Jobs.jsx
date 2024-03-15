import React from "react";

const Jobs = ({results}) => {
    return (
        <>
        <h3 className="text-lg font-bold mb-2">{results.length} Công việc</h3>
        <section>{results}</section>
        </>
    )
}

export default Jobs