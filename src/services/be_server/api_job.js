import config from 'config.json';

const serverUrl = config.be_rootUrl;
export const getJob = async (token,size,number,location, postingDate,experience,keyword) =>{
    var urlString = serverUrl +"/post?size=" + size +"&number=" +number 
    if(location !== null && location !== "")
        urlString += "&location=" + location;
    if(postingDate !== null && postingDate !== "")
        urlString += "&postingDate=" +postingDate;
    if(experience !== null && experience !== "") 
        urlString += "&experience=" +experience
    if(keyword !== null && keyword !== ""){
        urlString += "&keyword=" +keyword + "&searchField=name"
    }
    console.log(urlString);
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
        console.warn('Get Job failed: ' , error);
        throw error;
    })
}

export const addJob = async (token,data) => {
    var urlString = serverUrl + "/post";
    return await fetch(urlString, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
        console.warn('Add Job failed: ' , error);
        throw error;
    })
}

export const updateJob = async (token,data,id) => {
    var urlString = serverUrl + "/post/" + id;
    return await fetch(urlString, {
        method: "PATCH",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
        console.warn('Add Job failed: ' , error);
        throw error;
    })
}

export const deleteJob = async (token,id) => {
    var urlString = serverUrl + "/post/" + id;
    return await fetch(urlString, {
        method: "DELETE",
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
        console.warn('Delete Job failed: ' , error);
        throw error;
    })
}

export const getMyJob = async (token) => {
    var urlString = serverUrl + "/post/my-job" ;
    return await fetch(urlString, {
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
        console.warn('Get Job failed: ' , error);
        throw error;
    })
}

export const reommmendJob = async (token) => {
    var urlString = serverUrl + "/post/recommend";
    return await fetch(urlString, {
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
        console.warn('Add Job failed: ' , error);
        throw error;
    })
}