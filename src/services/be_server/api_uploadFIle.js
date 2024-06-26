import config from 'config.json';

const serverUrl = config.be_rootUrl;

export const getPresignedGetUrl = async (bucket,name, token) => {
    var urlString =  serverUrl + "/file?bucket=" + bucket +"&filename=" +name;
    return await fetch(urlString, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type" : "application/json",
        },
        redirect: "follow"
    })
    .then(response => {
        return response.json();
    })
    .then(result => {
        return result;
    })
    .catch(error => {
        console.warn("get PresignedPurUrl error: " + error);
        throw error; 
    })
}

export const getPresignedPutUrl = async (bucket, name, token) => {
    var urlString = serverUrl + "/file?bucket=" + bucket +"&filename=" +name;
    return await fetch(urlString, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type" : "application/json",
        },
        redirect: "follow"
    })
    .then(response => {
        return response.json();
    })
    .then(result => {
        return result;
    })
    .catch(error => {
        console.warn("get PresignedPurUrl error: " + error);
        throw error; 
    })
}

export const putFileS3 = async (file,url) => {
    return await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
        },
        body: file,
    })
    .then(response => {
        if(!response.ok) {
            throw new Error(`Failed to upload file.`)
        }
    })
    .catch(error => {
        console.warn("get PresignedPurUrl error: " + error);
        throw error; 
    })
}

export const delFileS3 = async (bucket,name, token) => {
    var urlString = serverUrl + "/file?bucket=" + bucket +"&filename=" +name;
    
    return await fetch(urlString, {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type" : "application/json",
        },
        redirect: "follow"
    })
    .then(response => {
        if(!response.ok) {
            throw new Error(`Failed to upload file.`)
        }
        return response.json();
    })
    .then(result => {
        return result;
    })
    .catch(error => {
        console.warn("get PresignedPurUrl error: " + error);
        throw error; 
    })
}