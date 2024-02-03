import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { APIuploadImg } from "../../../../../Components/FuncComponents/API_Manager";

export default function UploadImg(){

    const navigate = useNavigate()

    const [searchParams] = useSearchParams();

    const [Imgs, setImgs] = useState("")

    useEffect(() => {   //用token存否進行登入check
        if(localStorage.getItem("Token") == null){   //沒token則跳轉到登入
            navigate("/Login")
        }
    },[])

    function HandleSubmit(event){
        event.preventDefault()
        let formData = new FormData();
        formData.append("projectName", searchParams.get('projectName'));
        formData.append("image", Imgs[0]);
        
        APIuploadImg(formData)
            .then((response) => {
                console.log(response)
            })
            .catch((err) => {
                console.log(err)
            })
            
        // console.log(Imgs)
    }

    return(
        <>
            <form onSubmit={HandleSubmit}>
                <input type="file" onChange={(event) =>{setImgs(event.target.files)}} />
                <div><button type="submit" className="btn btn-primary">上傳</button></div>
            </form>
        </>
    )
    
}