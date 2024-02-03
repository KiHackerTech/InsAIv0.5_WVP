import axios from "axios";
import { BaseAPIURL } from "../../BaseInfo"

const accountAPI = axios.create({
    baseURL : BaseAPIURL() + "api/account/"
})

const projectAPI = axios.create({
    baseURL : BaseAPIURL() + "api/project/"
})

const stepAPI = axios.create({
    baseURL : BaseAPIURL() + "api/project/step/"
})

export const APIuserSignup = data => accountAPI.post("signup", data)
export const APIuserLogin = data => accountAPI.post("login", data)

export const APIgetProjects = params => projectAPI.get("getproject", {params})
export const APIaddProject = data => projectAPI.post("addproject", data)
export const APIsearchProject = params => projectAPI.get("searchproject", {params})
export const APIdeleteProject = params => projectAPI.delete("deleteproject", {params})

export const APIuploadImg = data => stepAPI.post("uploadImg", data, {
    headers: {
        'Content-Type': 'multipart/form-data'
      }
})