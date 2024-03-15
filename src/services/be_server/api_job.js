import config from 'config.json';

const serverUrl = config.be_rootUrl;

export const getJob = async () =>{
    var urlString = serverUrl +"/post"
    return await fetch(urlString, {
        method: "GET",
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