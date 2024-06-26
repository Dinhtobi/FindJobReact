import config from 'config.json';

const serverUrl = config.be_rootUrl;

export const getStatisticChart = async (token,startDate,endDate,type) =>{
    var urlString = serverUrl +"/recruiter/statistics/chart?startDate=" + startDate + "&endDate=" + endDate +"&type=" + type;
    return await  fetch(urlString, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
        },
        redirect: "follow"
    })
    .then(response => {
        if(!response.ok)
            throw new Error(`${response.status} ${response.statusText}`);
        return response.json();
    })
    .then(result => {
        return result;
    })
    .catch(error => {
        console.warn('get statistics failed: ' , error);
        throw error;
    })
}

export const getStatisticAdmin = async (token,startDate,endDate,type) =>{
    var urlString = serverUrl +"/admin/statistics?startDate=" + startDate + "&endDate=" + endDate +"&type=" + type;
    return await  fetch(urlString, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
        },
        redirect: "follow"
    })
    .then(response => {
        if(!response.ok)
            throw new Error(`${response.status} ${response.statusText}`);
        return response.json();
    })
    .then(result => {
        return result;
    })
    .catch(error => {
        console.warn('get statistics failed: ' , error);
        throw error;
    })
}