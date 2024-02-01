import React from "react"
import { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router"

import NavBarHeader from "../../../Components/architecture/NavbarHeader"
import Footer from "../../../Components/architecture/Footer"
import { APIaddProject } from "../../../Components/FuncComponents/API_Manager.js"

function CreateProjectContent(){

    const navigate = useNavigate()   //跳轉用函式

    const [ProjectName, setProjectName] = useState("")   //存輸入的指定專案名稱用
    const [ProjectNameError, setProjectNameError] = useState("")   //存輸入錯誤時的報錯訊息

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

    function HandleSubmit(){   //call API: 送出指定使用者要新增的指定專案名稱
        if(ProjectName.length < 1){   //確認輸入是否正確
            setProjectNameError("請輸入專案名稱請輸入專案名稱")
            return -1
        }else{
            setProjectNameError("")
        }

        console.log("create project posted")
        const data = {   //打包必要的訊息待傳
            "UserID" : JSON.parse(localStorage.getItem("Token")).UserID,
            "projectName" : ProjectName
        }
        APIaddProject(data)   //調用新增專案API
            .then((response) => {   //新增專案成功則跳轉到專案顯示頁面
                if(response.data.Status == "Success"){
                    console.log("Get Projects Post Success:")
                    console.log(response)
                    navigate("/Projects")
                }else if(response.data.Status == "Failed"){
                    if(response.data.Message == "Exist"){
                        alert("此專案名已被使用")
                    }else{
                        alert("很抱歉，似乎出了點問題");
                    }
                }else{
                    console.log("Get Projects Post Faild:")
                    console.log(response)
                    alert("很抱歉，似乎出了點問題");
                }
            })
            .catch((err) => {   //新增專案失敗則跳錯
                console.log("Create Project Post Error:")
                console.log(err)
                alert("很抱歉，出了點問題導致創建失敗");
                // navigate("/Projects")
            })

    }
    
    return(   //表單頁面配置
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

    return(   //頁面配置及Header,Footer引入
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