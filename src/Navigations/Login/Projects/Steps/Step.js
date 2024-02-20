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

    const [LastStep, setLastStep] = useState(0)
    const [ButtonLayout, setButtonLayout] = useState(["secondary disabled", "secondary disabled", "secondary disabled", "secondary disabled", "secondary disabled"])

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
                const lastStep  = response.data.Message.laststep
                setLastStep(lastStep)
                if(response.data.Status == "Success" && lastStep >= 0){
                    let ButtonLayoutList = ButtonLayout
                    ButtonLayoutList.forEach((LayoutStyle)=>{
                        if(ButtonLayoutList.indexOf(LayoutStyle) < lastStep){
                            ButtonLayoutList[ButtonLayoutList.indexOf(LayoutStyle)] = "outline-secondary"
                        }else if(ButtonLayoutList.indexOf(LayoutStyle) == lastStep){
                            ButtonLayoutList[ButtonLayoutList.indexOf(LayoutStyle)] = "primary"
                        }else{
                            ButtonLayoutList[ButtonLayoutList.indexOf(LayoutStyle)] = "secondary disabled"
                        }
                    })
                    if(lastStep > 4){
                        ButtonLayoutList[0] = "secondary disabled"
                        ButtonLayoutList[4] = "secondary disabled"
                    }
                    setButtonLayout([...ButtonLayoutList])
                }
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    function HandleGotoNext(props){
        navigate({
            pathname: "/Project/Step/" + props.url,
            search: "?" + searchParams.toString()
        })
    }

    return(
        <>
            <NavBarHeader PlusSignFunction={()=>{navigate("/Project/CreateProject")}}/>
            <div className="min-vh-100 bg-light">
                <div className="row text-center h-auto w-100">
                    <div>請繼續進行下列專案『{searchParams.get("projectName")}』的步驟{LastStep+1}</div>
                    <div className="pb-2"><button className={"w-25 btn btn-" + ButtonLayout[0]} onClick={()=>{HandleGotoNext({url : "uploadImg"})}}>前往上傳圖片</button></div>
                    <div className="pb-2"><button className={"w-25 btn btn-" + ButtonLayout[1]} onClick={()=>{HandleGotoNext({url : "ViewAllImg"})}}>檢視已上傳的圖片</button></div>
                    <div className="pb-2"><button className={"w-25 btn btn-" + ButtonLayout[2]} onClick={()=>{HandleGotoNext({url : "uploadReq"})}}>前往上傳需求</button></div>
                    <div className="pb-2"><button className={"w-25 btn btn-" + ButtonLayout[3]} onClick={()=>{HandleGotoNext({url : "ViewReq"})}}>檢視已上傳的需求</button></div>
                    <div className="pb-2"><button className={"w-25 btn btn-" + ButtonLayout[4]} onClick={()=>{HandleGotoNext({url : "CheckAllImg"})}}>確認已上傳的圖片</button></div>
                </div>
            </div>
            <Footer />
        </>
    )
}
