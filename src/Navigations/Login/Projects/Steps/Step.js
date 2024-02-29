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
    const [ButtonLayout, setButtonLayout] = useState(["secondary disabled", "secondary disabled", "secondary disabled", "secondary disabled", "secondary disabled", "secondary disabled", "secondary disabled"])

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
                            ButtonLayoutList[ButtonLayoutList.indexOf(LayoutStyle)] = "outline-light"
                        }else if(ButtonLayoutList.indexOf(LayoutStyle) == lastStep){
                            ButtonLayoutList[ButtonLayoutList.indexOf(LayoutStyle)] = "light"
                        }else{
                            ButtonLayoutList[ButtonLayoutList.indexOf(LayoutStyle)] = "outline-dark disabled"
                        }
                    })
                    if(lastStep > 4){
                        ButtonLayoutList[0] = "outline-dark disabled"
                        ButtonLayoutList[4] = "outline-dark disabled"
                    }
                    if(lastStep > 5){
                        ButtonLayoutList[2] = "outline-dark disabled"
                        ButtonLayoutList[5] = "outline-dark disabled"
                    }
                    if(lastStep > 6){
                        ButtonLayoutList[6] = "light"
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
            <div className="d-flex min-vh-100 bg-light my-1">
                <div className="d-flex flex-column text-end w-25 bg-dark text-secondary">
                    <ul className="d-flex flex-column h-75 mt-4 pe-4" style={{"list-style" : "none" }}>
                        <li className="my-auto text-success fs-5"><div>請接續專案『{searchParams.get("projectName")}』的步驟 {LastStep+1}</div></li>
                        <li className={"my-auto " + [LastStep==0? "text-white" : ""]}>前往上傳待訓練的圖片</li>
                        <li className={"my-auto " + [LastStep==1? "text-white" : ""]}>瀏覽已上傳的圖片</li>
                        <li className={"my-auto " + [LastStep==2? "text-white" : ""]}>前往上傳模型的需求</li>
                        <li className={"my-auto " + [LastStep==3? "text-white" : ""]}>瀏覽需求</li>
                        <li className={"my-auto " + [LastStep==4? "text-white" : ""]}>確認要用來訓練的圖片</li>
                        <li className={"my-auto " + [LastStep==5? "text-white" : ""]}>確認要用來訓練的需求</li>
                        <li className={"my-auto " + [LastStep==6? "text-info fs-3" : ""]}>送出訓練</li>
                    </ul>
                </div>
                <div className="d-flex flex-column text-center h-auto w-75 bg-secondary">
                    <ul className="d-flex flex-column h-75 mt-4" style={{"list-style" : "none" }}>
                        <li className="my-auto"></li>
                        <li className="my-auto"><div className="pb-2"><button className={"w-50 btn btn-" + ButtonLayout[0]} onClick={()=>{HandleGotoNext({url : "uploadImg"})}}>前往上傳圖片</button></div></li>
                        <li className="my-auto"><div className="pb-2"><button className={"w-50 btn btn-" + ButtonLayout[1]} onClick={()=>{HandleGotoNext({url : "ViewAllImg"})}}>檢視已上傳的圖片</button></div></li>
                        <li className="my-auto"><div className="pb-2"><button className={"w-50 btn btn-" + ButtonLayout[2]} onClick={()=>{HandleGotoNext({url : "uploadReq"})}}>前往上傳需求</button></div></li>
                        <li className="my-auto"><div className="pb-2"><button className={"w-50 btn btn-" + ButtonLayout[3]} onClick={()=>{HandleGotoNext({url : "ViewReq"})}}>檢視已上傳的需求</button></div></li>
                        <li className="my-auto"><div className="pb-2"><button className={"w-50 btn btn-" + ButtonLayout[4]} onClick={()=>{HandleGotoNext({url : "CheckAllImg"})}}>確認已上傳的圖片</button></div></li>
                        <li className="my-auto"><div className="pb-2"><button className={"w-50 btn btn-" + ButtonLayout[5]} onClick={()=>{HandleGotoNext({url : "CheckReq"})}}>確認已上傳的需求</button></div></li>
                        <li className="my-auto"><div className="pb-2"><button className={"w-50 btn btn-" + ButtonLayout[6]} onClick={()=>{HandleGotoNext({url : "TrainModel"})}}>開始訓練</button></div></li>
                    </ul>
                </div>
            </div>
            <Footer />
        </>
    )
}
