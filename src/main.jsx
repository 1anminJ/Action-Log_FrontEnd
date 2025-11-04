import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// 1. 라우터 관련 기능 import
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// 2. 우리가 만들 페이지들 import
import HomePage from './pages/HomePage.jsx'
import ToolPage from './pages/ToolPage.jsx'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* 3. 앱 전체를 BrowserRouter로 감싸기 */}
        <BrowserRouter>
            {/* 4. App이 공통 레이아웃 역할을 하도록 설정 */}
            <Routes>
                <Route path="/" element={<App />}>
                    {/* 5. 주소별로 다른 페이지 보여주기 */}
                    {/* 주소 "/" (홈) -> HomePage */}
                    <Route index element={<HomePage />} />
                    {/* 주소 "/tool" -> ToolPage (우리의 요약 툴) */}
                    <Route path="tool" element={<ToolPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)