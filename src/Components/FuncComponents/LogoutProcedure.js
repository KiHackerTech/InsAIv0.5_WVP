import React from "react"
import { useNavigate } from "react-router-dom"

export function LogoutProcedure(){
    localStorage.removeItem("Token")   //刪除作為登入依據的Token

}