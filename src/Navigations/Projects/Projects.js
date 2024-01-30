import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import axios from "axios"
import { BaseAPIURL } from "../../BaseInfo"
const baseAPIURL = BaseAPIURL()   //儲存API網址

import NavBarHeader from "../../Components/architecture/NavbarHeader"
import Footer from "../../Components/architecture/Footer"


function Projects(){

    const navigate = useNavigate()   //跳轉用函式
    
    const [ProjectList, setProjectList] = useState([1,2,3,4,5,6,7,8,9,10])
    const [ListProjects, setListProjects] = useState("")

    useEffect(() => {

        console.log("get projects info posted")

        let token = "1c9d24994e6f6cd89b6b39ae4d1d2b8f2d33c4e274126a7b072dd8df4376d414"
        axios
            .get(baseAPIURL + "api/project/getproject/?" + "token=" + token)
            .then((response) => {
                console.log("Get Projects Post Success:")
                console.log(response)
                // setProjectList(response.data)
            })
            .catch((err) => {
                console.log("Get Projects Post Error:")
                console.log(err)
                // alert("很抱歉，伺服器出了點問題");
                // navigate("/Login")
            })
    }, [])

    useEffect(() => {
        let ProjectItems = ProjectList.map((Project, index) => 
            <div className="col col-md-3 p-3 mb-3" key={index}>
                <div className="card ms-3">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Noun_Project_projects_icon_1327109_cc.svg/1024px-Noun_Project_projects_icon_1327109_cc.svg.png" className=" col card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">專案 {Project}</h5>
                        <p className="card-text"><strong>這裡是專案概述</strong></p></div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item"><a href="#" className="nav-link" onClick={() => {navigate("/Project/Step")}}>前往步驟</a></li>
                        <li className="list-group-item"><a href="#" className="nav-link">加入追蹤清單</a></li>
                        <li className="list-group-item"><a href="#" className="nav-link">下載模型</a></li>
                    </ul>
                    <div className="card-footer">
                        <div className="row align-items-center justify-content-end">
                            <div className="col-auto">
                                <a href="#" className="btn btn-outline-danger" onClick={() => {HandleDeleteProject(index)}}>刪除專案</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
        setListProjects(ProjectItems)
    }, [ProjectList])

    function HandleDeleteProject(ProjectID){
        if (confirm('你確定要刪除嗎') != true) {
            return 0
        }

        let data = {   //打包輸入的訊息待傳
            "username" : "asdf",
            "projectName" : "sjdklf"
        }

        console.log("delete project posted:")
        axios   //調用註冊API
            .post(baseAPIURL + "api/project/deleteproject", data)
            .then((response) => {   //登入成功執行跳轉到登入頁面
                console.log("Delete Project Success:")
                console.log(response)
                if(response.data.status == "success"){
                    let list_deleted = ProjectList
                    list_deleted.splice(ProjectID, 1)
                    setProjectList(()=>{return(
                        [...list_deleted]
                    )})
                }
            })
            .catch((err) => {   //登入失敗執行印出錯誤
                console.log("Delete Project Error :")
                console.log(err)
                alert("很抱歉，伺服器出了點問題導致刪除失敗")
            })

    }

    return(
        <div className="min-vh-100 vw-auto">
            <NavBarHeader />
            <div className="h-100 bg-light">
                <div className="row h-auto w-100">
                    {ListProjects}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export {Projects}