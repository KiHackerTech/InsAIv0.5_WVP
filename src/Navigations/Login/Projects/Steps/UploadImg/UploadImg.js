import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { APIuploadImg } from "../../../../../Components/FuncComponents/API_Manager";

export default function UploadImg(){

    const navigate = useNavigate()
    const UserID = JSON.parse(localStorage.getItem("Token")).UserID

    const [searchParams] = useSearchParams()

    const [ImgList, setImgList] = useState([])
    const [SelectedImgUrlList, setSelectedImgUrlList] = useState([])
    const [SelectedImgList, setSelectedImgList] = useState([])

    useEffect(() => {   //用token存否進行登入check
        if(localStorage.getItem("Token") == null){   //沒token則跳轉到登入
            navigate("/Login")
        }
    },[])

    useEffect(()=>{
        const ImgItems = SelectedImgUrlList.map((ImgUrl, index)=>
                <button className="col-md-2 pb-3" key={index}>
                    <img src={ImgUrl} className="h-100 w-100" title={"點擊圖片從上傳隊列移除圖片" + (index+1)}/>
                </button>
        )
        setSelectedImgList(ImgItems)
    }, [SelectedImgUrlList])

    useEffect(()=>{
        ListSelectedImg({ImgList, SelectedImgUrlList, setSelectedImgUrlList})
    }, [ImgList])

    function ListSelectedImg(props){
        const ImgList = props.ImgList
    
        if(ImgList.length < 1){
            return -1
        }else{
            let UrlList = []
            
            setTimeout(() => {
                props.setSelectedImgUrlList(UrlList)
            }, 3500);
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
        setImgList(event.target.files)
    }

    function HandleSubmit(event){
        event.preventDefault()
        let ImgformData = new FormData();

        ImgformData.append("ProjectID", searchParams.get('ProjectID'));
        ImgformData.append("UserID", UserID)
        Object.values(ImgList).forEach(Img =>{
            ImgformData.append("files", Img);
        })
        ImgformData.append("fileAmount", ImgList.length);
        
        console.log("upload imgs posted")
        APIuploadImg(ImgformData)   //調用上傳圖片API
            .then((response) => {
                console.log("upload imgs success:")
                console.log(response)
                if(response.data.Status == "Success"){
                    alert("上傳成功")
                    navigate({
                        pathname: '/Project/Step/',
                        search: "?" + searchParams.toString()
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
            
        // console.log(Imgs)
    }

    return(
        <div className="min-vh-100">
            <div className="row h-auto vw-100 bg-light">
                <div className="container">
                    <form className="row align-items-center bg-secondary justify-content-center" onSubmit={HandleSubmit}>
                        <input type="file" className="col-auto" onChange={HandleSelect} multiple />
                        <div className="col-auto">
                            <button type="submit" className="btn btn-primary">上傳</button>
                            <label>點擊圖片以將其從隊列中刪除</label>
                        </div>
                    </form>
                    <p className="row text-center justify-content-start align-items-center">
                        {SelectedImgList}
                    </p>
                </div>
            </div>
        </div>
    )
    
}