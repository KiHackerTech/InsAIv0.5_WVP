import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
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

    function HandleGotoStep(){
        navigate({
            pathname : "/Project/Step/",
            search : "?" + searchParams.toString()
        })
    }
    
    return(
        <div className="d-flex flex-column align-items-center">
            <div className="d-flex w-100 justify-content-center">
                    <table>
                        <caption className="text-center">
                            僅供檢視
                        </caption>
                        <tbody>
                            <tr>
                                <th scope="row">模型標準差：</th>
                                <td><input type="number" value={StandardDeviation} disabled /></td>
                            </tr>
                            <tr>
                                <th scope="row">模型容錯率(%):</th>
                                <td><input type="number" value={SpecificLevel} className="w-100" min={0} max={100} disabled /></td>
                            </tr>
                            <tr>
                                <th scope="row">判斷精準度(%):</th>
                                <td><input type="number" value={Chance} className="w-100" min={0} max={100} disabled /></td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td align="right">
                                    <button type="submit" onClick={HandleGotoStep} className="btn btn-outline-secondary">返回</button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
            </div>
        </div>
    )
}