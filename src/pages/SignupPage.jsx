import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
            await axios.post('http://localhost:8080/api/auth/signup', {
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
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="App"> {/* .App은 1280px 너비 */}
                <header style={{ borderBottom: 'none', marginBottom: '2rem' }}>
                    <h1>회원가입</h1>
                </header>

                {/* [수정] form 태그의 maxWidth를 '550px'로 확장 */}
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'block',
                        maxWidth: '550px', // [수정] 400px -> 550px
                        minWidth: '300px',
                        margin: '0 auto'   // 폼 자체를 .App 내부에서 중앙 정렬
                    }}
                >
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>아이디</label>
                        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}/>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>비밀번호</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}/>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>이름</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}/>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>이메일</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}/>
                    </div>
                    {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
                    <button type="submit" className="submit-button" style={{ width: '100%', backgroundColor: '#065F46', fontSize: '1rem' }}>
                        회원가입
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6B7280' }}>
                    이미 계정이 있으신가요? <Link to="/login" style={{ color: '#065F46', fontWeight: '600' }}>로그인</Link>
                </p>
            </div>
        </div>
    );
}

export default SignupPage;