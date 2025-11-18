import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // [추가]

function App() {
    const { isLoggedIn, user, logout } = useAuth(); // [추가]
    const navigate = useNavigate(); // [추가]

    const handleLogout = () => {
        logout();
        navigate('/'); // 로그아웃 시 홈으로 이동
    };

    return (
        <div>
            <nav style={{
                padding: '1rem 2rem',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #eee',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <Link to="/" style={{textDecoration: 'none', color: '#1F2937', fontWeight: 'bold', fontSize: '1.5rem'}}>
                    Action-Log
                </Link>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    {isLoggedIn ? (
                        <>
                            <span style={{color: '#555'}}>{user.userId}님, 환영합니다!</span>

                            {/* [수정] 현재 위치에 따라 버튼 변경 */}
                            {location.pathname.startsWith('/tool') ? (
                                // /tool 페이지에 있을 때
                                <Link to="/history"
                                      style={{textDecoration: 'none', color: '#065F46', fontWeight: '600'}}>
                                    요약 목록
                                </Link>
                            ) : (
                                // / (홈) 또는 /history 페이지에 있을 때
                                <Link to="/tool" style={{textDecoration: 'none', color: '#065F46', fontWeight: '600'}}>
                                    새 요약하기
                                </Link>
                            )}

                            <button onClick={handleLogout} style={{
                                padding: '10px 15px',
                                backgroundColor: '#6B7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{
                                textDecoration: 'none',
                                padding: '10px 15px',
                                backgroundColor: '#065F46',
                                color: 'white',
                                borderRadius: '8px',
                                fontWeight: '600'
                            }}>
                                로그인
                            </Link>
                            <Link to="/signup" style={{
                                textDecoration: 'none',
                                padding: '10px 15px',
                                backgroundColor: '#f9f9f9',
                                color: '#333',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontWeight: '600'
                            }}>
                                회원가입
                            </Link>
                        </>
                    )}
                </div>
            </nav>
            <main>
                <Outlet/>
            </main>

            {/* --- Footer --- */}
            <footer style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                marginTop: '4rem',
                borderTop: '1px solid #eee',
                backgroundColor: '#FFFFFF'
            }}>
                <div style={{marginBottom: '1.5rem'}}>
                    <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" title="GitHub"
                       style={{margin: '0 15px', color: '#6B7280', textDecoration: 'none'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 0C5.373 0 0 5.373 0 12C0 17.303 3.438 21.8 8.207 23.387C8.807 23.497 9.027 23.137 9.027 22.827C9.027 22.547 9.017 21.787 9.017 20.987C5.677 21.687 4.967 19.507 4.967 19.507C4.417 18.067 3.637 17.707 3.637 17.707C2.527 16.947 3.717 16.967 3.717 16.967C4.927 17.057 5.577 18.187 5.577 18.187C6.687 20.047 8.527 19.497 9.207 19.207C9.317 18.447 9.617 17.917 9.947 17.637C7.227 17.337 4.367 16.297 4.367 11.727C4.367 10.387 4.847 9.307 5.607 8.477C5.497 8.177 5.067 6.907 5.727 5.257C5.727 5.257 6.757 4.947 9.007 6.497C9.997 6.227 11.027 6.097 12.047 6.097C13.067 6.097 14.097 6.227 15.087 6.497C17.337 4.947 18.367 5.257 18.367 5.257C19.027 6.907 18.597 8.177 18.487 8.477C19.247 9.307 19.727 10.387 19.727 11.727C19.727 16.307 16.867 17.337 14.137 17.637C14.547 17.987 14.917 18.667 14.917 19.697C14.917 21.147 14.907 22.317 14.907 22.827C14.907 23.137 15.127 23.497 15.737 23.387C20.562 21.797 24 17.302 24 12C24 5.373 18.627 0 12 0Z"/>
                        </svg>
                    </a>
                    <a href="mailto:your-email@example.com" title="Email"
                       style={{margin: '0 15px', color: '#6B7280', textDecoration: 'none'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"/>
                        </svg>
                    </a>
                </div>
                <p style={{color: '#6B7280', margin: 0, fontSize: '0.9rem'}}>
                    © 2025 Action-Log. Created by MinJeong Han.
                </p>
            </footer>
        </div>
    );
}

export default App;