import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { APInextStep } from "../../../../../Components/FuncComponents/API_Manager"



export default function ViewReq(){

    const [searchParams] = useSearchParams()

    useEffect(()=>{
        const data = {
            ProjectID : searchParams.get("ProjectID"),
            setStep : 4
        }
        APInextStep(data)
            .then((response)=>{
                if(response.data.Status == "Success"){
                    
                }
            })
            .catch((err)=>{
                console.log(err)
            })
    }, [])

    return(
        <div className="d-flex flex-row">
            view
        </div>
    )
}