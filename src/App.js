import React from "react";
import { Routes, Route, Outlet } from 'react-router-dom'

import {Login} from "./Navigations/Login/Login";            //登入頁面
import {Register} from "./Navigations/Register/Register";   //註冊頁面
import {Projects} from "./Navigations/Login/Projects/Projects";
import CreateProject from "./Navigations/Login/Projects/CreateProject";
import Step from "./Navigations/Login/Projects/Steps/Step";
import UploadImg from "./Navigations/Login/Projects/Steps/UploadImg/UploadImg";
import ViewAllImg from "./Navigations/Login/Projects/Steps/ViewAllImg/ViewAllImg";

export default function APP() {
    return (
        <div className='vh-auto vw-auto'>
            <Routes>
                <Route path="/"      element={<Register />} />
                {/* <Route path="/"      element={<Projects />} /> */}
                <Route path="/Login" element={<Login />} />
                <Route path="/Projects" element={<Projects />} />
                    <Route path="/Project/CreateProject" element={<CreateProject />} />
                    <Route path="/Project/Step" element={<Step />} />
                        <Route path="/Project/Step/uploadImg" element={<UploadImg />} />
                        <Route path="/Project/Step/ViewAllImg" element={<ViewAllImg />} />
                <Route path="*"      element={<Register />} />
            </Routes>
        </div>
    )
}
