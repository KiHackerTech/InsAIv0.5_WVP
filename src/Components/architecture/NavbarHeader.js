import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from "axios"

import { BaseAPIURL } from "../../BaseInfo"
const baseAPIURL = BaseAPIURL()   //儲存API網址UBLIC_KEY

import {LogoutProcedure} from "../FuncComponents/LogoutProcedure"

export default function NavBarHeader({searchProject, UserID, Token}){

    const navigate = useNavigate()   //跳轉用函式

    const [SearchProject_keyWord, setSearchProject_keyWord] = useState("")

    function HandleSearchProject(){   //call API: 搜尋指定專案並凸顯出來
        if(SearchProject_keyWord.length <1){   //確認輸入是否正確
            return -1
        }

        console.log("search projects posted")
        axios   //調用查詢API
            .get(baseAPIURL + "api/project/searchproject/?" + "UserID=" + UserID + "&projectName=" + SearchProject_keyWord + "&token=" + Token)
            .then((response) => {
                console.log(response)
                if(response.data == "Failed"){
                    alert("查無此專案")
                    return -1
                }
                searchProject(response.data)
            })
            .catch((err) => {
                console.log("Search Projects Post Error:")
                console.log(err)
                alert("很抱歉，伺服器出了點問題");
                // navigate("/Login")
            })
    }
    
    function HandleLogout(){   //處理登出流程
        LogoutProcedure()
        navigate("/Login")
    }

    return(   //navbar畫面
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <div className="container-fluid">
                <a href="" className="navbar-brand">InsAI</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#ProjectsHeader" aria-controls="ProjectsHeader" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-between" id="ProjectsHeader">
                    <ul className="navbar-nav ">
                        <li className="nav-item">
                            <a href="#" className="nav-link ps-4" onClick={() => {navigate("/Projects")}} aria-current="page">我的專案</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link ps-4" aria-current="page">共用專案</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link ps-4" aria-current="page">常見問題</a>
                        </li>
                    </ul>
                    <div className="row h-100 align-items-center">
                        <a href="#" className="col-auto nav-link ps-4" onClick={()=>{navigate("/Project/CreateProject")}} aria-current="page"><h2>+</h2></a>
                        <form className="col w-10 d-flex">
                            <input className="form-control me-2" type="search" onChange={(event)=>{setSearchProject_keyWord(event.target.value)}} placeholder="查詢專案" aria-label="Search" />
                            <button className="btn btn-outline-success" type="button" onClick={()=>{HandleSearchProject()}}>Search</button>
                        </form>
                        <a href="#" className="col-auto nav-link" onClick={HandleLogout}>登出</a>
                    </div>

                </div>

            </div>
        </nav>
    )
}
