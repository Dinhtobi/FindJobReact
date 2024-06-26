import config from 'config.json'
const serverUrl = config.be_rootUrl;

export const registerCandidate = async (token, fromData) => {
    var urlString = serverUrl +"/account/candidate";
    var authToken = "Bearer " + token;

    console.log("form JS");
    for(var pair of fromData.entries()) {
      console.log(pair[0]+ ': '+ pair[1]); 
    }
    return await fetch(urlString,{
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Authorization": authToken
        },
        body: fromData,
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
        console.warn('Register customer failed: ' , error);
        throw error;
    });
}

export const registerRecruiter = async (token, formData) => {
    var urlString = serverUrl + "/account/recruiter";
    var authToken = "Bearer " + token;

    return await fetch(urlString, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Authorization": authToken,
      },
      body: formData,
      redirect: "follow"
    })
      // await receiving response
      .then(response => {
        if (!response.ok)
          throw new Error(`${response.status} ${response.statusText}`);
        return response.json();
      })
      // await getting response body
      .then(result => {
        return result;
      })
      // catch fail fetch
      .catch(error => {
        console.warn('Register employeer failed: ', error);
        throw error;
      });
  }


  export const updateCandidate = async (token, fromData, id) => {
    var urlString = serverUrl +"/candidate/" + id;
    var authToken = "Bearer " + token;

    console.log("form JS");
    for(var pair of fromData.entries()) {
      console.log(pair[0]+ ': '+ pair[1]); 
    }
    return await fetch(urlString,{
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Authorization": authToken,
        },
        body: fromData,
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
        console.warn('update customer failed: ' , error);
        throw error;
    });
}


export const blockUser = async (token, id) => {
  var urlString = serverUrl +"/admin/" + id;
  var authToken = "Bearer " + token;

  return await fetch(urlString,{
      method: "PATCH",
      mode: "cors",
      cache: "no-cache",
      headers: {
          "Authorization": authToken,
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
      console.warn('update user failed: ' , error);
      throw error;
  });
}