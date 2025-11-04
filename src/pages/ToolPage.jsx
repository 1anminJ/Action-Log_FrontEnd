import { useState } from 'react';
import axios from 'axios';

function ToolPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const [selectedFileName, setSelectedFileName] = useState(null);
    const [fileToUpload, setFileToUpload] = useState(null);

    const [isDragging, setIsDragging] = useState(false);

    // ... (handleFileSelect, handleFileChange, handleFileSubmit, handleDragOver, handleDragLeave, handleDrop 함수는 이전과 동일합니다) ...
    // ... (파일 선택 로직) ...
    const handleFileSelect = (file) => {
        if (file) {
            if (!file.type.startsWith('audio/')) {
                setError("오디오 파일만 업로드할 수 있습니다. (mp3, m4a, wav 등)");
                setSelectedFileName(null);
                setFileToUpload(null);
                return;
            }
            setSelectedFileName(file.name);
            setFileToUpload(file);
            setError(null);
            setResult(null);
        }
    };

    // ... (파일 변경 핸들러) ...
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        handleFileSelect(file);
    };

    // ... (API 호출 로직) ...
    const handleFileSubmit = async () => {
        if (!fileToUpload) {
            setError("파일을 선택해주세요.");
            return;
        }
        setLoading(true);
        setResult(null);
        setError(null);
        const formData = new FormData();
        formData.append('file', fileToUpload);
        try {
            const response = await axios.post('http://localhost:8080/api/summarize', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(response.data);
        } catch (err) {
            const errorMsg = err.response?.data?.summary || err.message;
            setError(`요약에 실패했습니다: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    // ... (드래그 이벤트 핸들러) ...
    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        handleFileSelect(file);
    };


    return (
        <div className="App">
            <header>
                <h1 style={{ color: '#1F2937' }}>Action Item 생성</h1>
                <p style={{ color: '#6B7280' }}>요약하고 싶은 강의나 회의 음성 파일을 올려주세요.</p>
            </header>

            {/* --- [수정] 2단 레이아웃 래퍼 --- */}
            <div className="tool-layout">

                {/* --- 1. 왼쪽 업로드 컬럼 --- */}
                <div className="upload-column">
                    {/* --- 드롭존 컨테이너 --- */}
                    <div
                        className={`dropzone ${isDragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            name="fileInput"
                            accept="audio/*"
                            onChange={handleFileChange}
                            id="fileInput"
                            style={{ display: 'none' }}
                        />

                        <label htmlFor="fileInput" className="file-label">
                            파일 선택
                        </label>
                        <p style={{ color: '#6B7280', margin: '10px 0' }}>
                            또는 파일을 여기에 드래그 앤 드롭하세요
                        </p>
                        <span className="file-name">
                          {selectedFileName ? `선택된 파일: ${selectedFileName}` : ""}
                        </span>
                    </div>
                    {/* --- 드롭존 끝 --- */}

                    {/* --- '요약하기' 버튼 --- */}
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
                    {/* --- 버튼 끝 --- */}
                </div>
                {/* --- 왼쪽 컬럼 끝 --- */}


                {/* --- 2. 오른쪽 결과 컬럼 --- */}
                <div className="result-column">
                    {/* --- 로딩, 에러, 결과 표시 --- */}
                    {loading && (
                        <div className="spinner-container">
                            <div className="spinner"></div>
                            <p>분석 중입니다. 잠시만 기다려주세요...</p>
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}

                    {result && (
                        <div className="result-container">
                            <h2>결과</h2>
                            <h3 style={{ color: '#065F46' }}>핵심 요약</h3>
                            <pre>{result.summary || "해당 없음"}</pre>
                            <h3 style={{ color: '#065F46' }}>주요 결정 사항</h3>
                            <pre>{result.decisions || "해당 없음"}</pre>
                            <h3 style={{ color: '#065F46' }}>Action Items (할 일)</h3>
                            <pre>{result.actionItems || "해당 없음"}</pre>
                        </div>
                    )}

                    {/* [추가] 아무 결과가 없을 때의 기본 상태 */}
                    {!loading && !error && !result && (
                        <div style={{ color: '#6B7280', textAlign: 'center', paddingTop: '4rem' }}>
                            <p style={{ fontSize: '1.2rem' }}>결과가 여기에 표시됩니다.</p>
                            <p>왼쪽에서 파일을 업로드해 주세요.</p>
                        </div>
                    )}
                </div>
                {/* --- 오른쪽 컬럼 끝 --- */}

            </div>
            {/* --- 2단 레이아웃 끝 --- */}
        </div>
    );
}

export default ToolPage;

