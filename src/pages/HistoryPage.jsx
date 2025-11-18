import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function HistoryPage() {
    const { user } = useAuth();
    const [allSummaries, setAllSummaries] = useState([]); // 원본 데이터
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 필터링 State ---
    const [searchTerm, setSearchTerm] = useState(''); // 제목(파일명) 검색어
    const [sortOrder, setSortOrder] = useState('desc'); // 날짜 정렬 (desc: 최신순)

    // 1. 컴포넌트 마운트 시 API 호출
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                // (AuthContext가 토큰을 자동으로 헤더에 넣어줌)
                const response = await axios.get('http://localhost:8080/api/summaries/me');
                setAllSummaries(response.data);
            } catch (err) {
                setError('히스토리를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        // user가 로드된 후에 API 호출
        if (user) {
            fetchHistory();
        }
    }, [user]); // user가 변경될 때 (로그인 시) 실행

    // 2. 필터링된 결과 (검색어, 날짜 정렬)
    const filteredSummaries = useMemo(() => {
        let summaries = [...allSummaries];

        // 날짜 정렬
        summaries.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        // 제목(파일명) 검색
        if (searchTerm) {
            summaries = summaries.filter(s =>
                s.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return summaries;
    }, [allSummaries, searchTerm, sortOrder]);

    // 3. 날짜 포맷팅 헬퍼
    const formatDate = (isoString) => {
        if (!isoString) return '날짜 정보 없음';
        return new Date(isoString).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // --- [바코 3단계] 삭제 핸들러 추가 ---
    const handleDelete = async (summaryId) => {
        // [UX] 사용자에게 삭제 확인 (window.confirm 대신 간단한 confirm 사용)
        if (!confirm("정말로 이 요약본을 삭제하시겠습니까?")) {
            return;
        }

        try {
            // 1. 백엔드에 삭제 요청 (AuthContext가 토큰을 실어줌)
            await axios.delete(`http://localhost:8080/api/summaries/${summaryId}`);

            // 2. [중요] API 재호출 없이, 프론트엔드 상태(allSummaries)에서 즉시 제거
            setAllSummaries(prevSummaries =>
                prevSummaries.filter(s => s.id !== summaryId)
            );

        } catch (err) {
            // [UX] 에러 처리
            setError(`삭제에 실패했습니다: ${err.response?.data || err.message}`);
        }
    };
    // --- ---

    return (
        <div className="App" style={{ maxWidth: '1000px' }}> {/* 히스토리 페이지는 더 넓게 */}
            <header style={{ borderBottom: 'none', marginBottom: '2rem' }}>
                <h1>{user?.userId}님의 요약 히스토리</h1>
                <p style={{ color: '#6B7280' }}>총 {filteredSummaries.length}개의 요약본이 있습니다.</p>
            </header>

            {/* --- 필터링 UI --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="제목으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flexGrow: 1, minWidth: '300px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    style={{ minWidth: '150px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                >
                    <option value="desc">최신순</option>
                    <option value="asc">오래된순</option>
                </select>
            </div>

            {/* --- 결과 표시 --- */}
            {loading && <div className="spinner-container"><div className="spinner"></div><p>데이터를 불러오는 중입니다...</p></div>}
            {error && <div className="error-message">{error}</div>}

            {!loading && !error && (
                <div className="history-list">
                    {filteredSummaries.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#6B7280', padding: '4rem', border: '2px dashed #eee', borderRadius: '8px' }}>
                            <p style={{ fontSize: '1.2rem', margin: 0 }}>
                                {searchTerm ? '검색 결과가 없습니다.' : '요약 히스토리가 없습니다.'}
                            </p>
                            <p>새로운 요약을 시작해 보세요.</p>
                            <Link to="/tool" style={{
                                textDecoration: 'none',
                                padding: '10px 15px',
                                backgroundColor: '#065F46',
                                color: 'white',
                                borderRadius: '8px',
                                fontWeight: '600',
                                marginTop: '1rem',
                                display: 'inline-block',
                            }}>
                                새 요약하기
                            </Link>
                        </div>
                    ) : (
                        filteredSummaries.map(s => (
                            <div key={s.id} style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #eee',
                                borderRadius: '8px',
                                padding: '1.5rem',
                                marginBottom: '1rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                position: 'relative' // [추가] 삭제 버튼 위치의 기준
                            }}>

                                {/* --- [바코 3단계] 삭제 버튼 추가 --- */}
                                <button
                                    onClick={() => handleDelete(s.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '1.5rem',
                                        right: '1.5rem',
                                        padding: '5px 10px',
                                        backgroundColor: '#FEF2F2', // 연한 빨강
                                        color: '#DC2626', // 진한 빨강
                                        border: '1px solid #FEE2E2',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    삭제
                                </button>
                                {/* --- --- */}

                                <h3 style={{color: '#065F46', margin: '0 0 10px 0', fontSize: '1.25rem'}}>{s.title}</h3>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: '#6B7280',
                                    marginBottom: '1rem'
                                }}>{formatDate(s.createdAt)}</p>

                                <h4 style={{margin: '10px 0 5px 0'}}>핵심 요약</h4>
                                <pre style={{
                                    margin: 0,
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    backgroundColor: '#f9f9f9',
                                    padding: '10px',
                                    borderRadius: '4px'
                                }}>
                                    {s.summary || "해당 없음"}
                                </pre>

                                <h4 style={{margin: '20px 0 5px 0'}}>주요 결정 사항</h4>
                                <pre style={{
                                    margin: 0,
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    backgroundColor: '#f9f9f9',
                                    padding: '10px',
                                    borderRadius: '4px'
                                }}>
                                    {s.decisions || "해당 없음"}
                                </pre>

                                <h4 style={{margin: '20px 0 5px 0'}}>Action Items (할 일)</h4>
                                <pre style={{
                                    margin: 0,
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    backgroundColor: '#f9f9f9',
                                    padding: '10px',
                                    borderRadius: '4px'
                                }}>
                                    {s.actionItems || "해당 없음"}
                                </pre>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default HistoryPage;