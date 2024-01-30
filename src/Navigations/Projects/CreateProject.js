import React from "react"
import { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router"

import axios from "axios"

import {BaseAPIURL} from "../../BaseInfo.js"   //取得API網址
const baseAPIURL = BaseAPIURL()   //儲存API網址

import NavBarHeader from "../../Components/architecture/NavbarHeader"
import Footer from "../../Components/architecture/Footer"

function CreateProjectContent(){

    const navigate = useNavigate()   //跳轉用函式

    const [ProjectName, setProjectName] = useState("")
    const [ProjectNameError, setProjectNameError] = useState("")

    useEffect(() => {
        if(localStorage.getItem("Token") == null){
            navigate("/Login")
        }
    },[])

    function HandleSubmit(){
        if(ProjectName.length < 1){
            setProjectNameError("請輸入專案名稱請輸入專案名稱")
            return -1
        }else{
            setProjectNameError("")
        }

        console.log("create project posted")
        const data = {
            "UserID" : JSON.parse(localStorage.getItem("Token")).UserID,
            "projectName" : ProjectName
        }
        axios
            .post(baseAPIURL + "api/project/addproject", data)
            .then((response) => {
                if(response.data == "Success"){
                    console.log("Get Projects Post Success:")
                    console.log(response)
                    navigate("/Projects")
                }else if(response.data == "Project exist"){
                    alert("此專案名已被使用")
                }else{
                    console.log("Get Projects Post Faild:")
                    console.log(response)
                }
            })
            .catch((err) => {
                console.log("Create Project Post Error:")
                console.log(err)
                alert("很抱歉，伺服器出了點問題導致創建失敗");
                // navigate("/Projects")
            })

    }
    
    return(
        <form >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="row justify-content-center text-muted mb-3">請輸入下列資訊新增專案</div>
                    <div className="row justify-content-center">
                        <div className="text-start text-muted">專案名稱</div>
                        <div><input type="text" className="w-100 mb-3" onChange={(event) => {setProjectName(event.target.value)}} /></div>
                    </div>
                    <div className="text-danger">{ProjectNameError}</div>
                    <div className="row justify-content-center">
                        <div className="col text-end"><button className="btn btn-outline-primary" type="button" onClick={HandleSubmit}>新增專案</button></div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default function CreateProject(){

    return(
        <div className="vh-100 min-vh-100">
            <NavBarHeader />
            <div className="container h-100 vw-auto">
                <div className="row h-100 w-100 align-items-center justify-content-center">
                    <div className="col-10 col-xl-4 card shadow-lg">
                            <div className="card-body">
                                <h5 className="card-title">新增專案</h5>
                                <div className="card-text"><CreateProjectContent /></div>
                            </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
            
    )

}