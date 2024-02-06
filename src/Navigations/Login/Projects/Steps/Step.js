import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import { APIgetStep } from "../../../../Components/FuncComponents/API_Manager";

import NavBarHeader from "../../../../Components/architecture/NavbarHeader";
import Footer from "../../../../Components/architecture/Footer";

export default function Step(){

    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const [LastStep, setLastStep] = useState(["primary", "primary"])
    const [ButtonLayout, setButtonLayout] = useState(["primary", "primary"])

    useEffect(() => {   //用token存否進行登入check和searchPrarms check
        if(localStorage.getItem("Token") == null){   //沒token則跳轉到登入
            LogoutProcedure()
            navigate("/Login")
        }else if(searchParams.toString().length < 1){   //沒searchPrarms則跳轉到Projects
            navigate("/Projects")
        }else{
            FollowLastStep()
        }
    },[])
    
    function FollowLastStep(){
        console.log("get step posted")
        APIgetStep({ProjectID : searchParams.get("ProjectID")})
            .then((response)=>{
                console.log("get step success:")
                console.log(response)
                setLastStep(response.data.Message.laststep)
                const lastStep  = response.data.Message.laststep
                if(response.data.Status == "Success" && lastStep > 0){
                    let ButtonLayoutList = ButtonLayout
                    ButtonLayoutList.forEach((LayoutStyle)=>{
                        if(ButtonLayoutList.indexOf(LayoutStyle) < lastStep){
                            ButtonLayoutList[ButtonLayoutList.indexOf(LayoutStyle)] = "outline-secondary"
                        }
                    })
                    // ButtonLayoutList[lastStep-1] = "outline-secondary"
                    console.log(ButtonLayoutList)
                    setButtonLayout([...ButtonLayoutList])
                }
            })
            .catch((err)=>{

            })
    }

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
            <NavBarHeader PlusSignFunction={()=>{navigate("/Project/CreateProject")}}/>
            <div className="min-vh-100 bg-light">
                <div className="row h-auto w-100">
                    <div>請繼續進行下列專案『{searchParams.get("projectName")}』的步驟{LastStep+1}</div>
                    <div className="pb-2"><button className={"w-25 btn btn-" + ButtonLayout[0]} onClick={HandleGotoUpload}>前往上傳圖片</button></div>
                    <div className="pb-2"><button className={"w-25 btn btn-" + ButtonLayout[1]} onClick={HandleGotoViewAllImg}>檢視已上傳的圖片</button></div>
                </div>
            </div>
            <Footer />
        </>
    )
}
