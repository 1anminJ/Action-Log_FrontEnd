import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        // 로그인 안 했으면 로그인 페이지로 쫓아냄
        return <Navigate to="/login" replace />;
    }

    // 로그인 했으면 자식 페이지(ToolPage)를 보여줌
    return <Outlet />;
}

export default ProtectedRoute;