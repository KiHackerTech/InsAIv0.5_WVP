import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import NavBarHeader from "../../../../Components/architecture/NavbarHeader";
import Footer from "../../../../Components/architecture/Footer";

export default function Step(){

    const navigate = useNavigate()

    const [searchParams] = useSearchParams();

    useEffect(() => {   //用token存否進行登入check
        if(localStorage.getItem("Token") == null){   //沒token則跳轉到登入
            navigate("/Login")
        }
    },[])

    return(
        <>
        <div>
            <NavBarHeader/>
            <div className="min-vh-100 bg-light">
                <div className="row h-auto w-100">
                  
                  <div>請進行下列步驟{searchParams.get('projectName')}</div>
                  <button className="btn btn-outline-primary w-25" onClick={()=>{navigate("/Project/Step/uploadImg" + "?projectName=" + searchParams.get('projectName'))}}>前往上傳圖片</button>
                </div>
            </div>
            <Footer />
        </div>
        </>
    )
}
