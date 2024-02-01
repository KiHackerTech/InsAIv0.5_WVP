import React from "react";

import axios from "axios";
import { BaseAPIURL } from "../../BaseInfo"

// function paramsConverter(myParams){
//     const params_string = new URLSearchParams(myParams).toString();
//     return params_string
// }

const accountAPI = axios.create({
    baseURL : BaseAPIURL() + "api/account/"
})

const projectAPI = axios.create({
    baseURL : BaseAPIURL() + "api/project/"
})

export const APIuserSignup = data => accountAPI.post("signup", data)
export const APIuserLogin = data => accountAPI.post("login", data)

export const APIgetProjects = params => projectAPI.get("getproject", {params})
export const APIaddProject = data => projectAPI.post("addproject", data)
export const APIsearchProject = params => projectAPI.get("searchproject", {params})
export const APIdeleteProject = params => projectAPI.delete("deleteproject", {params})