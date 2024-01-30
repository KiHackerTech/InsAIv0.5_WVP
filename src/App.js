import React from "react";
import { Routes, Route, Outlet } from 'react-router-dom'

import {Register} from "./Navigations/Register/Register";   //註冊頁面
import {Login} from "./Navigations/Login/Login";            //登入頁面
import { Projects } from "./Navigations/Projects/Projects";
import CreateProject from "./Navigations/Projects/CreateProject";
import Step from "./Navigations/Projects/Step";

export default function APP() {
    return (
        <div className='vh-auto vw-auto'>
            <Routes>
                {/* <Route path="/"      element={<Register />} /> */}
                <Route path="/"      element={<Projects />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Projects" element={<Projects />} />
                    <Route path="/Project/CreateProject" element={<CreateProject />} />
                    <Route path="/Project/Step" element={<Step />} />
                <Route path="*"      element={<Register />} />
            </Routes>
        </div>
    )
}
