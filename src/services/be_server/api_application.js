import config from 'config.json';

const serverUrl = config.be_rootUrl;
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