import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function ToolPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const [selectedFileName, setSelectedFileName] = useState(null);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [title, setTitle] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    // ... (handleFileSelect, handleFileChange, 드래그 핸들러들 동일) ...
    const handleFileSelect = (file) => {
        if (file) {
            if (!file.type.startsWith('audio/')) {
                setError("오디오 파일만 업로드할 수 있습니다.");
                setFileToUpload(null);
                setSelectedFileName(null);
                return;
            }
            setSelectedFileName(file.name);
            setFileToUpload(file);
            const defaultTitle = file.name.split('.').slice(0, -1).join('.');
            setTitle(defaultTitle);
            setError(null);
            setResult(null);
        }
    };
    const handleFileChange = (event) => {
        handleFileSelect(event.target.files[0]);
    };
    const handleDragOver = (event) => { event.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (event) => { event.preventDefault(); setIsDragging(false); };
    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFileSelect(event.dataTransfer.files[0]);
    };

    // API 호출 로직
    const handleFileSubmit = async () => {
        if (!fileToUpload) {
            setError("파일을 선택해주세요.");
            return;
        }
        if (!title) {
            setError("제목을 입력해주세요.");
            return;
        }

        setLoading(true);
        setResult(null);
        setError(null);

        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('title', title);

        try {
            // [수정 없음] headers가 없는 것이 올바른 코드입니다.
            const response = await axios.post(`${API_BASE_URL}/api/summarize`, formData);

            setResult(response.data);

        } catch (err) {
            // --- [‼️ 핵심 수정 ‼️] ---
            // 에러가 발생하면, err.response.status를 정확히 찍어줍니다.
            if (err.response) {
                // 백엔드에서 응답이 온 경우 (403, 500, 400 등)
                setError(`요약 실패: ${err.response.status} (${err.response.data?.message || err.message})`);
            } else if (err.request) {
                // 요청은 갔으나 응답이 오지 않은 경우 (네트워크 오류)
                setError("요약 실패: 서버에서 응답이 없습니다.");
            } else {
                // 기타 에러
                setError(`요약 실패: ${err.message}`);
            }
            // -------------------------
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <header>
                <h1 style={{ color: '#1F2937' }}>Action Item 생성</h1>
                <p style={{ color: '#6B7280' }}>요약하고 싶은 강의나 회의 음성 파일을 올려주세요.</p>
            </header>

            <div className="tool-layout">
                {/* ... (왼쪽/오른쪽 컬럼 JSX 코드는 이전과 동일) ... */}
                <div className="upload-column">
                    <div
                        className={`dropzone ${isDragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input type="file" name="fileInput" accept="audio/*" onChange={handleFileChange} id="fileInput" style={{ display: 'none' }} />
                        <label htmlFor="fileInput" className="file-label">파일 선택</label>
                        <p style={{ color: '#6B7280', margin: '10px 0' }}>또는 파일을 여기에 드래그 앤 드롭하세요</p>
                        <span className="file-name">{selectedFileName ? `선택된 파일: ${selectedFileName}` : ""}</span>
                    </div>

                    {fileToUpload && (
                        <div style={{ margin: '1.5rem 0' }}>
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>요약본 제목</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="요약본 제목을 입력하세요"
                                required
                                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                            />
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <button
                            onClick={handleFileSubmit}
                            disabled={loading || !fileToUpload}
                            className="submit-button"
                            style={{
                                backgroundColor: (loading || !fileToUpload) ? '#ccc' : '#065F46',
                                width: '100%',
                            }}
                        >
                            {loading ? "요약 중..." : "요약하기"}
                        </button>
                    </div>
                </div>

                <div className="result-column">
                    {loading && (
                        <div className="spinner-container">
                            <div className="spinner"></div>
                            <p>분석 중입니다. 잠시만 기다려주세요...</p>
                        </div>
                    )}
                    {error && <div className="error-message">{error}</div>}
                    {result && (
                        <div className="result-container">
                            <h2>요약 결과</h2>
                            <h3 style={{ color: '#065F46' }}>핵심 요약</h3>
                            <pre>{result.summary || "해당 없음"}</pre>
                            <h3 style={{ color: '#065F46' }}>주요 결정 사항</h3>
                            <pre>{result.decisions || "해당 없음"}</pre>
                            <h3 style={{ color: '#065F46' }}>Action Items (할 일)</h3>
                            <pre>{result.actionItems || "해당 없음"}</pre>
                        </div>
                    )}
                    {!loading && !error && !result && (
                        <div style={{ color: '#6B7280', textAlign: 'center', paddingTop: '4rem' }}>
                            <p style={{ fontSize: '1.2rem' }}>결과가 여기에 표시됩니다.</p>
                            <p>왼쪽에서 파일을 업로드해 주세요.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ToolPage;
