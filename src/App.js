import React from "react";
import { Routes, Route, Outlet } from 'react-router-dom'

import {Login} from "./Navigations/Login/Login";            //登入頁面
import {Register} from "./Navigations/Register/Register";   //註冊頁面
import {Projects} from "./Navigations/Login/Projects/Projects";
import CreateProject from "./Navigations/Login/Projects/CreateProject";
import Step from "./Navigations/Login/Projects/Steps/Step";
import UploadImg from "./Navigations/Login/Projects/Steps/UploadImg/UploadImg";
import ViewAllImg from "./Navigations/Login/Projects/Steps/ViewAllImg/ViewAllImg";
import UploadReq from "./Navigations/Login/Projects/Steps/UploadReq/UploadReq";
import ViewReq from "./Navigations/Login/Projects/Steps/ViewReq/ViewReq";
import CheckAllImg from "./Navigations/Login/Projects/Steps/CheckAllImg/CheckAllImg";
import CheckReq from "./Navigations/Login/Projects/Steps/CheckReq/CheckReq";
import TrainModel from "./Navigations/Login/Projects/Steps/TrainModel/TrainModel";


export default function APP() {
    return (
        <div className='vh-auto vw-auto'>
            <Routes>
                <Route path="/"      element={<Register />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Projects" element={<Projects />} />
                    <Route path="/Project/CreateProject" element={<CreateProject />} />
                    <Route path="/Project/Step" element={<Step />} />
                        <Route path="/Project/Step/uploadImg" element={<UploadImg />} />
                        <Route path="/Project/Step/ViewAllImg" element={<ViewAllImg />} />
                        <Route path="/Project/Step/uploadReq" element={<UploadReq />} />
                        <Route path="/Project/Step/ViewReq" element={<ViewReq />} />
                        <Route path="/Project/Step/CheckALlImg" element={<CheckAllImg />} />
                        <Route path="/Project/Step/CheckReq" element={<CheckReq />} />
                        <Route path="/Project/Step/TrainModel" element={<TrainModel />} />
                <Route path="*" element={<Register />} />
            </Routes>
        </div>
    )
}
