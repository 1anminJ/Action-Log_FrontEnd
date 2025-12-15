import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function HistoryPage() {
    const { user } = useAuth();
    const [allSummaries, setAllSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:8080/api/summaries/me');
                setAllSummaries(response.data);
            } catch (err) {
                setError('히스토리를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const filteredSummaries = useMemo(() => {
        let summaries = [...allSummaries];
        summaries.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
        if (searchTerm) {
            summaries = summaries.filter(s =>
                s.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return summaries;
    }, [allSummaries, searchTerm, sortOrder]);

    const formatDate = (isoString) => {
        if (!isoString) return '날짜 정보 없음';
        return new Date(isoString).toLocaleString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    };

    const handleDelete = async (summaryId) => {
        if (!window.confirm("정말로 이 요약본을 삭제하시겠습니까?")) {
            return;
        }
        try {
            await axios.delete(`http://localhost:8080/api/summaries/${summaryId}`);
            setAllSummaries(prevSummaries =>
                prevSummaries.filter(s => s.id !== summaryId)
            );
        } catch (err) {
            setError(`삭제에 실패했습니다: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <div className="page-container history-container">
            <header className="page-header" style={{ borderBottom: 'none', marginBottom: '2rem' }}>
                <h1>{user?.name}님의 요약 히스토리</h1>
                <p>총 {filteredSummaries.length}개의 요약본이 있습니다.</p>
            </header>

            <div className="history-filters">
                <input
                    type="text"
                    placeholder="제목으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="desc">최신순</option>
                    <option value="asc">오래된순</option>
                </select>
            </div>

            {loading && <div className="spinner-container"><div className="spinner"></div><p>데이터를 불러오는 중입니다...</p></div>}
            {error && <div className="error-message">{error}</div>}

            {!loading && !error && (
                <div className="history-list">
                    {filteredSummaries.length === 0 ? (
                        <div className="history-list-empty">
                            <p>{searchTerm ? '검색 결과가 없습니다.' : '요약 히스토리가 없습니다.'}</p>
                            <p>새로운 요약을 시작해 보세요.</p>
                            <Link to="/tool">새 요약하기</Link>
                        </div>
                    ) : (
                        filteredSummaries.map(s => (
                            <div key={s.id} className="history-card">
                                <button onClick={() => handleDelete(s.id)} className="history-card-delete-button">
                                    삭제
                                </button>
                                <h3>{s.title}</h3>
                                <p className="date">{formatDate(s.createdAt)}</p>

                                <h4>핵심 요약</h4>
                                <pre>{s.summary || "해당 없음"}</pre>

                                <h4>주요 결정 사항</h4>
                                <pre>{s.decisions || "해당 없음"}</pre>

                                <h4>Action Items (할 일)</h4>
                                <pre>{s.actionItems || "해당 없음"}</pre>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default HistoryPage;