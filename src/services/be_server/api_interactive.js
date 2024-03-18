import config from 'config.json';

const serverUrl = config.be_rootUrl;
export const addInteractive = async (token,id) =>{
    var urlString = serverUrl +"/historyInteractive?id=" + id
    
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
        console.warn('Add historyInteractive failed: ' , error);
        throw error;
    })
}
