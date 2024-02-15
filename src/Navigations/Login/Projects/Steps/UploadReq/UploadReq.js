import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import { APIgetReq, APInextStep, APIuploadReq } from "../../../../../Components/FuncComponents/API_Manager"


export default function UploadReq(){

    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const [StandardDeviation, setStandardDeviation] = useState("")
    const [SpecificLevel, setSpecificLevel] = useState("")
    const [Chance, setChance] = useState("")

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
    

    function HandleSubmit(event){
        event.preventDefault()

        if(
            StandardDeviation.length *
            SpecificLevel.length *
            Chance.length  == 0
        ){
            alert("請確實填寫")
            return -1
        }

        const data = {
            UserID : searchParams.get("UserID"),
            ProjectID : searchParams.get("ProjectID"),
            Req : {
                StandardDeviation : StandardDeviation,
                SpecificLevel : SpecificLevel,
                Chance : Chance,
            }
        }
        APIuploadReq(data)
            .then((response)=>{
                if(response.data.Status == "Success"){
                    const next_step_data = {
                        ProjectID : searchParams.get("ProjectID"),
                        setStep : 3
                    }
                    APInextStep(next_step_data)
                        .then((response)=>{
                            if(response.data.Status == "Success"){
                                alert("送出成功")
                                navigate({
                                    pathname: "/Project/Step",
                                    search: "?" + searchParams.toString()
                                })
                            }
                        })
                        .catch((err)=>{
                            console.log(err)
                        })
                }
            })
            .catch(()=>{

            })
    }

    function HandleGotoStep(){
        navigate({
            pathname : "/Project/Step/",
            search : "?" + searchParams.toString()
        })
    }
    
    return(
        <div className="d-flex flex-column align-items-center">
            <div className="d-flex w-100 justify-content-center">
                <form onSubmit={HandleSubmit}>
                    <table>
                        <caption className="text-center">
                            送出結果將直接影響生成效果，請確實填寫
                        </caption>
                        <tbody>
                            <tr>
                                <th scope="row">模型標準差：</th>
                                <td><input type="number" onChange={(event)=>{setStandardDeviation(event.target.value)}} defaultValue={StandardDeviation} /></td>
                            </tr>
                            <tr>
                                <th scope="row">模型容錯率(%):</th>
                                <td><input type="number" onChange={(event)=>{setSpecificLevel(event.target.value)}} defaultValue={SpecificLevel} className="w-100" min={0} max={100} /></td>
                            </tr>
                            <tr>
                                <th scope="row">判斷精準度(%):</th>
                                <td><input type="number" onChange={(event)=>{setChance(event.target.value)}} defaultValue={Chance} className="w-100" min={0} max={100} /></td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td align="right">
                                    <button type="submit" onClick={HandleGotoStep} className="btn btn-secondary">取消</button>
                                    <button type="submit" className="btn btn-primary">送出</button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </form>
            </div>
        </div>
    )
}