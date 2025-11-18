import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userId');
        setAuthToken(null);
    };

    // [수정] 앱 실행 시, localStorage (자동로그인) -> sessionStorage 순으로 확인
    useEffect(() => {
        let storedToken = localStorage.getItem('accessToken');
        let storedUserId = localStorage.getItem('userId');
        let storageType = 'local'; // 기본값

        if (!storedToken) {
            // localStorage에 없으면 sessionStorage(임시) 확인
            storedToken = sessionStorage.getItem('accessToken');
            storedUserId = sessionStorage.getItem('userId');
            storageType = 'session';
        }

        if (storedToken && storedUserId) {
            setAuthToken(storedToken);
            setUser({ userId: storedUserId, token: storedToken, storageType: storageType });
        }
        setLoading(false);

        const errorInterceptor = axios.interceptors.response.use(
            (response) => response, // 성공한 응답은 그대로 통과
            (error) => {
                // [중요] 401(미인증) 또는 403(권한 없음/토큰만료) 에러를 감지하면
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    console.error("토큰이 만료되었거나 유효하지 않습니다. 자동 로그아웃합니다.");
                    logout(); // 로컬/세션 스토리지의 토큰 삭제
                    navigate('/login'); // 로그인 페이지로 쫓아냄
                }
                return Promise.reject(error); // 다른 에러는 그대로 반환
            }
        );

        // 컴포넌트 언마운트 시 인터셉터 제거 (메모리 누수 방지)
        return () => {
            axios.interceptors.response.eject(errorInterceptor);
        };
    }, [navigate]);

    // [수정] login 함수가 'rememberMe'를 받음
    const login = async (userId, password, rememberMe) => {
        const response = await axios.post('http://localhost:8080/api/auth/login', {
            userId,
            password,
        });

        const { accessToken, userId: loggedInUserId } = response.data;

        const storage = rememberMe ? localStorage : sessionStorage;
        const storageType = rememberMe ? 'local' : 'session';

        storage.setItem('accessToken', accessToken);
        storage.setItem('userId', loggedInUserId);

        setAuthToken(accessToken);
        setUser({ userId: loggedInUserId, token: accessToken, storageType: storageType });
    };

    const value = {
        user,
        isLoggedIn: !!user,
        loading,
        login,
        logout, // logout 함수는 이제 navigate 기능이 없음 (App.jsx에서 처리)
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