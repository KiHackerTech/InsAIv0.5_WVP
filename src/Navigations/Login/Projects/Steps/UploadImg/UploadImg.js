import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { APInextStep, APIuploadImg } from "../../../../../Components/FuncComponents/API_Manager"

function ListSelectedImg(props){
    let ImgItems
    if(props.SelectedImgUrlList.length < 1){
        ImgItems = <div>還沒有圖片，點擊選擇檔案來新增圖片</div>
    }else{
        ImgItems = props.SelectedImgUrlList.map((ImgUrl, index)=>
            <button className="col-md-2 p-0 mx-auto my-1 shadow-lg" key={index}>
                <img src={ImgUrl} className="h-100 w-100" title={"點擊圖片從上傳隊列移除圖片" + (index+1)}/>
            </button>
        )
    }

    return ImgItems
}

export default function UploadImg(){

    const navigate = useNavigate()
    const UserID = JSON.parse(localStorage.getItem("Token")).UserID

    const [searchParams] = useSearchParams()

    const [ImgList, setImgList] = useState([])
    const [SelectedImgUrlList, setSelectedImgUrlList] = useState([])

    const [SubmitButtonMsg, setSubmitButtonMsg] = useState("請選擇圖片")
    const [SubmitButtonDisabled, setSubmitButtonDisabled] = useState(true)

    useEffect(() => {   //用token存否進行登入check
        if(localStorage.getItem("Token") == null){   //沒token則跳轉到登入
            navigate("/Login")
        }
    },[])

    useEffect(()=>{
        GetSelectedImgUrlList({ImgList, SelectedImgUrlList, setSelectedImgUrlList})
    }, [ImgList])

    function GetSelectedImgUrlList(props){
        const ImgList = props.ImgList
    
        if(ImgList.length < 1){
            return -1
        }else{
            let UrlList = []
            
            setTimeout(() => {
                props.setSelectedImgUrlList(UrlList)
            }, ImgList.length * 4);
            for (const Img of ImgList){
                const ImgRader = new FileReader()
        
                ImgRader.onload = (e) => {
                    if (e.target) {
                        UrlList.push(e.target.result)
                    }
                }
                ImgRader.readAsDataURL(Img)
            }
        }
    
    }

    function HandleSelect(event){
        const delayTimeValue = 4
        let delayNum
        if(event.target.files.length * delayTimeValue < 1000){
            delayNum = 1
        }else{
            delayNum = parseInt((event.target.files.length * delayTimeValue)/1000) + 1
        }
        function countDown(props){
            const delayNum = props.delayNum - 1
            const setSubmitButtonDisabled = props.setSubmitButtonDisabled
            if(delayNum > 0){
                props.setSubmitButtonDisabled(true)
                setTimeout(() => {
                    const setSubmitButtonMsg = props.setSubmitButtonMsg
                    props.setSubmitButtonMsg(delayNum + "秒後可上傳")
                    countDown({delayNum, setSubmitButtonMsg, setSubmitButtonDisabled})
                }, 1000)
            }else{
                props.setSubmitButtonMsg("上傳")
                props.setSubmitButtonDisabled(false)
            }
        }
        setSubmitButtonMsg(delayNum + "秒後可上傳")
        countDown({delayNum, setSubmitButtonMsg, setSubmitButtonDisabled})
        setImgList(event.target.files)
    }

    function HandleSubmit(event){
        event.preventDefault()
        let ImgformData = new FormData();

        ImgformData.append("ProjectID", searchParams.get('ProjectID'));
        ImgformData.append("UserID", UserID)
        Object.values(ImgList).forEach(Img =>{
            ImgformData.append("file", Img);
        })
        ImgformData.append("fileAmount", ImgList.length);
        
        console.log("upload imgs posted")
        APIuploadImg(ImgformData)   //調用上傳圖片API
            .then((response) => {
                console.log("upload imgs success:")
                console.log(response)
                if(response.data.Status == "Success"){
                    const data = {
                        ProjectID : searchParams.get("ProjectID"),
                        setStep : 1
                    }
                    APInextStep(data)
                        .then((response)=>{
                            if(response.data.Status == "Success"){
                                alert("上傳成功")
                                navigate({
                                    pathname: '/Project/Step/',
                                    search: "?" + searchParams.toString()
                                })
                            }
                        })
                        .catch((err)=>{
                            console.log(err)
                        })
                }else{
                    alert("上傳失敗")
                    console.log(response)
                    navigate({
                        pathname: '/Project/Step/',
                        search: "?" + searchParams.toString()
                    })

                }
            })
            .catch((err) => {
                console.log("Upload Img Error :")
                console.log(err)
                alert("很抱歉，似乎出了點問題")
            })
            
    }

    function HandleGotoStep(){
        navigate({
            pathname : "/Project/Step/",
            search : "?" + searchParams.toString()
        })
    }

    return(
        <>
            <div className="min-vh-100 bg-light">
                <div className="container-fluid"> 
                    <form className="row p-1 mb-3 border-bottom shadow-lg justify-content-around align-items-center" onSubmit={HandleSubmit}>
                        <button type="button" className="col-auto m-2 shadow btn btn-success">
                            <input type="file" className="h-100 w-100" onChange={HandleSelect} multiple />
                        </button>
                        <div className="col-auto">
                            <button type="submit" className="me-3 shadow btn btn-primary" disabled={SubmitButtonDisabled}>{SubmitButtonMsg}</button>
                            <label>點擊圖片以將其從隊列中刪除</label>
                        </div>
                        <button type="button" className="col-auto shadow btn btn-info" onClick={HandleGotoStep}>返回</button>
                    </form>
                    <div className="row p-1 justify-content-start align-items-center">
                        <ListSelectedImg SelectedImgUrlList={SelectedImgUrlList} />
                    </div>
                </div>
            </div>
            </>
    )
    
}