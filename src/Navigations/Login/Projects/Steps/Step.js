import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import NavBarHeader from "../../../../Components/architecture/NavbarHeader";
import Footer from "../../../../Components/architecture/Footer";

export default function Step(){

    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    useEffect(() => {   //用token存否進行登入check和searchPrarms check
        if(localStorage.getItem("Token") == null){   //沒token則跳轉到登入
            LogoutProcedure()
            navigate("/Login")
        }else if(searchParams.toString().length < 1){   //沒searchPrarms則跳轉到Projects
            navigate("/Projects")
        }
    },[])

    function HandleGotoUpload(){
        navigate({
            pathname: '/Project/Step/uploadImg',
            search: "?" + searchParams.toString()
        })
    }

    function HandleGotoViewAllImg(){
        navigate({
            pathname: '/Project/Step/ViewAllImg',
            search: "?" + searchParams.toString()
        })
    }

    return(
        <>
        <div>
            <NavBarHeader PlusSignFunction={()=>{navigate("/Project/CreateProject")}}/>
            <div className="min-vh-100 bg-light">
                <div className="row h-auto w-100">
                  <div>請進行下列---{searchParams.get("projectName")}---專案的步驟</div>
                  <div className="pb-2"><button className="btn btn-outline-primary w-25" onClick={HandleGotoUpload}>前往上傳圖片</button></div>
                  <div className="pb-2"><button className="btn btn-outline-primary w-25" onClick={HandleGotoViewAllImg}>檢視將用來生成的圖片</button></div>
                </div>
            </div>
            <Footer />
        </div>
        </>
    )
}
