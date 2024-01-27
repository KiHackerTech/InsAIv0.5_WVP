import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from "axios"

import BaseURL from "../../BaseInfo.js"   //取得API網址
const baseURL = BaseURL()   //儲存API網址

export default function Register(){
    const navigate = useNavigate()   //跳轉用函式

    const [FirstName, setFirstName] = useState("f")                 //記錄輸入的訊息用
    const [LastName, setLastName] = useState("")                   //記錄輸入的訊息用
    const [Email, setEmail] = useState("")                         //記錄輸入的訊息用
    const [Password, setPassword] = useState("")                   //記錄輸入的訊息用
    const [ConfirmPassword, setConfirmPassword] = useState("")     //記錄輸入的訊息用

    const [EmailError, setEmailError] = useState("")
    const [PasswordError, setPasswordError] = useState("")
    const [cPasswordError, setcPasswordError] = useState("")
    const [MainError, setcMainError] = useState("")

    function HandleSubmit(){   //註冊Submit操作後執行
        let deny = false

        if(   FirstName.trim().length
            * LastName.trim().length
            * Email.trim().length
            * Password.trim().length
            * ConfirmPassword.trim().length == 0){
            setcMainError("全部都是必填")
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
        
        if(Password.length <= 8){
            setPasswordError("密碼應為至少8位數, 0-9, a-z, A-Z") 
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
                <div><label>姓氏</label><input type="text" onChange={(event) =>{setLastName(event.target.value)}}></input></div>
                <div><label>名字</label><input type="text" onChange={(event) =>{setFirstName(event.target.value)}}></input></div>
                <div><label>Email</label><input type="email" onChange={(event) =>{setEmail(event.target.value)}}></input><div>{EmailError}</div></div>
                <div><label>密碼</label><input type="text" onChange={(event) =>{setPassword(event.target.value)}}></input><div>{PasswordError}</div></div>
                <div><label>確認密碼</label><input type="text" onChange={(event) =>{setConfirmPassword(event.target.value)}}></input><div>{cPasswordError}</div></div>
                <br/>
                <div>{MainError}</div>
                <br/>
                <button type="button" onClick={HandleSubmit}>註冊</button>

                <a href="#" onClick={()=> navigate("/Login")}>已有帳號?登入</a>
            </form>
        </>
    )
}