import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios"

import BaseURL from "../../BaseInfo.js"   //取得API網址
const baseURL = BaseURL()   //儲存API網址

export default function Login(){
    const navigate = useNavigate()   //跳轉用函式

    const [Email, setEmail] = useState()           //記錄輸入的訊息用
    const [Password, setPassword] = useState()     //記錄輸入的訊息用

    function HandleSubmit(){   //登入Submit操作後執行
        console.log("login submit")
        
        let data = {
            "Email" : Email,
            "Password" : Password
        }
        
        axios   //調用登入API
            .post(baseURL + "Login", data)
            .then((response) => {   //登入成功執行跳轉到專案頁面
                console.log(response)
                if(response.data.status == "success"){
                    navigate("/Login")
                }
            })
            .catch((err) => {   //登入失敗執行印出錯誤
                console.log("Login Post Error :")
                console.log(err)
            })

    }

    return(
        <>
            <form >
                <label>Email</label><input type="text" onChange={(event) => {setEmail(event.target.value)}}/><br/>
                <label>密碼</label><input type="text" onChange={(event) => {setPassword(event.target.value)}}/><br/>
                <button type="button" onClick={HandleSubmit}>登入</button>

                <a href="#" onClick={() => navigate("/")}>註冊</a>
            </form>
        </>
    )
}
