import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

function HomePage() {
    const sliderSettings = {
        dots: true,       // 아래쪽에 ... 점 표시
        infinite: true,   // 무한 반복
        speed: 500,       // 넘어가는 속도
        slidesToShow: 1,  // 한 번에 1장만
        slidesToScroll: 1,
        autoplay: true,   // 자동 넘김
        autoplaySpeed: 3000, // 3초마다
    };

    // 1. "소개 섹션"을 가리킬 참조(ref) 생성
    const featureRef = useRef(null);

    // 2. "소개 섹션"으로 부드럽게 스크롤하는 함수
    const scrollToFeatures = () => {
        featureRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            {/* --- 1. 첫 화면 (Hero 섹션) --- */}
            <section style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 'calc(100vh - 145px)',
                padding: '2rem 4rem',
                backgroundColor: '#FFFFFF',
                position: 'relative', // [추가] 화살표 버튼의 부모 기준
                overflow: 'hidden'
            }}>

                {/* 왼쪽: 텍스트 영역 */}
                <div style={{flex: 1, paddingRight: '2rem', textAlign: 'left'}}>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: '700',
                        margin: '0 0 1rem 0',
                        color: '#1F2937' // [수정] 진한 글자색
                    }}>
                        AI가 대신 정리해 드립니다.
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#6B7280', // [수정] 중간 회색
                        marginBottom: '2rem',
                        maxWidth: '500px'
                    }}>
                        강의나 회의 녹음본을 올리면, AI가 핵심만 요약하고 Action Item까지 뽑아줍니다.
                    </p>
                    <Link to="/tool" style={{
                        textDecoration: 'none',
                        padding: '1rem 2rem',
                        backgroundColor: '#065F46', // [수정] Key Color (진한 녹색)
                        color: 'white',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        transition: 'transform 0.1s'
                    }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        지금 바로 요약하기
                    </Link>
                </div>

                {/* 오른쪽: 이미지 캐러셀 영역 */}
                <div style={{flex: 1, maxWidth: '45%'}}>
                    <Slider {...sliderSettings}>
                        {/* 여기에 이미지 3장을 넣습니다. (지금은 임시 박스) */}
                        <div>
                            <img src="/assets/기능1.png" alt="기능 1"
                                 style={{width: '100%', borderRadius: '8px'}}/>
                            {/* <div style={{ height: '300px', backgroundColor: '#ECFDF5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h3>이미지 1 (예: 요약)</h3></div> */}
                        </div>
                        <div>
                            <img src="/assets/기능1.png" alt="기능 2"
                                 style={{width: '100%', borderRadius: '8px'}}/>
                            {/* <div style={{ height: '300px', backgroundColor: '#ECFDF5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h3>이미지 2 (예: 할 일)</h3></div> */}
                        </div>
                        <div>
                            <img src="/assets/기능1.png" alt="기능 3"
                                 style={{width: '100%', borderRadius: '8px'}}/>
                            {/* <div style={{ height: '300px', backgroundColor: '#ECFDF5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h3>이미지 3 (예: 모바일)</h3></div> */}
                        </div>
                    </Slider>
                </div>

                <div
                    onClick={scrollToFeatures}
                    style={{
                        position: 'absolute', // Hero 섹션 맨 아래에 고정
                        bottom: '30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        cursor: 'pointer',
                        padding: '10px'
                    }}
                >
                    {/* 인라인 SVG 화살표 (애니메이션 효과) */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                         style={{animation: 'bounce 2s infinite'}}>
                        <path d="M12 17.59L4.92999 10.52L6.33999 9.11001L12 14.77L17.66 9.11001L19.07 10.52L12 17.59Z"
                              fill="#6B7280"/>
                    </svg>
                </div>
            </section>

            {/* --- 2. 소개 섹션 (Feature 섹션) --- */}
            {/* 여기는 흰색 배경을 유지하여 명확한 대비를 줌 */}
            <section ref={featureRef}
                     style={{
                         backgroundColor: '#F9FAFB',
                         padding: '6rem 2rem',
                         borderTop: '1px solid #eee',
                         borderBottom: '1px solid #eee',
                         minHeight: 'calc(100vh - 500px)'
                     }}
            >
                <div style={{maxWidth: '900px', margin: '0 auto'}}>
                    <h2 style={{
                        textAlign: 'center',
                        fontSize: '2rem',
                        marginBottom: '3rem',
                        color: '#1F2937'
                    }}>
                        Action-Log의 핵심 기능
                    </h2>
                    {/* 핵심 기능 박스들은 '밝은 녹색'을 사용해서 톤을 맞춤 */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem'
                    }}>

                        <div style={{backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '8px'}}>
                            <h3 style={{color: '#065F46', margin: 0}}>🚀 빠른 음성 인식</h3>
                            <p style={{color: '#6B7280'}}>Whisper AI 엔진을 사용하여 긴 음성 파일도 순식간에 텍스트로 변환합니다.</p>
                        </div>

                        <div style={{backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '8px'}}>
                            <h3 style={{color: '#065F46', margin: 0}}>🎯 핵심 요약</h3>
                            <p style={{color: '#6B7280'}}>GPT가 전체 내용을 분석하여, 가장 중요한 핵심 주제와 맥락을 3줄로 요약합니다.</p>
                        </div>

                        <div style={{backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '8px'}}>
                            <h3 style={{color: '#065F46', margin: 0}}>📋 할 일 추출</h3>
                            <p style={{color: '#6B7280'}}>'누가, 무엇을, 언제까지' 해야 하는지 할 일 목록만 따로 정리해 시간을 절약합니다.</p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;