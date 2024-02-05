import React from "react"
import { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import sha256 from "crypto-js/sha256"   //印入sha256雜湊工具

import {PasswordLengthMin} from "../../BaseInfo.js"   //取得API網址
import { APIuserSignup } from "../../Components/FuncComponents/API_Manager.js"

function RegisterContent(){   //註冊核心組件
    const navigate = useNavigate()   //跳轉用函式

    const [FirstName, setFirstName] = useState("f")                //記錄輸入的訊息用
    const [LastName, setLastName] = useState("")                   //記錄輸入的訊息用
    const [Email, setEmail] = useState("")                         //記錄輸入的訊息用
    const [Password, setPassword] = useState("")                   //記錄輸入的訊息用
    const [ConfirmPassword, setConfirmPassword] = useState("")     //記錄輸入的訊息用

    const [EmailError, setEmailError] = useState("")           //錯誤訊息輸出
    const [PasswordError, setPasswordError] = useState("")     //錯誤訊息輸出
    const [cPasswordError, setcPasswordError] = useState("")   //錯誤訊息輸出
    const [MainError, setcMainError] = useState("")            //錯誤訊息輸出

    useEffect(() => {   //用Token存否判斷登入狀態跳轉專案頁
        if(localStorage.getItem("Token") != null){
            navigate("/Projects")
        }
    },[])

    function HandleSubmit(event){   //註冊Submit操作後執行
        event.preventDefault()
        
        let deny = false

        if(   FirstName.trim().length
            * LastName.trim().length
            * Email.trim().length
            * Password.trim().length
            * ConfirmPassword.trim().length == 0){
            setcMainError("*為必填項目")
            deny = true
        }else{
            setcMainError("")
        }

        if((Email.includes("@") && Email.includes(".")) == false){
            setEmailError("應符合電子信箱格式") 
            deny = true
        }else{
            setEmailError("")
        }
        
        if(Password.length < PasswordLengthMin){
            setPasswordError("密碼應為至少" + PasswordLengthMin + "位數, 由0-9, a-z, A-Z組成") 
            deny = true
        }else{
            setPasswordError("")
        }
        
        if(Password != ConfirmPassword){
            setcPasswordError("密碼不相同") 
            deny = true
        }else{
            setcPasswordError("")
        }

        if(deny){
            return -1
        }

        console.log("register submitted")
        let data = {   //打包輸入的訊息待傳
            "FirstName" : FirstName,
            "LastName"  : LastName,
            "Email"     : Email,
            "Password"  : sha256(Password).toString()
        }

        APIuserSignup(data)   //調用註冊API
            .then((response) => {   //登入成功執行跳轉到登入頁面
                console.log("Register Post Success")
                if(response.data.Status == "Success"){
                    alert("註冊成功")
                    navigate("/Login")
                }else if(response.data.Status == "Failed"){
                    if(response.data.Message == "Exist"){
                        alert("此Email已被註冊")
                    }
                }else{
                    console.log(response)
                    alert("很抱歉，似乎出了點問題")
                }
            })
            .catch((err) => {   //登入失敗執行印出錯誤
                console.log("Register Post Error :")
                console.log(err)
                alert("很抱歉，似乎出了點問題")

            })
            
    }
    return (
        <form onSubmit={HandleSubmit}>
            <div className="row justify-content-center">
                <div className="col">
                    <div className="row justify-content-center">請填寫以下資訊</div>
                    <div className="row justify-content-center">
                        <div className="text-start text-muted">*姓氏</div>
                        <div><input type="text" className="w-100" onChange={(event) =>{setLastName(event.target.value)}} /></div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="text-start text-muted">*名字</div>
                        <div><input type="text" className="w-100" onChange={(event) =>{setFirstName(event.target.value)}} /></div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="text-start text-muted">*Email</div>
                        <div><input type="email" className="w-100" onChange={(event) =>{setEmail(event.target.value)}} /></div>
                        <div>{EmailError}</div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="text-start text-muted">*密碼</div>
                        <div><input type="password" className="w-100" onChange={(event) =>{setPassword(event.target.value)}} /></div>
                        <div>{PasswordError}</div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="text-start text-muted">*確認密碼</div>
                        <div><input type="password" className="w-100" onChange={(event) =>{setConfirmPassword(event.target.value)}}/></div>
                        <div>{cPasswordError}</div>   
                    </div>
                    <div>{MainError}</div>
                    <div className="row p-3 justify-content-center">
                        <div className="col text-start"><button className="btn btn-outline-primary" type="submit">註冊</button></div>
                        <div className="col text-end"><button className="btn btn-link" onClick={()=> navigate("/Login")}>已有帳號?登入</button></div>
                    </div>
                </div>
            </div>
        </form>
)
    
}

function Register(){
    return (
        <div className="min-vh-100 vw-auto">
            <div className="container vh-100">
                <div className="row h-100 w-100 align-items-center justify-content-center">
                    <div className="col-10 col-xl-4 card shadow-lg">
                            <div className="card-body">
                                <h5 className="card-title">InsAI</h5>
                                <div className="card-text"><RegisterContent /></div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {Register, RegisterContent}