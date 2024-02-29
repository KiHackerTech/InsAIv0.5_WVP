import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import { APIdeleteImg, APIgetImg, APIgetReq, APInextStep } from "../../../../../Components/FuncComponents/API_Manager";

import NavBarHeader from "../../../../../Components/architecture/NavbarHeader";
import Footer from "../../../../../Components/architecture/Footer";
import { LogoutProcedure } from "../../../../../Components/FuncComponents/LogoutProcedure";

export default function CheckReq(){

    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const [Token, setToken] = useState("")

    const [StandardDeviation, setStandardDeviation] = useState("")
    const [SpecificLevel, setSpecificLevel] = useState("")
    const [Chance, setChance] = useState("")

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

    useEffect(()=>{
        const params = {
            UserID : searchParams.get("UserID"),
            ProjectID : searchParams.get("ProjectID")
        }
        APIgetReq(params)
            .then((response)=>{
                const Req_data = response.data
                setStandardDeviation(Req_data.StandardDeviation)
                setSpecificLevel(Req_data.SpecificLevel)
                setChance(Req_data.Chance)
            })
            .catch((err)=>{
                console.log(err)
            })
    },[])

    function HandleComfirm(){
        var CheckImgConfirm = confirm('確認後無法再修改需求，要確認嗎？');

        if (CheckImgConfirm) {
            const data = {
                ProjectID : searchParams.get("ProjectID"),
                setStep : 6
            }
            APInextStep(data)
            navigate({
                pathname : "/Project/Step/",
                search : "?" + searchParams.toString()
            })
        }
        
    }

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
            <div className="d-flex min-vh-100 bg-light justify-content-center align-items-start">
                <table>
                    <tbody>
                        <tr>
                            <th scope="row">模型標準差：</th>
                            <td><input type="number" defaultValue={StandardDeviation} disabled /></td>
                        </tr>
                        <tr>
                            <th scope="row">模型容錯率(%):</th>
                            <td><input type="number" defaultValue={SpecificLevel} className="w-100" min={0} max={100} disabled /></td>
                        </tr>
                        <tr>
                            <th scope="row">判斷精準度(%):</th>
                            <td><input type="number" defaultValue={Chance} className="w-100" min={0} max={100} disabled /></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td align="right">
                                <button type="submit" onClick={HandleGotoStep} className="btn btn-secondary">返回</button>
                                <button type="submit" onClick={HandleComfirm} className="btn btn-dark">確認</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <Footer />

        </>
    )
}