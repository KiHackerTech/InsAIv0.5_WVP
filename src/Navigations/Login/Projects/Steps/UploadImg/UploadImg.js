import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { APInextStep, APIuploadImg } from "../../../../../Components/FuncComponents/API_Manager"

function ListSelectedImg(props){
    let RemovedImgList = props.RemovedImgList
    let SelectedImgUrlList = props.SelectedImgUrlList
    let IndexOfUrlList = props.IndexOfUrlList

    const setSelectedImgUrlList = props.setSelectedImgUrlList
    const setRemovedImgList = props.setRemovedImgList
    const setIndexOfUrlList = props.setIndexOfUrlList

    function HandleDownloadSingle(props){
        const index = props.index

        var downloadElement = document.createElement("a");
        document.body.appendChild(downloadElement);
        downloadElement.href = SelectedImgUrlList[index];
        downloadElement.download = "InsAI_upload_Image";
        downloadElement.click();
    }

    function HandleRemoveSingle(props){
        const index = props.index
        
        SelectedImgUrlList.splice(index,1)
        if(SelectedImgUrlList.length < 1){
            RemovedImgList = []
            RemovedImgList.push(-999)
        }else{
            RemovedImgList.push(IndexOfUrlList[index])
        }
        IndexOfUrlList.splice(index,1)
        
        setIndexOfUrlList([...IndexOfUrlList])
        setRemovedImgList([...RemovedImgList])
        setSelectedImgUrlList([...SelectedImgUrlList])
    }

    let ImgItems
    if(props.SelectedImgUrlList.length < 1){
        ImgItems = <div>還沒有圖片，點擊選擇檔案來新增圖片</div>
    }else{
        ImgItems = props.SelectedImgUrlList.map((ImgUrl, index)=>
            <div className="col col-md-4 p-0 mb-3 shadow-lg" key={index}>
                <div className="card ms-3">
                    <img src={ImgUrl} className="col card-img-top" title={"點擊刪除圖片從上傳隊列移除圖片" + (index+1)}/>
                    <div className="card-footer">
                        <div className="row justify-content-between align-items-center">
                            <a href="#" className="col btn btn-info shadow" onClick={()=>{HandleDownloadSingle({ props , index})}}>下載圖片</a>
                            <a href="#" className="col btn btn-outline-danger shadow" onClick={()=>{HandleRemoveSingle({ props , index})}} >刪除圖片</a>
                        </div>
                    </div>
                </div>
            </div>
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
    const [IndexOfUrlList, setIndexOfUrlList] = useState([])
    const [RemovedImgList, setRemovedImgList] = useState([])

    const [SubmitButtonMsg, setSubmitButtonMsg] = useState("請選擇圖片")
    const [ButtonDisabled, setButtonDisabled] = useState(true)

    useEffect(() => {   //用token存否進行登入check
        if(localStorage.getItem("Token") == null){   //沒token則跳轉到登入
            navigate("/Login")
        }
    },[])

    useEffect(()=>{
        GetSelectedImgUrlList()
    }, [ImgList])

    function HandleRemoveAllImg(){
        setSelectedImgUrlList([])
        setRemovedImgList([-999])
    }

    function HandleDownloadAllImg(props){
        let SelectedImgUrlList = props.SelectedImgUrlList

        SelectedImgUrlList.forEach((ImgUrl, index)=>{
            var downloadElement = document.createElement("a");
            document.body.appendChild(downloadElement);
            downloadElement.href = SelectedImgUrlList[index];
            downloadElement.download = "InsAI_upload_Image";
            downloadElement.click();
        })
    }

    function GetSelectedImgUrlList(){
    
        if(ImgList.length < 1){
            return -1
        }else{
            let UrlList = []
            for(let i = 0; i < ImgList.length; i++){
                let IndexOfUrlList_temp = IndexOfUrlList
                IndexOfUrlList_temp.push(i)
                setIndexOfUrlList([...IndexOfUrlList_temp])
            }
            setTimeout(() => {
                setSelectedImgUrlList(UrlList)
            }, ImgList.length * 4)

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
        
        setRemovedImgList([])
        if(event.target.files.length * delayTimeValue < 1000){
            delayNum = 1
        }else{
            delayNum = parseInt((event.target.files.length * delayTimeValue)/1000) + 1
        }

        function countDown(props){
            const delayNum = props.delayNum - 1
            const setButtonDisabled = props.setButtonDisabled
            if(delayNum > 0){
                props.setButtonDisabled(true)
                setTimeout(() => {
                    const setSubmitButtonMsg = props.setSubmitButtonMsg
                    props.setSubmitButtonMsg(delayNum + "秒後可上傳")
                    countDown({delayNum, setSubmitButtonMsg, setButtonDisabled})
                }, 1000)
            }else{
                props.setSubmitButtonMsg("上傳")
                props.setButtonDisabled(false)
            }
        }

        setSubmitButtonMsg(delayNum + "秒後可上傳")
        countDown({delayNum, setSubmitButtonMsg, setButtonDisabled})
        setImgList(event.target.files)
    }

    function HandleSubmit(event){
        event.preventDefault()
        if(RemovedImgList.includes(-999)){
            alert("沒有選擇圖片")
            return -999
        }
        let ImgformData = new FormData();

        ImgformData.append("ProjectID", searchParams.get('ProjectID'));
        ImgformData.append("UserID", UserID)
        Object.values(ImgList).forEach((Img, index) =>{
            if(!RemovedImgList.includes(index) && !RemovedImgList.includes(-999)){
                ImgformData.append("file", Img)
            }
        })
        ImgformData.append("fileAmount", ImgList.length)
        
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
                    <form className="row p-1 mb-3 border-bottom shadow-lg justify-content-around align-items-center d-flex" onSubmit={HandleSubmit}>
                        <button type="button" className="col-auto m-2 shadow btn btn-success">
                            <input type="file" className="h-100 w-100" onChange={HandleSelect} multiple />
                        </button>   

                        <div className="col">
                            <button type="button" className="me-3 shadow btn btn-info" onClick={()=>{HandleDownloadAllImg({SelectedImgUrlList})}} disabled={ButtonDisabled}>下載隊列中所有圖片</button>
                            <button type="button" className="me-3 shadow btn btn-outline-danger" onClick={HandleRemoveAllImg} disabled={ButtonDisabled}>刪除隊列中所有圖片</button>
                            
                            <button type="submit" className="me-3 shadow btn btn-primary" disabled={ButtonDisabled}>{SubmitButtonMsg}</button>
                            <label>點擊圖片以將其從隊列中刪除</label>
                        </div>
                        <button type="button" className="col-auto shadow btn btn-dark" onClick={HandleGotoStep}>返回</button>
                        
                    </form>
                    <div className="row p-1 justify-content-start align-items-center">
                        <ListSelectedImg 
                            SelectedImgUrlList={SelectedImgUrlList} 
                            setSelectedImgUrlList={setSelectedImgUrlList} 
                            RemovedImgList={RemovedImgList} 
                            setRemovedImgList={setRemovedImgList} 
                            IndexOfUrlList={IndexOfUrlList} 
                            setIndexOfUrlList = {setIndexOfUrlList}
                            />
                    </div>
                </div>
            </div>
            </>
    )
    
}