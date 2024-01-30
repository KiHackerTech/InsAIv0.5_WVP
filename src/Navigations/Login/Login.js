import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios"   //引入呼叫API的工具
import sha256 from "crypto-js/sha256"   //印入sha256雜湊工具

import {BaseAPIURL, PasswordLengthMin} from "../../BaseInfo.js"   //取得API網址
const baseAPIURL = BaseAPIURL()   //儲存API網址
const PasswordLengthMinimum = PasswordLengthMin()   //儲存密碼長度最低要求

function LoginContent(){   //登入核心組件

    const navigate = useNavigate()   //跳轉用函式

    useEffect(() => {   //用Token存否判斷登入狀態跳轉專案頁
        if(localStorage.getItem("Token") != null){
            navigate("/Projects")
        }
    },[])


    const [Email, setEmail] = useState("")           //記錄輸入的訊息用
    const [Password, setPassword] = useState("")     //記錄輸入的訊息用

    const [EmailError, setEmailError] = useState("")   //錯誤訊息輸出
    const [PasswordError, setPasswordError] = useState("")   //錯誤訊息輸出

    function HandleSubmit(){   //登入Submit操作後執行
        let deny = false   //Submit取消旗標

        if(Password.length < PasswordLengthMinimum){   //密碼位數check
            setPasswordError("密碼應為至少" + PasswordLengthMinimum + "位數, 由0-9, a-z, A-Z組成")
            deny = true
        }else{
            setPasswordError("")
        }

        if((Email.includes("@") && Email.includes(".")) == false){   //Email格式check
            setEmailError("應符合電子信箱格式") 
            deny = true
        }else{
            setEmailError("")
        }

        if(deny){   //Submit取消if true
            return -1
        }

        console.log("login submitted")
        
        let data = {   //包裝post資訊
            "Email" : Email,
            "Password" : sha256(Password).toString()
        }
        
        axios   //調用登入API
            .post(baseAPIURL + "api/account/login", data)
            .then((response) => {   //登入成功執行
                console.log("Login Post Success:")
                console.log(response)
                if(response.data.Status == "Success"){
                    localStorage.setItem("Token", JSON.stringify(response.data.Token))   //存get到的Token
                    navigate("/Projects")   //跳轉到專案頁面
                }else{
                    alert("登入失敗")

                }
            })
            .catch((err) => {   //登入失敗執行印出錯誤
                console.log("Login Post Error :")
                console.log(err)
                alert("很抱歉，伺服器出了點問題")
            })

    }

    return (
        <form >
            <div className="row justify-content-center">
                <div className="row justify-content-center">請輸入下列資訊以登入</div>
                <div className="row justify-content-center">
                    <div className="text-start text-muted">*Email</div>
                    <div><input type="text" className="w-100" onChange={(event) => {setEmail(event.target.value)}}/></div>
                    <div>{EmailError}</div>
                </div>
                <div className="row justify-content-center">
                    <div className="text-start text-muted">*密碼</div>
                    <div><input type="password" className="w-100" onChange={(event) => {setPassword(event.target.value)}}/></div>
                    <div>{PasswordError}</div>
                </div>
                <div className="row justify-content-center">
                    <div className="col text-start"><button className="btn btn-outline-primary" type="button" onClick={HandleSubmit}>登入</button></div>
                    <div className="col text-end"><button className="btn btn-link" onClick={()=> navigate("/")}>還沒有帳號?註冊</button></div>
                </div>
            </div>
        </form>
    )
}

function Login(){   //登入頁面配置

    return(
        <div className="min-vh-100 vw-auto">
            <div className="container vh-100">
                <div className="row h-100 w-100 justify-content-center align-items-center">
                    <div className="col-xl-4 card shadow-lg">
                            <div className="card-body">
                                <h5 className="card-title">InsAI</h5>
                                <div className="card-text"><LoginContent /></div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {Login, LoginContent}