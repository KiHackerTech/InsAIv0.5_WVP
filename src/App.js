import React from "react";
import { Routes, Route } from 'react-router-dom'

import {Register} from "./Navigations/Register/Register";   //註冊頁面
import {Login} from "./Navigations/Login/Login";            //登入頁面


export default function APP() {
    return (
        <div className='App'>
            <Routes>
                <Route path="/"      element={<Register />} />
                <Route path="/Login" element={<Login />} />
                <Route path="*"      element={<Register />} />
            </Routes>
        </div>
    )
}
