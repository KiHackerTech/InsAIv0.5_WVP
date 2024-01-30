import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Step(){

    const navigate = useNavigate()

    useEffect(() => {
        if(localStorage.getItem("Token") == null){
            navigate("/Login")
        }
    },[])

    return(
        <>
            Step Page
        </>
    )
}
