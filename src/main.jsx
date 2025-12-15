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
import { AuthProvider } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HistoryPage from './pages/HistoryPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* [수정] 1. BrowserRouter를 최상위로 이동 */}
        <BrowserRouter>
            {/* [수정] 2. AuthProvider를 그 안으로 이동 */}
            <AuthProvider>
                <Routes>
                    {/* App (공통 레이아웃 - 네비/푸터 O) */}
                    <Route path="/" element={<App />}>
                        <Route index element={<HomePage />} />
                        <Route path="tool" element={<ToolPage />} />

                        {/* ProtectedRoute 적용 */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="history" element={<HistoryPage />} />
                        </Route>
                    </Route>

                    {/* 독립 페이지 (네비/푸터 X) */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)