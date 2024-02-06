import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import { APIdeleteImg, APIgetImg, APInextStep } from "../../../../../Components/FuncComponents/API_Manager";

import NavBarHeader from "../../../../../Components/architecture/NavbarHeader";
import Footer from "../../../../../Components/architecture/Footer";
import { BaseURL } from "../../../../../BaseInfo";

function ListImgs(props){
    const UserID = props.searchParams.get("UserID")
    const ProjectID = props.searchParams.get("ProjectID")

    function HandleDeleteImg(delete_props) {
        console.log("delete img posted")
        APIdeleteImg({ImgID : delete_props.ImgID})
            .then((response)=>{
                console.log("delete img success:")
                console.log(response)
                if(response.data.Status == "Success"){
                    let list_deleted = props.ImgList
                    list_deleted.splice(delete_props.index, 1)
                    props.setImgList(()=>{return(
                        [...list_deleted]
                    )})

                }else{
                    alert("刪除圖片錯誤")
                }
            })
            .catch((err)=>{
                console.log("Delete Img Error :")
                console.log(err)
            })
    }

    let ImgItems
    if(props.ImgList.length < 1){
        ImgItems = <div>還沒有圖片，點擊上方加號新增圖片</div>
    }else{
        ImgItems = props.ImgList.map((ImgData, index) => {
            const imgName = ImgData.imgName
            const ImgID = ImgData.ImgID
            
            let ImgUrl = BaseURL + "projects" +"/"+ UserID +"/"+ ProjectID +"/"+ imgName
            // ImgUrl = "https://i.ytimg.com/vi/jS1mZ4QciKI/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLD5V9KQugojDoEjHBEdv3F3FQ48Cg"
            
            return(
                <button className="col-md-2 p-0 mx-auto my-1 shadow-lg" onClick={()=>{HandleDeleteImg({ImgID, index})}} title={"點擊圖片從上傳隊列移除圖片" + (index+1)} key={index} >
                    <img src={ImgUrl} className="h-100 w-100" />
                </button>
            )
        })
    }
    

    
    return ImgItems
}

export default function ViewAllImg(){

    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const [Token, setToken] = useState("")   //存token，call API用
    const [ImgList, setImgList] = useState([])

    useEffect(() => {   //用token存否進行登入check和searchPrarms check
        if(localStorage.getItem("Token") == null){   //沒token則跳轉到登入
            LogoutProcedure()
            navigate("/Login")
        }else if(searchParams.toString().length < 1){   //沒searchPrarms則跳轉到Projects
            navigate("/Projects")
        }else{
            try{
                setToken(JSON.parse(localStorage.getItem("Token")))
            } catch (err){
                console.log("getPrimeInfoError:")
                console.log(err)
                LogoutProcedure()
                navigate("/Login")
            }
        }
    },[])

    function RefreshAllImgs(){

        console.log("get imgs posted")
        APIgetImg({"ProjectID" : searchParams.get("ProjectID")})
            .then((response)=>{
                console.log("get imgs success:")
                console.log(response)
                if(response.data.Status == "Success"){
                    setImgList(response.data.Message)
                }
            })
            .catch((err)=>{
                console.log("Get Img Error :")
                console.log(err)
            })
    }

    useEffect(() => {
        if(Token.UserID){
            RefreshAllImgs()
            const data = {
                ProjectID : searchParams.get("ProjectID"),
                setStep : 2
            }
            APInextStep(data)
                .then((response)=>{
                    if(response.data.Status != "Success"){
                        alert("很抱歉，似乎出了點問題")
                    }
                })
                .catch((err)=>{
                    console.log(err)
                })
        }
    }, [Token])

    function HandleGotoStep(){
        navigate({
            pathname : "/Project/Step/",
            search : "?" + searchParams.toString()
        })
    }

    return(
        <>
            <NavBarHeader PlusSignFunction={()=>{
                navigate({
                    pathname : "/Project/Step/UploadImg",
                    search : "?" + searchParams.toString()
                })
            }
            } />
            <div className="min-vh-100 bg-light">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="row w-100 justify-content-center align-items-center">
                            <div className="col-auto">檢視專案{searchParams.get("projectName")}已上傳的圖片</div>
                            <div className="col-auto">點擊圖片以從專案刪除</div>
                        </div>
                        <div className="row w-100 pb-4 justify-content-center align-items-center">
                            <button className="col-auto btn btn-info" onClick={HandleGotoStep}>返回</button>
                        </div>
                        <div className="row w-100 justify-content-start">
                            <ListImgs ImgList={ImgList} setImgList={setImgList} searchParams={searchParams} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

        </>
    )
}