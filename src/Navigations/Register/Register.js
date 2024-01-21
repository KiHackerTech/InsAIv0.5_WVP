import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from "axios"

import BaseURL from "../../BaseInfo.js"   //取得API網址
const baseURL = BaseURL()   //儲存API網址

export default function Register(){
    const navigate = useNavigate()   //跳轉用函式

    const [FirstName, setFirstName] = useState()   //記錄輸入的訊息用
    const [LastName, setLastName] = useState()     //記錄輸入的訊息用
    const [Email, setEmail] = useState()           //記錄輸入的訊息用
    const [Password, setPassword] = useState()     //記錄輸入的訊息用

    function HandleSubmit(){   //註冊Submit操作後執行
        console.log("register submit")

        let data = {   //打包輸入的訊息待傳
            "FirstName" : FirstName,
            "LastName"  : LastName,
            "Email"     : Email,
            "Password"  : Password
        }

        axios   //調用註冊API
            .post(baseURL + "Register", data)
            .then((response) => {   //登入成功執行跳轉到登入頁面
                console.log(response)
                if(response.data.status == "success"){
                    navigate("/Login")
                }
            })
            .catch((err) => {   //登入失敗執行印出錯誤
                console.log("Register Post Error :")
                console.log(err)

            })
            
    }

    return (
        <>
            <form>

                <label>InsAI</label>
                <br/><br/>
                <label>姓氏</label><input type="text" onChange={(event) =>{setLastName(event.target.value)}}></input><br/>
                <label>名字</label><input type="text" onChange={(event) =>{setFirstName(event.target.value)}}></input><br/>
                <label>Email</label><input type="text" onChange={(event) =>{setEmail(event.target.value)}}></input><br/>
                <label>密碼</label><input type="text" onChange={(event) =>{setPassword(event.target.value)}}></input><br/>
                <br/>
                
                <button type="button" onClick={HandleSubmit}>註冊</button>

                <a href="#" onClick={()=> navigate("/Login")}>已有帳號?登入</a>
            </form>
        </>
    )
}