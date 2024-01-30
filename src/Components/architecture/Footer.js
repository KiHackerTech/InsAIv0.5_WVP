import React from "react"

export default function Footer(){
    return(
        <footer className="p-4 border-top bg-light">
            <div className="container-fluid align-items-center justify-content-between d-flex">
                <p className="text-muted mb-0">
                    &copy: 2023 InsAI Inc. All rights reserved.
                </p>
                <div className="d-flex">
                    <a href="#" className="nav-link ps-4 text-muted">關於InsAI</a>
                    <a href="#" className="nav-link ps-4 text-muted">服務及隱私權條款</a>
                    <a href="#" className="nav-link ps-4 text-muted">投資人資訊</a>
                </div>
            </div>
        </footer>
    )
}