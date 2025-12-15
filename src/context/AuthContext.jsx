import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const setAuthToken = (token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName'); // [추가]
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userName'); // [추가]
        setAuthToken(null);
    };

    // [수정] localStorage/sessionStorage에서 'name'도 함께 불러옴
    useEffect(() => {
        let storedToken = localStorage.getItem('accessToken');
        let storedUserId = localStorage.getItem('userId');
        let storedUserName = localStorage.getItem('userName'); // [추가]
        let storageType = 'local';

        if (!storedToken) {
            storedToken = sessionStorage.getItem('accessToken');
            storedUserId = sessionStorage.getItem('userId');
            storedUserName = sessionStorage.getItem('userName'); // [추가]
            storageType = 'session';
        }

        if (storedToken && storedUserId && storedUserName) { // [수정]
            setAuthToken(storedToken);
            // [수정] user 객체에 name 포함
            setUser({ userId: storedUserId, token: storedToken, name: storedUserName, storageType: storageType });
        }
        setLoading(false);

        // ... (Axios Interceptor는 동일) ...
        const errorInterceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                // [수정] 토큰이 있을 때만 401/403 에러에 반응하여 자동 로그아웃
                const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
                if (token && error.response && (error.response.status === 401 || error.response.status === 403)) {
                    console.error("토큰 만료 또는 권한 없음! 자동 로그아웃.");
                    logout();
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axios.interceptors.response.eject(errorInterceptor);
        };
    }, [navigate]);

    // [수정] login 함수가 'name'도 받아와서 저장
    const login = async (userId, password, rememberMe) => {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            userId,
            password,
        });

        // [수정] userId, name, accessToken을 모두 받아옴
        const { accessToken, userId: loggedInUserId, name } = response.data;

        const storage = rememberMe ? localStorage : sessionStorage;
        const storageType = rememberMe ? 'local' : 'session';

        storage.setItem('accessToken', accessToken);
        storage.setItem('userId', loggedInUserId);
        storage.setItem('userName', name); // [추가]

        setAuthToken(accessToken);
        // [수정] user 객체에 name 포함
        setUser({ userId: loggedInUserId, token: accessToken, name: name, storageType: storageType });
    };

    const value = {
        user,
        isLoggedIn: !!user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};