import config from 'config.json';

const serverUrl = config.be_rootUrl;

export const loadModelNotification = async (token,id) =>{
    var urlString = serverUrl +"/notification/model?postId=" + id;
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

export const addNotification = async (token,data) =>{
    var urlString = serverUrl +"/notification";
    return await  fetch(urlString, {
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
        console.warn('Add application failed: ' , error);
        throw error;
    })
}

export const getNotification = async (token,size) =>{
    var urlString = serverUrl +"/notification?size=" +size;
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

export const updateNotification = async (token,id) =>{
    var urlString = serverUrl +"/notification?id=" + id;
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
        console.warn('Add application failed: ' , error);
        throw error;
    })
}

export const inviteNotification = async (token,candidateId,postId) =>{
    var urlString = serverUrl +"/notification/invite?id=" + candidateId  + "&postId=" + postId;
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