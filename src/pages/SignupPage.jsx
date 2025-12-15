import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function SignupPage() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await axios.post(`${API_BASE_URL}/api/auth/signup`, {
                userId,
                password,
                name,
                email,
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || '회원가입에 실패했습니다.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-wrapper">
                <header className="page-header">
                    <h1>회원가입</h1>
                </header>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>아이디</label>
                        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>비밀번호</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>이름</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>이메일</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="submit-button">
                        회원가입
                    </button>
                </form>

                <p className="auth-switch-link">
                    이미 계정이 있으신가요? <Link to="/login">로그인</Link>
                </p>
            </div>
        </div>
    );
}

export default SignupPage;