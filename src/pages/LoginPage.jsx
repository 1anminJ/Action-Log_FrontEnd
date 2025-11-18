import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true); // [추가] 자동 로그인 상태
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            // [수정] login 함수에 rememberMe 상태 전달
            await login(userId, password, rememberMe);
            navigate('/tool');
        } catch (err) {
            setError('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
    };

    return (
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="App">
                <header style={{ borderBottom: 'none', marginBottom: '2rem' }}>
                    <h1>로그인</h1>
                </header>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'block',
                        maxWidth: '550px',
                        minWidth: '300px',
                        margin: '0 auto'
                    }}
                >
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>아이디</label>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                        />
                    </div>

                    {/* --- [추가] 자동 로그인 체크박스 --- */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                style={{ marginRight: '8px' }}
                            />
                            자동 로그인
                        </label>
                    </div>
                    {/* --- --- */}

                    {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
                    <button type="submit" className="submit-button" style={{ width: '100%', backgroundColor: '#065F46', fontSize: '1rem' }}>
                        로그인
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6B7280' }}>
                    계정이 없으신가요? <Link to="/signup" style={{ color: '#065F46', fontWeight: '600' }}>회원가입</Link>
                </p>
            </div>
        </div>
    );
}
export default LoginPage;