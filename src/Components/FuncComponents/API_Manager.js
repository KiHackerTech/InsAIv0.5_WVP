import axios from "axios";
import { BaseAPIURL } from "../../BaseInfo"
import { LogoutProcedure } from "./LogoutProcedure";

var UserID, Token;

try{
    UserID = JSON.parse(localStorage.getItem("Token")).UserID
    Token = JSON.parse(localStorage.getItem("Token")).JWT_SIGN_PUBLIC_KEY
}catch(err){}

const accountAPI = axios.create({
    baseURL : BaseAPIURL + "api/account"
})
accountAPI.interceptors.request.use(
    function(config){
        config.headers["Authorization"] = "Bearer " + Token

        return config
    },
    function(err){
        return Promise.reject(err)
    }
)

const projectAPI = axios.create({
    baseURL : BaseAPIURL + "api/project"
})
projectAPI.interceptors.request.use(
    function(config){
        config.headers["Authorization"] = "Bearer " + Token

        return config
    },
    function(err){
        return Promise.reject(err)
    }
)

const stepAPI = axios.create({
    baseURL : BaseAPIURL + "api/project/step",
})
stepAPI.interceptors.request.use(
    function(config){
        config.headers["Authorization"] = "Bearer " + Token

        return config
    },
    function(err){
        return Promise.reject(err)
    }
)


export const APIuserSignup = data => accountAPI.post("/signup", data)
export const APIuserLogin = data => accountAPI.post("/login", data)

export const APIgetProjects = params => projectAPI.get("/getproject", {params})
export const APIaddProject = data => projectAPI.post("/addproject", data)
export const APIsearchProject = params => projectAPI.get("/searchproject", {params})
export const APIdeleteProject = params => projectAPI.delete("/deleteproject", {params})

export const APIuploadImg = data => stepAPI.post("/uploadImg", data, {
    "Content-Type" : "multipart/form-data",
    timeout : 10000
})
export const APIgetStep = params => stepAPI.get("/getstep", {params})
export const APInextStep = data => stepAPI.post("/setstep", data)
export const APIgetImg = params => stepAPI.get("/getimg", {params})
export const APIdeleteImg = params => stepAPI.delete("/deleteimg", {params})
export const APIuploadReq = data => stepAPI.post("/uploadReq", data)

