import config from 'config.json';

const serverUrl = config.be_rootUrl;

export const getApplication = async (token,id,filter) =>{
    var urlString = serverUrl +"/application/candidate?id=" + id + "&filter=";
    if(filter){
        urlString += filter;
    }
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
        console.warn('Add application failed: ' , error);
        throw error;
    })
}

export const addApplication = async (token,id) =>{
    var urlString = serverUrl +"/application?id=" + id
    
    return await  fetch(urlString, {
        method: "POST",
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
        console.warn('Add application failed: ' , error);
        throw error;
    })
}

export const deleteApplication = async (token,id) =>{
    var urlString = serverUrl +"/application?id=" + id
    
    return await  fetch(urlString, {
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
        console.warn('Delete application failed: ' , error);
        throw error;
    })
}

export const updateViewApplication = async (token,candidateId, postId) =>{
    var urlString = serverUrl +"/application?candidateId=" + candidateId + "&postId=" + postId
    
    return await  fetch(urlString, {
        method: "PUT",
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
        console.warn('Delete application failed: ' , error);
        throw error;
    })
}

export const updateStatusApplication = async (token,candidateid, postId,status) =>{
    var urlString = serverUrl +"/application?candidateId=" + candidateid + "&postId=" + postId + "&status=" + status
    
    return await  fetch(urlString, {
        method: "PATCH",
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
        console.warn('Delete application failed: ' , error);
        throw error;
    })
}