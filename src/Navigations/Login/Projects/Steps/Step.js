import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { LogoutProcedure } from "../../../../Components/FuncComponents/LogoutProcedure";

import NavBarHeader from "../../../../Components/architecture/NavbarHeader";
import Footer from "../../../../Components/architecture/Footer";

export default function Step(){

    const navigate = useNavigate()

    const [searchParams] = useSearchParams();

    const [UserID, setUserID] = useState()
    const [Token, setToken] = useState()

    useEffect(() => {   //用token存否進行登入check
        if(localStorage.getItem("Token") == null){   //沒token則跳轉到登入
            navigate("/Login")
        }else{   //有token則抓取必要資訊
            try{
                setUserID(JSON.parse(localStorage.getItem("Token")).UserID)
                setToken(JSON.parse(localStorage.getItem("Token")).JWT_SIGN_PUBLIC_KEY)
            } catch (err){
                console.log("getPrimeInfoError:")
                console.log(err)
                LogoutProcedure()
                navigate("/Login")
            }
        }
    },[])

    return(
        <>
        <div>
            <NavBarHeader/>
            <div className="min-vh-100 bg-light">
                <div className="row h-auto w-100">
                  
                  <div>Step Page of {searchParams.get('projectName')}</div>

                    {/* <div className="app">
                      <header className="nav">
                        <div className="allProjects">
                          <div style={{ position: "relative", left: "250px", fontWeight: "bold" }}>All Projects</div>
                        </div>
                        <div className="stepRectangle"></div>
                      </header>
                      
                      <header className="subNav">
                        Traffic cone ...
                      </header>

                      <div className="circles">
                        <div className="circleNo1"></div>
                        <div className="circleNo2"></div>
                        <div className="circleNo3"></div>
                        <div className="circleNo4"></div>
                        <div className="circleNo5"></div>
                      </div>

                      <nav className="secondNav">
                        <ul>
                          <li>Steps</li>
                          <li>1.Upload training data</li>
                          <li>2.Provide your model training requirements</li>
                          <li>3.Confirm data and requirements</li>
                          <li>4.Train your AI model</li>
                          <li>5.Download AI model</li>
                        </ul>
                      </nav>

                      <div className="frame1">
                        <ul>
                          <li>Upload training data</li>
                          <li>Upload the image data you wish to use to train your style model</li>
                        </ul>
                      </div>
                      <div className="frameNo2 ">
                        <ul>
                          <li>Provide your training requirements</li>
                          <li>Tell us your specific needs for AI model training</li>
                        </ul>
                      </div>

                      <div className="frameNo3">
                        <ul>
                          <li>Confirm data and requirements</li>
                          <li>Tell your needs for AI model training</li>
                        </ul>
                        <button className="upload-buttonNo3">Confirm data</button>
                        <button className="upload-buttonNo4">Confirm requirements</button>
                      </div>

                      <div className="frameNo4">
                        <ul>
                          <li>Training your AI model</li>
                          <li>You haven't submitted data yet</li>
                        </ul>
                      </div>

                      <div className="frameNo5">
                        <ul>
                          <li>Download AI model</li>
                          <li>No model available for download</li>
                        </ul>
                      </div>
                    </div> */}
                </div>
            </div>
            <Footer />
        </div>
        </>
    )
}
