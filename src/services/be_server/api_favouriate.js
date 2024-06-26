import config from 'config.json';

const serverUrl = config.be_rootUrl;

export const addFavourite = async (token, id) => {
    var urlString = serverUrl + "/favourite?id=" + id;

    return await fetch(urlString, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Authorization" : "Bearer " + token,
            "Content-Type" : "application/json",
        },
        redirect: "follow"
    })
    .then(response =>{
        if(!response.ok)
            throw new Error(`${response.status} ${response.statusText}`);
        return response.json();
    })
    .then(result => {
        return result;
    })
    .catch(error => {
        console.warn("Add Favourite failed: " + error);
        throw error;
    })
} 

export const deleteFavourite = async (token, id) => {
    var urlString = serverUrl + "/favourite?id=" + id;

    return await fetch(urlString, {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Authorization": "Bearer " + token,
            "Conten-Type": "application/json"
        },
        redirect: "follow"
    })
    .then(response => {
        if(!response.ok)
            throw new Error(`${response.status} ${response.statusText}`)
        return response.json();
    })
    .then(result => {
        return result;
    })
    .catch(error => {
        console.warn("Delete favourite field: " + error);
        throw error;
    })
}

export const getFavourite = async (token) => {
    var urlString = serverUrl + "/post/my-favourite";

    return await fetch(urlString, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Authorization": "Bearer " + token,
            "Conten-Type": "application/json"
        },
        redirect: "follow"
    })
    .then(response => {
        if(!response.ok)
            throw new Error(`${response.status} ${response.statusText}`)
        return response.json();
    })
    .then(result => {
        return result;
    })
    .catch(error => {
        console.warn("get favourite field: " + error);
        throw error;
    })
}