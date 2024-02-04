import React from "react"
import { useState, useEffect } from "react"
import { createSearchParams, useNavigate } from "react-router-dom"

import { APIdeleteProject, APIgetProjects } from "../../../Components/FuncComponents/API_Manager"
import { LogoutProcedure } from "../../../Components/FuncComponents/LogoutProcedure"

import NavBarHeader from "../../../Components/architecture/NavbarHeader"
import Footer from "../../../Components/architecture/Footer"

function ListProjects(props){   //將ProjectList中的所有專案列出顯示
    
    const navigate = useNavigate()   //跳轉用函式

    function HandleGotoStep(Project){
        const params = {
            projectName : Project.projectName,
            ProjectID : Project.ProjectID,

        }
        const search_Params = createSearchParams(params)
        navigate({
            pathname: '/Project/Step/',
            search: "?" + search_Params
        })
    }

    function HandleDeleteProject(ProjectID, index){   //call API: 刪除指定使用者的指定專案
        if (confirm('你確定要刪除嗎') != true) {
            return 0
        }
    
        let params = {   //打包輸入的訊息待傳
            "ProjectID" : ProjectID
        }
        console.log("delete project posted:")
        APIdeleteProject(params)   //調用刪除API
            .then((response) => {   //登入成功執行跳轉到登入頁面
                console.log("Delete Project post Success:")
                console.log(response)
                if(response.data.Status == "Success"){
                    let list_deleted = props.ProjectList
                    list_deleted.splice(index, 1)
                    props.setProjectList(()=>{return(
                        [...list_deleted]
                    )})
                    
                }else{
                    alert("很抱歉，似乎出了點問題")
                    LogoutProcedure()
                    navigate("/Login")
                }
            })
            .catch((err) => {   //登入失敗執行印出錯誤
                console.log("Delete Project Error :")
                console.log(err)
                alert("很抱歉，似乎出了點問題")
            })
    
    }

    let ProjectItems
    if(props.ProjectList.length < 1){
        ProjectItems = <div>還沒有專案，點擊右上方加號新增專案</div>
    }else{
        ProjectItems = props.ProjectList.map((Project, index) => {
            return(
                <div className="col col-md-3 p-3 mb-3" key={Project.ProjectID}>
                    <div className="card ms-3">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Noun_Project_projects_icon_1327109_cc.svg/1024px-Noun_Project_projects_icon_1327109_cc.svg.png" className=" col card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">{Project.projectName}</h5>
                            <p className="card-text"><strong>這裡是專案概述</strong></p></div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item"><a href="#" className="nav-link" onClick={()=>{HandleGotoStep(Project)}}>前往步驟</a></li>
                            <li className="list-group-item"><a href="#" className="nav-link">加入追蹤清單</a></li>
                            <li className="list-group-item"><a href="#" className="nav-link">下載模型</a></li>
                        </ul>
                        <div className="card-footer">
                            <div className="row align-items-center justify-content-end">
                                <div className="col-auto">
                                    <a href="#" className="btn btn-outline-danger" onClick={() => {HandleDeleteProject(Project.ProjectID, index)}}>刪除專案</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    )
    }

    return ProjectItems

}

function Projects(){

    const navigate = useNavigate()   //跳轉用函式
    
    const [UserID, setUserID] = useState("")   //存使用者ID，call API用
    const [Token, setToken] = useState("")   //存token，call API用
    
    const [ProjectList, setProjectList] = useState([])   //存所有專案列表

    useEffect(() => {   //用token存否進行登入check
        if(localStorage.getItem("Token") == null){   //沒token則跳轉到登入
            navigate("/Login")
        }else{   //有token則抓取必要資訊
            try{
                setUserID(JSON.parse(localStorage.getItem("Token")).UserID)
                setToken(JSON.parse(localStorage.getItem("Token")).JWT_SIGN_PUBLIC_KEY)
            } catch (err){
                console.log("getPrimeInfoError:")
                console.log(err)
                LogoutProcedure()
                navigate("/Login")
            }
        }
    },[])

    function RefreshAllProjects(){
        console.log("get projects info posted")
        const params = {
            "UserID" : UserID
        }
        APIgetProjects(params)   //調用取得專案列表API
            .then((response) => {
                if(response.data.Status == "Success"){
                    console.log("Get Projects Post Success:")
                    console.log(response)
                    setProjectList(response.data.Message)
                }else{
                    alert("取得專案失敗")
                    LogoutProcedure()
                    navigate("/Login")

                }
            })
            .catch((err) => {
                console.log("Get Projects Post Error:")
                console.log(err)
                alert("很抱歉，似乎出了點問題");
                LogoutProcedure()
                navigate("/Login")
            })
    }

    useEffect(() => {   //call API: 查詢指定使用者的所有專案，存入ProjectList
        RefreshAllProjects()

    }, [UserID, Token])

    return(   //頁面配置及Header,Footer引入
        <div>
            <NavBarHeader  SearchBoxEnable={true} setProjectList={setProjectList} UserID={UserID} RefreshAllProjects={RefreshAllProjects} />
            <div className="min-vh-100 bg-light">
                <div className="row h-auto w-100">
                    <ListProjects setProjectList={setProjectList}  ProjectList={ProjectList}/>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export {Projects, ListProjects}